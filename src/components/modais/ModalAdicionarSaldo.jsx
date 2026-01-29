import { useState } from 'react';
import styles from '../../modules/ModalAdicionarSaldo.module.css';

// 1. ADICIONEI 'aoSalvar' AQUI NAS PROPS
function ModalAdicionarSaldo({ aoFechar, aoSalvar, carteiras = [] }) {

    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataEntrada, setDataEntrada] = useState(new Date().toISOString().split('T')[0]);
    const [origem, setOrigem] = useState(''); // ID da carteira

    const confirmarAdicao = () => {
        // 2. MONTAGEM DO PACOTE PARA O SERVIDOR
        // Precisamos traduzir seus nomes de variáveis para o que o server.js espera
        const dadosParaEnviar = {
            valor: parseFloat(valor),    // Garante que é número
            descricao: descricao,
            carteira_id: origem,         // Traduz 'origem' -> 'carteira_id'
            data_pagamento: dataEntrada  // O server espera 'data_pagamento'
        };

        // 3. ENVIA PARA O DASHBOARD (Que envia pro Server)
        aoSalvar(dadosParaEnviar);

        // Fecha o modal
        aoFechar();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalBox}>
                <button className={styles.botaoFechar} onClick={aoFechar}>×</button>

                <h2 className={styles.titulo}>Adicionar ao Caixa</h2>

                {/* 1. Valor e Data */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div className={styles.grupoInput} style={{ flex: 1 }}>
                        <label>Valor da Entrada (R$)</label>
                        <input
                            type="number"
                            className={styles.inputModal}
                            placeholder="0,00"
                            autoFocus
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                        />
                    </div>

                    <div className={styles.grupoInput} style={{ flex: 1 }}>
                        <label>Data</label>
                        <input
                            type="date"
                            className={styles.inputModal}
                            value={dataEntrada}
                            onChange={(e) => setDataEntrada(e.target.value)}
                        />
                    </div>
                </div>

                {/* 2. Origem (Select das Carteiras) */}
                <div className={styles.grupoInput} style={{ marginBottom: '15px' }}>
                    <label>Origem (Onde o dinheiro entrou?)</label>
                    <select
                        className={styles.inputModal}
                        value={origem}
                        onChange={(e) => setOrigem(e.target.value)}
                    >
                        <option value="">Selecione a carteira...</option>
                        {/* 4. LOOP DAS OPÇÕES QUE VÊM DO BANCO */}
                        {carteiras.map(cart => (
                            <option key={cart.id} value={cart.id}>{cart.nome}</option>
                        ))}
                    </select>
                </div>

                {/* 3. Descrição */}
                <div className={styles.grupoInput}>
                    <label>Descrição</label>
                    <input
                        type="text"
                        className={styles.inputModal}
                        placeholder="Ex: Venda de balcão, Pix cliente..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                </div>

                <button
                    className={styles.botaoConfirmar}
                    style={{ marginTop: '25px' }}
                    onClick={confirmarAdicao}
                    // Só libera se tiver Valor e Carteira selecionada
                    disabled={!valor || !origem}
                >
                    REGISTRAR ENTRADA
                </button>
            </div>
        </div>
    );
}

export default ModalAdicionarSaldo;