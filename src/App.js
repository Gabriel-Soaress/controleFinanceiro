import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard'; // Seu Dashboard
import CardLogin from './components/CardLogin';
import Header from './components/Header'; // <--- IMPORTANTE: Importe o Header

function App() {
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
        const usuarioSalvo = localStorage.getItem('usuario_sofit');
        if (usuarioSalvo) {
            setUsuarioLogado(JSON.parse(usuarioSalvo));
        }
    }, []);

    const salvarLogin = (dadosUsuario) => {
        localStorage.setItem('usuario_sofit', JSON.stringify(dadosUsuario));
        setUsuarioLogado(dadosUsuario);
    };

    // ESSA É A FUNÇÃO QUE O HEADER VAI USAR
    const sair = () => {
        localStorage.removeItem('usuario_sofit');
        setUsuarioLogado(null);
    };

    // --- RENDERIZAÇÃO ---

    // 1. TELA DE LOGIN (Sem Header)
    if (!usuarioLogado) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e1e1e'}}>
                <CardLogin aoFazerLogin={salvarLogin} />
            </div>
        );
    }

    // 2. TELA DO SISTEMA (Com Header e Dashboard)
    return (
        <div>
            {/* AQUI ESTÁ A MÁGICA: Passamos a função 'sair' para o Header */}
            <Header aoSair={sair} />

            {/* O Dashboard carrega logo abaixo */}
            <Dashboard usuarioId={usuarioLogado.id} />
        </div>
    );
}

export default App;