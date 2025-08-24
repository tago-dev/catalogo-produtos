import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

interface Product {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    url_imagem: string;
    quantidade_em_stock: number;
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = (term?: string) => {
        setLoading(true);
        setError(null);
        api
            .get("/products", { params: term ? { search: term } : {} })
            .then((res) => setProducts(res.data))
            .catch((err) => {
                console.error(err);
                setError("Erro ao carregar produtos. Verifique a API.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(search);
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Deseja realmente excluir este produto?')) return;
        setLoading(true);
        api
            .delete(`/products/${id}`)
            .then(() => {
                // refresh
                fetchProducts(search || undefined);
            })
            .catch((err) => {
                console.error(err);
                setError('Falha ao excluir o produto.');
            })
            .finally(() => setLoading(false));
    };

    const formatPrice = (val: number | string | null | undefined) => {
        if (typeof val === 'number') return val.toFixed(2);
        const parsed = parseFloat(String(val ?? '').replace(',', '.'));
        if (Number.isNaN(parsed)) return '0.00';
        return parsed.toFixed(2);
    };

    return (
        <div className="page">
            <div className="container">
                {/* Barra de busca */}
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar produto..."
                        className="search-input"
                    />
                    <button type="submit" className="btn-primary">Buscar</button>
                </form>

                {/* Lista de produtos */}
                {error && <p className="error-msg">{error}</p>}
                {loading ? (
                    <p className="muted">Carregando...</p>
                ) : (
                    <div className="product-grid">
                        {products.length > 0 ? (
                            products.map((p) => (
                                <article key={p.id} className="product-card">
                                    <img src={p.url_imagem} alt={p.nome} />
                                    <div className="product-card-body">
                                        <div>
                                            <h2>{p.nome}</h2>
                                            <p className="muted">{p.descricao}</p>
                                        </div>
                                        <div className="product-actions">
                                            <strong>R$ {formatPrice(p.preco)}</strong>
                                            <div>
                                                <Link to={`/products/${p.id}`} className="nav-link">Ver</Link>
                                                <button onClick={() => handleDelete(p.id)} className="nav-link" style={{ color: 'crimson' }}>Excluir</button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <p className="muted">Nenhum produto encontrado</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
