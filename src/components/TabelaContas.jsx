import { useState } from 'react';
import styles from '../modules/TabelaContas.module.css';

function TabelaContas({ dados = [], categorias = [], aoClicarPagar, aoSalvarNovaConta, aoSalvarEdicao, aoExcluirConta,aoClicarEstornar }) {

    const [abaAtiva, setAbaAtiva] = useState('a_pagar');
    const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

    const [novaContaTemp, setNovaContaTemp] = useState({
        numero_boleto: '', categoria_id: '', nome: '', descricao: '', valor: '', emissao: '', vencimento: ''
    });

    const [editandoId, setEditandoId] = useState(null);
    const [dadosEdicao, setDadosEdicao] = useState({});

    const formatarValor = (valor) => {
        if (!valor) return 'R$ 0,00';
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const mudarInputNovaConta = (campo, valor) => setNovaContaTemp(prev => ({ ...prev, [campo]: valor }));

    const confirmarNovaConta = () => {
        aoSalvarNovaConta(novaContaTemp);
        setNovaContaTemp({ numero_boleto: '', categoria_id: '', nome: '', descricao: '', valor: '', emissao: '', vencimento: '' });
        setMostrandoFormulario(false);
    };

    const iniciarEdicao = (item) => {
        setEditandoId(item.id);
        setDadosEdicao({ ...item });
    };

    const aoMudarInputEdicao = (campo, valor) => setDadosEdicao(prev => ({ ...prev, [campo]: valor }));

    const confirmarEdicao = () => {
        aoSalvarEdicao(dadosEdicao);
        setEditandoId(null);
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
        setDadosEdicao({});
    };

    const contasFiltradas = dados.filter((item) => {
        if (abaAtiva === 'a_pagar') {
            return item.status === 'PENDENTE' || item.status === 'PARCIAL';
        } else {
            return item.status === 'PAGO';
        }
    });

    return (
        <div className={styles.containerPrincipal}>
            <div className={styles.containerAbas}>
                <button
                    className={`${styles.aba} ${abaAtiva === 'a_pagar' ? styles.abaAtivaBase + ' ' + styles.abaVermelha : ''}`}
                    onClick={() => { setAbaAtiva('a_pagar'); setMostrandoFormulario(false); setEditandoId(null); }}
                >
                    A PAGAR
                </button>
                <button
                    className={`${styles.aba} ${abaAtiva === 'pago' ? styles.abaAtivaBase + ' ' + styles.abaVerde : ''}`}
                    onClick={() => { setAbaAtiva('pago'); setMostrandoFormulario(false); setEditandoId(null); }}
                >
                    PAGO
                </button>
            </div>

            <div className={styles.corpoTabela}>
                <div className={styles.cabecalhoTabela}>
                    <div className={`${styles.tituloColuna} ${styles.colunaId}`}>N°</div>
                    <div className={`${styles.tituloColuna} ${styles.colunaCategoria}`}>CATEGORIA</div>
                    <div className={`${styles.tituloColuna} ${styles.colunaNome}`}>NOME</div>
                    <div className={`${styles.tituloColuna} ${styles.colunaDesc}`}>DESCRIÇÃO</div>
                    <div className={`${styles.tituloColuna} ${styles.colunaValor}`}>VALOR</div>
                    <div className={`${styles.tituloColuna} ${styles.colunaData}`}>EMISSÃO</div>
                    <div className={`${styles.tituloColuna} ${styles.colunaData}`}>VENCIMENTO</div>
                    <div className={`${styles.tituloColuna} ${styles.colunaAcoes}`} style={{ display: 'flex', justifyContent: 'center' }}>
                        {abaAtiva === 'a_pagar' ? (
                            <button className={styles.botaoNovaConta} onClick={() => setMostrandoFormulario(true)}>Nova Conta</button>
                        ) : (
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>AÇÕES</span>
                        )}
                    </div>
                </div>

                {abaAtiva === 'a_pagar' && mostrandoFormulario && (
                    <div className={`${styles.linhaContainer} ${styles.bordaVermelha}`}>
                        {/* Campos do formulário (omitidos para brevidade, mantenha os seus) */}
                        <div className={styles.colunaId}><input className={styles.inputLinha} placeholder="Boleto" value={novaContaTemp.numero_boleto} onChange={(e) => mudarInputNovaConta('numero_boleto', e.target.value)} /></div>
                        <div className={styles.colunaCategoria}>
                            <select className={styles.inputLinha} value={novaContaTemp.categoria_id} onChange={(e) => mudarInputNovaConta('categoria_id', e.target.value)}>
                                <option value="">Selecione</option>
                                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                            </select>
                        </div>
                        <div className={styles.colunaNome}><input className={styles.inputLinha} placeholder="Nome" value={novaContaTemp.nome} onChange={(e) => mudarInputNovaConta('nome', e.target.value)} /></div>
                        <div className={styles.colunaDesc}><input className={styles.inputLinha} placeholder="Desc" value={novaContaTemp.descricao} onChange={(e) => mudarInputNovaConta('descricao', e.target.value)} /></div>
                        <div className={styles.colunaValor}><input className={styles.inputLinha} type="number" placeholder="0,00" value={novaContaTemp.valor} onChange={(e) => mudarInputNovaConta('valor', e.target.value)} /></div>
                        <div className={styles.colunaData}><input className={styles.inputLinha} type="date" value={novaContaTemp.emissao} onChange={(e) => mudarInputNovaConta('emissao', e.target.value)} /></div>
                        <div className={styles.colunaData}><input className={styles.inputLinha} type="date" value={novaContaTemp.vencimento} onChange={(e) => mudarInputNovaConta('vencimento', e.target.value)} /></div>
                        <div className={styles.colunaAcoes}>
                            <button className={`${styles.btnIcon} ${styles.btnSalvar}`} onClick={confirmarNovaConta}><i className="fa-solid fa-floppy-disk"></i></button>
                            <button className={`${styles.btnIcon} ${styles.btnCancelar}`} onClick={() => setMostrandoFormulario(false)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                )}

                <div className={styles.listaDeItens}>
                    {contasFiltradas.length === 0 ? (
                        <div className={styles.mensagemVazio}>Nenhuma conta encontrada.</div>
                    ) : (
                        contasFiltradas.map((item) => {
                            const estaEditando = editandoId === item.id;

                            return (
                                <div key={item.id} className={`${styles.linhaContainer} ${item.status === 'PAGO' ? styles.bordaVerde : item.status === 'PARCIAL' ? styles.bordaAmarela : styles.bordaVermelha}`}>
                                    <div className={styles.colunaId}><input className={`${styles.inputLinha} ${!estaEditando ? styles.inputLeitura : ''}`} value={estaEditando ? dadosEdicao.numero_boleto : (item.numero_boleto || item.id)} readOnly={!estaEditando} onChange={(e) => aoMudarInputEdicao('numero_boleto', e.target.value)} /></div>
                                    <div className={styles.colunaCategoria}>
                                        {estaEditando ? (
                                            <select className={styles.inputLinha} value={dadosEdicao.categoria_id} onChange={(e) => aoMudarInputEdicao('categoria_id', e.target.value)}>
                                                <option value="">Selecione</option>
                                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                            </select>
                                        ) : (
                                            <div className={`${styles.inputLinha} ${styles.inputLeitura}`}>{categorias.find(c => c.id === item.categoria_id)?.nome || 'Outros'}</div>
                                        )}
                                    </div>
                                    <div className={styles.colunaNome}><input className={`${styles.inputLinha} ${!estaEditando ? styles.inputLeitura : ''}`} value={estaEditando ? dadosEdicao.nome : item.nome} readOnly={!estaEditando} onChange={(e) => aoMudarInputEdicao('nome', e.target.value)} /></div>
                                    <div className={styles.colunaDesc}><input className={`${styles.inputLinha} ${!estaEditando ? styles.inputLeitura : ''}`} value={estaEditando ? dadosEdicao.descricao : item.descricao} readOnly={!estaEditando} onChange={(e) => aoMudarInputEdicao('descricao', e.target.value)} /></div>

                                    {/* --- COLUNA VALOR CORRIGIDA --- */}
                                    {/* --- COLUNA VALOR COM TOTAL E RESTANTE --- */}
                                    <div className={styles.colunaValor}>
                                        {estaEditando ? (
                                            <input className={styles.inputLinha} value={dadosEdicao.valor} type="number" onChange={(e) => aoMudarInputEdicao('valor', e.target.value)} />
                                        ) : abaAtiva === 'pago' ? (
                                            <input className={`${styles.inputLinha} ${styles.inputLeitura}`} value={formatarValor(item.valor_original || item.valor)} readOnly />
                                        ) : item.status === 'PARCIAL' ? (
                                            <div className={styles.containerProgresso}>
                                                {/* VALOR TOTAL ORIGINAL */}
                                                <span className={styles.valorTotalParcial}>
                                                    {formatarValor(item.valor_original)}
                                                    </span>

                                                <div className={styles.barraFundo}>
                                                    <div
                                                        className={styles.barraPreenchida}
                                                        style={{ width: `${(1 - (item.valor / item.valor_original)) * 100}%` }}
                                                    ></div>
                                                </div>

                                                {/* VALOR QUE AINDA FALTA */}
                                                <span className={styles.textoRestante}>
                                                     Falta: {formatarValor(item.valor)}
                                                </span>
                                            </div>
                                        ) : (
                                            <input className={`${styles.inputLinha} ${styles.inputLeitura}`} value={formatarValor(item.valor)} readOnly />
                                        )}
                                    </div>

                                    <div className={styles.colunaData}><input className={`${styles.inputLinha} ${!estaEditando ? styles.inputLeitura : ''}`} type="date" value={estaEditando ? dadosEdicao.emissao : item.emissao} readOnly={!estaEditando} onChange={(e) => aoMudarInputEdicao('emissao', e.target.value)} /></div>
                                    <div className={styles.colunaData}><input className={`${styles.inputLinha} ${!estaEditando ? styles.inputLeitura : ''}`} type="date" value={estaEditando ? dadosEdicao.vencimento : item.vencimento} readOnly={!estaEditando} onChange={(e) => aoMudarInputEdicao('vencimento', e.target.value)} /></div>

                                    <div className={styles.colunaAcoes}>
                                        {estaEditando ? (
                                            <>
                                                <button className={`${styles.btnIcon} ${styles.btnSalvar}`} onClick={confirmarEdicao}><i className="fa-solid fa-floppy-disk"></i></button>
                                                <button className={`${styles.btnIcon} ${styles.btnCancelar}`} onClick={cancelarEdicao}><i className="fa-solid fa-xmark"></i></button>
                                            </>
                                        ) : (
                                            <>
                                                {abaAtiva === 'a_pagar' && (
                                                    <>
                                                        <button className={`${styles.btnIcon} ${styles.btnEditar}`} onClick={() => iniciarEdicao(item)}><i className="fa-solid fa-pencil"></i></button>
                                                        <button className={`${styles.btnIcon} ${styles.btnExcluir}`} onClick={() => aoExcluirConta(item.id)}><i className="fa-solid fa-trash-can"></i></button>
                                                        <button className={`${styles.btnIcon} ${styles.btnPagar}`} onClick={() => aoClicarPagar(item)}><i className="fa-solid fa-money-bill-wave"></i></button>
                                                    </>
                                                )}
                                                {abaAtiva === 'pago' && (
                                                    <button className={`${styles.btnIcon} ${styles.btnExcluir}`} title="Desfazer" onClick={() => aoClicarEstornar(item.id)} ><i className="fa-solid fa-rotate-left"></i></button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default TabelaContas;