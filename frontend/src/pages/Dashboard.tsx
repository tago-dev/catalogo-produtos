import { useState } from 'react';
import api from '../api';

export default function Dashboard() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [urlImagem, setUrlImagem] = useState('');
    const [quantidade, setQuantidade] = useState('0');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!nome || preco === '' || quantidade === '') {
            setMessage('Nome, preço e quantidade são obrigatórios.');
            return;
        }
        const payload = {
            nome,
            descricao: descricao || undefined,
            preco: parseFloat(preco.replace(',', '.')) || 0,
            url_imagem: urlImagem || undefined,
            quantidade_em_stock: parseInt(quantidade, 10) || 0,
        };
        setLoading(true);
        api.post('/products', payload)
            .then(() => {
                setMessage('Produto criado com sucesso');
                // reset
                setNome(''); setDescricao(''); setPreco(''); setUrlImagem(''); setQuantidade('0');
            })
            .catch((err) => {
                console.error(err);
                setMessage('Falha ao criar produto. Verifique console.');
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="container">
            <h1>Dashboard — Criar Produto</h1>
            {message && <p className="muted">{message}</p>}
            <form onSubmit={handleSubmit} className="dashboard-form">
                <label>Nome<br />
                    <input value={nome} onChange={(e) => setNome(e.target.value)} /></label>

                <label>Descrição<br />
                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} /></label>

                <label>Preço<br />
                    <input value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="0.00" /></label>

                <label>URL Imagem<br />
                    <input value={urlImagem} onChange={(e) => setUrlImagem(e.target.value)} /></label>

                <label>Quantidade em stock<br />
                    <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} /></label>

                <div style={{ marginTop: 12 }}>
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Enviando...' : 'Criar'}</button>
                </div>
            </form>
        </div>
    );
}
