import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [urlImagem, setUrlImagem] = useState('');
    const [quantidade, setQuantidade] = useState('0');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!nome || preco === '' || quantidade === '') {
            setMessage('Nome, preço e quantidade são obrigatórios.');
            setMessageType('error');
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
                setMessage('Produto criado com sucesso!');
                setMessageType('success');
                // reset form
                setNome('');
                setDescricao('');
                setPreco('');
                setUrlImagem('');
                setQuantidade('0');
            })
            .catch((err) => {
                console.error(err);
                setMessage('Falha ao criar produto. Verifique se todos os campos estão corretos.');
                setMessageType('error');
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="container" style={{ maxWidth: 960 }}>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted mt-2">Adicione novos produtos ao catálogo</p>
                    </div>
                    <Link
                        to="/"
                        className="btn btn-outline"
                    >
                        ← Ver Produtos
                    </Link>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="mb-6 card" style={{ padding: 16, background: messageType === 'success' ? '#ecfdf5' : '#fef2f2', borderColor: messageType === 'success' ? '#a7f3d0' : '#fecaca' }}>
                    <p className="text-sm" style={{ color: messageType === 'success' ? '#065f46' : '#991b1b' }}>{message}</p>
                </div>
            )}

            {/* Form Card */}
            <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">Novo Produto</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 grid-gap-6">
                        {/* Nome */}
                        <div className="sm:col-span-2">
                            <label htmlFor="nome" className="label">
                                Nome do Produto *
                            </label>
                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="input"
                                placeholder="Digite o nome do produto"
                                required
                            />
                        </div>

                        {/* Preço */}
                        <div>
                            <label htmlFor="preco" className="label">
                                Preço *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div className="input-prefix">
                                    <span>R$</span>
                                </div>
                                <input
                                    id="preco"
                                    type="text"
                                    value={preco}
                                    onChange={(e) => setPreco(e.target.value)}
                                    className="input input-with-prefix"
                                    placeholder="0,00"
                                    required
                                />
                            </div>
                        </div>

                        {/* Quantidade */}
                        <div>
                            <label htmlFor="quantidade" className="label">
                                Quantidade em Estoque *
                            </label>
                            <input
                                id="quantidade"
                                type="number"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                className="input"
                                min="0"
                                required
                            />
                        </div>

                        {/* URL da Imagem */}
                        <div className="sm:col-span-2">
                            <label htmlFor="urlImagem" className="label">
                                URL da Imagem
                            </label>
                            <input
                                id="urlImagem"
                                type="url"
                                value={urlImagem}
                                onChange={(e) => setUrlImagem(e.target.value)}
                                className="input"
                                placeholder="https://exemplo.com/imagem.jpg"
                            />
                            {urlImagem && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                                    <img
                                        src={urlImagem}
                                        alt="Preview"
                                        className="h-24 w-24 object-cover rounded-lg border"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Descrição */}
                        <div className="sm:col-span-2">
                            <label htmlFor="descricao" className="label">
                                Descrição
                            </label>
                            <textarea
                                id="descricao"
                                rows={4}
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="textarea"
                                placeholder="Descreva o produto..."
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? (
                                <>
                                    <svg className="-ml-1 mr-3" style={{ width: 20, height: 20 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Criando...
                                </>
                            ) : (
                                'Criar Produto'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
