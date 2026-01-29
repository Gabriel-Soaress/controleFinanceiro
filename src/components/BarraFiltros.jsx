import { useState } from 'react';
import styles from '../modules/BarraFiltros.module.css';

function BarraFiltros({ aoClicarEmFiltrar, opcoesCategorias = [] }) {

    const [dataInicio, setDataInicio] = useState('2026-01-01');
    const [dataFim, setDataFim] = useState('2026-01-31');
    const [categoria, setCategoria] = useState('');
    const [busca, setBusca] = useState('');

    const lidarComCliqueFiltrar = () => {
        aoClicarEmFiltrar({
            inicio: dataInicio,
            fim: dataFim,
            categoria: categoria,
            texto: busca
        });
    };

    return (
        <div className={styles.containerBarraFiltros}>

            <div className={styles.grupoDatas}>
                <div className={styles.wrapperInputData}>
                    <input
                        type="date"
                        className={styles.campoData}
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                    />
                </div>
                <span className={styles.textoSeparador}>a</span>
                <div className={styles.wrapperInputData}>
                    <input
                        type="date"
                        className={styles.campoData}
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                    />
                </div>
            </div>

            <select
                className={styles.campoSelecao}
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
            >
                {/* Única opção fixa */}
                <option value="">CATEGORIAS</option>

                {/* Aqui vai preencher sozinho quando o banco mandar dados.
                    Por enquanto, como a lista é vazia, não desenha nada extra. */}
                {opcoesCategorias.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.nome}
                    </option>
                ))}
            </select>

            <input
                type="text"
                className={styles.campoBusca}
                placeholder="Nome ou descrição"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            <button
                className={styles.botaoFiltrar}
                onClick={lidarComCliqueFiltrar}
            >
                <i className="fa-solid fa-filter"></i>
                filtrar
            </button>

        </div>
    );
}

export default BarraFiltros;