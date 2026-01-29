import styles from "../modules/Header.module.css"
import logo from "../assets/images/logo.png"

// 1. Recebemos a prop 'aoSair' aqui nos argumentos
function Header({ aoSair }) {
    return (
        <div className={styles.Header}>

            <img src={logo} alt="Logo Sofit" />

            {/* 2. No clique, chamamos a função que veio do pai */}
            <button className={styles.botaoSair} onClick={aoSair}>
                Sair
            </button>
        </div>
    )
}

export default Header;