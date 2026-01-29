import { useState, useEffect } from 'react';

// IMPORTAÇÃO DOS COMPONENTES
import BalanceCard from '../components/MostrarBalancoAtual';
import BarraFiltros from '../components/BarraFiltros';
import ResumoFiltros from '../components/ResumoFiltros';
import TabelaContas from '../components/TabelaContas';
import Header from "../components/Header";

// IMPORTAÇÃO DOS 3 MODAIS
import ModalPagamento from '../components/modais/ModalPagamento';
import ModalAdicionarSaldo from '../components/modais/ModalAdicionarSaldo';
import ModalCarteiras from '../components/modais/ModalCarteiras';


function Dashboard({usuarioId}) {
    // 1. ESTADOS VISUAIS (Controle dos Modais)
    const [modalSaldoAberto, setModalSaldoAberto] = useState(false);
    const [modalCarteirasAberto, setModalCarteirasAberto] = useState(false);
    const [contaParaPagar, setContaParaPagar] = useState(null);

// 2. ESTADOS DE DADOS (Começam Vazios)
    const [listaCategorias, setListaCategorias] = useState([]);
    const [minhasCarteiras, setMinhasCarteiras] = useState([]);
    const [listaContas, setListaContas] = useState([]);

// --- NOVOS ESTADOS DOS FILTROS ---
    const [filtros, setFiltros] = useState({
        inicio: '2026-01-01',
        fim: '2026-12-31',
        categoria: '',
        texto: ''
    });

    const [resumoValores, setResumoValores] = useState({
        entradas: 0,
        saidas: 0
    });

    const saldoTotal = minhasCarteiras.reduce((acumulator, item) =>{
        return acumulator + Number(item.saldo);
    },0);

    const totalDividas = listaContas
        .filter(c => c.status !== 'PAGO')
        .reduce((acc, item) => acc + Number(item.valor),0);

// O EFEITO (Gatilho inicial)
    useEffect(() => {
        async function buscarDados() {
            // SEGURANÇA: Se não tiver ID (usuário deslogado), não busca nada pra não dar erro
            if (!usuarioId) return;

            try {
                // CABEÇALHO PADRÃO COM O ID DO USUÁRIO
                const headers = { 'user-id': usuarioId };

                // --- PARTE 1: BUSCAR CATEGORIAS ---
                const respostaCat = await fetch('http://localhost:3333/categorias', { headers });
                if (!respostaCat.ok) throw new Error('Erro ao buscar categorias');
                const dadosCat = await respostaCat.json();
                setListaCategorias(dadosCat);

                // --- PARTE 2: BUSCAR CONTAS ---
                const respostaContas = await fetch('http://localhost:3333/contas', { headers });
                if (!respostaContas.ok) throw new Error('Erro ao buscar contas');
                const dadosContasBrutos = await respostaContas.json();

                // --- PARTE 3: A TRADUÇÃO ---
                const contasTraduzidas = dadosContasBrutos.map((item) => {
                    return {
                        ...item,
                        numero_boleto: item.referencia,
                        emissao: item.data_emissao ? item.data_emissao.split('T')[0] : '',
                        vencimento: item.data_vencimento ? item.data_vencimento.split('T')[0] : ''
                    };
                });
                setListaContas(contasTraduzidas);

                // --- PARTE 4: CARTEIRAS ---
                const res3 = await fetch('http://localhost:3333/carteiras', { headers });
                if (res3.ok) {
                    const dadosCarteiras = await res3.json();
                    setMinhasCarteiras(dadosCarteiras);
                }

            } catch (erro) {
                console.error("Erro ao buscar dados:", erro);
            }
        }

        buscarDados();
        // Adicionamos usuarioId na dependência: se mudar o usuário, recarrega tudo
    }, [usuarioId]);


// --- CÁLCULO DO RESUMO (ENTRADAS E SAÍDAS) ---
    useEffect(() => {
        async function calcularResumo() {
            if (!usuarioId) return;

            try {
                const url = `http://localhost:3333/movimentacoes?inicio=${filtros.inicio}&fim=${filtros.fim}`;

                // AQUI TAMBÉM PRECISA DO HEADER AGORA!
                const res = await fetch(url, { headers: { 'user-id': usuarioId } });
                const movs = await res.json();

                // Soma apenas o que for tipo 'ENTRADA' e não for estorno
                const totalEntradas = movs
                    .filter(m =>
                        m.tipo === 'ENTRADA' &&
                        !m.descricao.toLowerCase().includes('estorno')
                    )
                    .reduce((acc, m) => acc + Number(m.valor), 0);

                // Calcular SAÍDAS
                const totalSaidas = listaContas
                    .filter(c => c.status === 'PAGO' &&
                        new Date(c.vencimento) >= new Date(filtros.inicio) &&
                        new Date(c.vencimento) <= new Date(filtros.fim))
                    .reduce((acc, c) => acc + Number(c.valor_original), 0);

                setResumoValores({ entradas: totalEntradas, saidas: totalSaidas });

            } catch (erro) {
                console.error("Erro ao calcular resumo:", erro);
            }
        }

        calcularResumo();
    }, [filtros, listaContas, usuarioId]); // Adicionado usuarioId


// 3. FUNÇÕES DE AÇÃO (TODAS COM HEADER AGORA)

    const criarConta = async (novaConta) => {
        try {
            const resposta = await fetch('http://localhost:3333/contas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': usuarioId // <--- IMPORTANTE
                },
                body: JSON.stringify(novaConta)
            });

            if (!resposta.ok) throw new Error('Erro ao salvar conta');
            const contaVindaDoBanco = await resposta.json();

            const contaTraduzida = {
                ...contaVindaDoBanco,
                numero_boleto: contaVindaDoBanco.referencia,
                emissao: contaVindaDoBanco.data_emissao ? contaVindaDoBanco.data_emissao.split('T')[0] : '',
                vencimento: contaVindaDoBanco.data_vencimento ? contaVindaDoBanco.data_vencimento.split('T')[0] : ''
            };

            setListaContas((listaAtual) => [...listaAtual, contaTraduzida]);

        } catch (erro) {
            console.error("Erro ao criar conta:", erro);
        }
    };

    const excluirConta = async (id) =>{
        try{
            // DELETE também precisa de header pra saber se a conta é sua
            const resposta = await fetch(`http://localhost:3333/contas/${id}`,{
                method: 'DELETE',
                headers: { 'user-id': usuarioId }
            });

            if (!resposta.ok) throw new Error('Erro ao excluir conta');
            setListaContas((listaAtual) => listaAtual.filter(item => item.id !== id));
        } catch (erro) {
            console.error("Erro ao excluir conta",erro);
        }
    };

    const editarConta = async (contaEditada) => {
        try {
            const resposta = await fetch(`http://localhost:3333/contas/${contaEditada.id}`,{
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    'user-id': usuarioId // <--- IMPORTANTE
                },
                body: JSON.stringify(contaEditada)
            });

            if (!resposta.ok) throw new Error('Erro ao editar conta');
            const contaVindaDobanco = await resposta.json();

            // Precisamos traduzir de volta pois o PUT retorna nomes do banco
            const contaTraduzida = {
                ...contaVindaDobanco,
                numero_boleto: contaVindaDobanco.referencia,
                emissao: contaVindaDobanco.data_emissao ? contaVindaDobanco.data_emissao.split('T')[0] : '',
                vencimento: contaVindaDobanco.data_vencimento ? contaVindaDobanco.data_vencimento.split('T')[0] : ''
            };

            setListaContas((listaAtual) => listaAtual.map(item => item.id === contaEditada.id ? contaTraduzida : item));
        }catch(erro) {
            console.error("Erro ao editar conta",erro);
        }
    };

    const adicionarSaldo = async (dadosDoModal) => {
        try {
            const resposta = await fetch('http://localhost:3333/movimentacoes/entrada',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'user-id': usuarioId // <--- IMPORTANTE
                },
                body: JSON.stringify(dadosDoModal)
            });

            if(!resposta.ok) throw new Error('Erro ao depositar');

            const resCarteiras = await fetch('http://localhost:3333/carteiras', { headers: { 'user-id': usuarioId } });
            setMinhasCarteiras(await resCarteiras.json());

            // Atualizar resumo também
            const resumoFake = {...filtros}; // Truque pra forçar re-render do resumo
            setFiltros(resumoFake);

            console.log("Saldo Adicionado com sucesso!");
        }catch(erro) {
            console.error(erro);
        }
    }

    const abrirModalPagamento = (conta) => {
        setContaParaPagar(conta);
    };

    const efetuarPagamento = async (dados) => {
        try {
            const resposta = await fetch('http://localhost:3333/contas/pagar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': usuarioId // <--- IMPORTANTE
                },
                body: JSON.stringify(dados)
            });

            if (!resposta.ok) throw new Error('Erro ao processar pagamento');

            const resContas = await fetch('http://localhost:3333/contas', { headers: { 'user-id': usuarioId } });
            const dadosContas = await resContas.json();

            const contasTraduzidas = dadosContas.map(item => ({
                ...item,
                numero_boleto: item.referencia,
                emissao: item.data_emissao ? item.data_emissao.split('T')[0] : '',
                vencimento: item.data_vencimento ? item.data_vencimento.split('T')[0] : ''
            }));
            setListaContas(contasTraduzidas);

            const resCarteiras = await fetch('http://localhost:3333/carteiras', { headers: { 'user-id': usuarioId } });
            setMinhasCarteiras(await resCarteiras.json());

        } catch (erro) {
            console.error("Erro no pagamento:", erro);
        }
    };

    const estornarConta = async (idConta) => {
        if (!window.confirm("Deseja desfazer este pagamento?")) return;

        try {
            const resposta = await fetch('http://localhost:3333/contas/estornar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': usuarioId // <--- IMPORTANTE
                },
                body: JSON.stringify({ conta_id: idConta })
            });

            if (resposta.ok) {
                const resContas = await fetch('http://localhost:3333/contas', { headers: { 'user-id': usuarioId } });
                const dadosContas = await resContas.json();

                const contasTraduzidas = dadosContas.map(item => ({
                    ...item,
                    numero_boleto: item.referencia,
                    emissao: item.data_emissao ? item.data_emissao.split('T')[0] : '',
                    vencimento: item.data_vencimento ? item.data_vencimento.split('T')[0] : ''
                }));
                setListaContas(contasTraduzidas);

                const resCarteiras = await fetch('http://localhost:3333/carteiras', { headers: { 'user-id': usuarioId } });
                setMinhasCarteiras(await resCarteiras.json());

                alert("Estorno realizado!");
            } else {
                alert("Erro no servidor ao estornar.");
            }
        } catch (erro) {
            console.error("Erro ao estornar:", erro);
        }
    };

    const contasFiltradasParaExibir = listaContas.filter(conta => {
        const dataConta = new Date(conta.vencimento);
        const dataInicio = new Date(filtros.inicio);
        const dataFim = new Date(filtros.fim);

        const bateData = dataConta >= dataInicio && dataConta <= dataFim;
        const bateCategoria = filtros.categoria === '' || String(conta.categoria_id) === String(filtros.categoria);
        const buscaMinusculo = filtros.texto.toLowerCase();
        const bateBusca = conta.nome.toLowerCase().includes(buscaMinusculo) ||
            conta.descricao.toLowerCase().includes(buscaMinusculo);

        return bateData && bateCategoria && bateBusca;
    });

    return (
        <div style={{ padding: '20px', backgroundColor: '#121212', minHeight: '100vh' }}>



            <BalanceCard
                despesas={totalDividas}
                caixa={saldoTotal}
                aoClicarAdicionar={() => setModalSaldoAberto(true)}
                aoClicarCarteiras={() => setModalCarteirasAberto(true)}
            />

            {/* Passamos a lista vazia. O Select vai ficar vazio por enquanto. */}
            {/* 1. BARRA DE FILTROS */}
            {/* Passamos a função 'setFiltros' para atualizar o estado quando clicar em filtrar */}
            <BarraFiltros
                opcoesCategorias={listaCategorias}
                aoClicarEmFiltrar={(novosDados) => setFiltros(novosDados)}
            />

            {/* 2. RESUMO DOS FILTROS */}
            {/* Passamos os valores calculados no Passo 4 */}
            <ResumoFiltros
                entradas={resumoValores.entradas}
                saidas={resumoValores.saidas}
            />

            {/* 3. TABELA DE CONTAS */}
            {/* ATENÇÃO: Aqui trocamos 'listaContas' por 'contasFiltradasParaExibir' */}

            <TabelaContas
                categorias={listaCategorias}
                dados={contasFiltradasParaExibir}
                aoClicarPagar={abrirModalPagamento}
                aoSalvarNovaConta={criarConta}
                aoSalvarEdicao={editarConta}
                aoExcluirConta={excluirConta}
                aoClicarEstornar={estornarConta}
            />

            {/* --- ÁREA DOS 3 MODAIS --- */}

            {contaParaPagar && (
                <ModalPagamento
                    conta={contaParaPagar}
                    carteiras={minhasCarteiras}
                    aoFechar={() => setContaParaPagar(null)}
                    aoConfirmar={efetuarPagamento}
                />
            )}

            {modalSaldoAberto && (
                <ModalAdicionarSaldo
                    carteiras={minhasCarteiras}
                    aoSalvar={adicionarSaldo}
                    aoFechar={() => setModalSaldoAberto(false)}
                />
            )}

            {modalCarteirasAberto && (
                <ModalCarteiras
                    carteiras={minhasCarteiras}
                    aoFechar={() => setModalCarteirasAberto(false)}
                />
            )}

        </div>
    )
}

export default Dashboard;

