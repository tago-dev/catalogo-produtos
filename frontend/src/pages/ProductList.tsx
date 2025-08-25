import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Fuse from 'fuse.js';

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

        if (!search) {
            // empty search -> reload all
            fetchProducts();
            return;
        }

        try {
            const options = {
                keys: ['nome', 'descricao'],
                threshold: 0.4,
                distance: 100,
            };
            const fuse = new Fuse(products, options);
            const results: Array<{ item: Product }> = fuse.search(search) as any;
            if (results.length > 0) {
                setProducts(results.map((r) => r.item));
            } else {

                fetchProducts(search);
            }
        } catch (err) {
            console.error('Fuzzy search failed', err);
            fetchProducts(search);
        }
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
        <div className="container-wide">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="h1">Produtos</h1>
                <p className="lead">Explore nossa coleção de produtos</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex gap-3" style={{ maxWidth: 480 }}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar produtos..."
                        className="input"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 card" style={{ padding: 16, borderColor: '#fecaca', background: '#fef2f2' }}>
                    <p className="text-danger text-sm">{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && !error ? (
                <div className="flex justify-center items-center py-8">
                    <div className="spinner" />
                    <span className="ml-3 text-muted" style={{ marginLeft: 12 }}>Carregando produtos...</span>
                </div>
            ) : (
                /* Products Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-gap-6">
                    {products.length > 0 ? (
                        products.map((p) => (
                            <article key={p.id} className="card hover:shadow-lg transition">
                                {/* Product Image */}
                                <div style={{ background: '#e5e7eb' }}>
                                    <img
                                        src={p.url_imagem}
                                        alt={p.nome}
                                        className="w-full aspect-4-3 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem';
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-5">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold mb-2">
                                            {p.nome}
                                        </h3>
                                        <p className="text-sm text-muted">
                                            {p.descricao}
                                        </p>
                                    </div>

                                    {/* Price and Stock */}
                                    <div className="mb-4">
                                        <div className="text-2xl font-bold text-primary mb-1">
                                            R$ {formatPrice(p.preco)}
                                        </div>
                                        <div className="text-sm text-muted">
                                            {p.quantidade_em_stock > 0 ? (
                                                <span className="text-success">Em estoque ({p.quantidade_em_stock})</span>
                                            ) : (
                                                <span className="text-danger">Fora de estoque</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/products/${p.id}`}
                                            className="btn btn-blue-outline"
                                        >
                                            Ver Detalhes
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="btn btn-red-outline"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="text-center" style={{ gridColumn: '1/-1', padding: '48px 0' }}>
                            <div className="mb-4" style={{ color: '#9ca3af' }}>
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0v-3a2 2 0 012-2h8a2 2 0 012 2v3" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
                            <p className="text-muted">Tente ajustar sua busca ou adicionar novos produtos.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
