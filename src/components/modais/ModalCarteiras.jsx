import styles from '../../modules/ModalCarteiras.module.css';

function ModalCarteiras({ aoFechar, carteiras = [] }) {

    // 1. Função para deixar o dinheiro bonito (R$ 0,00)
    const formatarBRL = (valor) => {
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // 2. Calcular o Total de todas as carteiras juntas
    const totalGeral = carteiras.reduce((acumulador, item) => {
        return acumulador + Number(item.saldo);
    }, 0);

    return (
        <div className={styles.overlay}>
            <div className={`${styles.modalBox} ${styles.boxPequeno}`}>
                <button className={styles.botaoFechar} onClick={aoFechar}>×</button>

                <h2 className={styles.titulo}>Minhas Carteiras</h2>

                {/* Lista de Carteiras */}
                <div className={styles.listaCarteiras}>
                    {/* Se não tiver carteira nenhuma, avisa o usuário */}
                    {carteiras.length === 0 && <p style={{textAlign:'center', padding:'20px'}}>Nenhuma carteira encontrada.</p>}

                    {carteiras.map(cart => (
                        <div key={cart.id} className={styles.itemCarteira}>
                            <span className={styles.nomeCarteira}>
                                {/* Dica: usei o style color pra pegar a cor que veio do banco! */}
                                <i
                                    className={`fa-solid fa-wallet ${styles.iconeCarteira}`}
                                    style={{ color: cart.cor || '#888' }}
                                ></i>
                                {cart.nome}
                            </span>

                            <span className={styles.valorCarteira}>
                                {/* VALOR REAL AQUI */}
                                {formatarBRL(cart.saldo)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Rodapé do Total SOMADO */}
                <div className={styles.totalCarteiras}>
                    Total em contas: <b>{formatarBRL(totalGeral)}</b>
                </div>
            </div>
        </div>
    );
}

export default ModalCarteiras;