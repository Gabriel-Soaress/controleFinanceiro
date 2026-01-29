import styles from '../modules/MostrarBalancoAtual.module.css';

function MostrarBalancoAtual({ despesas, caixa, aoClicarAdicionar, aoClicarCarteiras }) {

    // FUNÇÃO DE FORMATAÇÃO: Transforma 1500.5 em "1.500,50"
    const formatarMoeda = (valor) => {
        // Se o valor não existir ou não for um número, retorna o padrão 0,00
        if (!valor || isNaN(valor)) return "0,00";

        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(valor);
    };

    return (
        <div className={styles.cardContainer}>

            {/* LADO ESQUERDO: DESPESAS */}
            <div className={styles.section}>
                <span className={styles.label}>DESPESAS:</span>
                <div className={styles.valorDespesa}>
                    {/* Agora usamos a função aqui */}
                    R$: {formatarMoeda(despesas)}
                </div>
            </div>

            <div className={styles.divisor}></div>

            {/* LADO DIREITO: CAIXA */}
            <div className={styles.section}>
                <span className={styles.label}>CAIXA:</span>

                <div className={styles.caixaRow}>
                    <div className={styles.valorCaixa}>
                        {/* E aqui também */}
                        R$: {formatarMoeda(caixa)}
                    </div>

                    <button
                        className={styles.btnAdd}
                        onClick={aoClicarAdicionar}
                        title="Adicionar saldo"
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>

                <button
                    className={styles.btnWallets}
                    onClick={aoClicarCarteiras}
                    title="Ver detalhes das carteiras"
                >
                    <i className="fa-solid fa-wallet"></i>
                </button>
            </div>

        </div>
    );
}

export default MostrarBalancoAtual;
