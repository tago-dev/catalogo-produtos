import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

interface Product {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    url_imagem: string;
    quantidade_em_stock: number;
}

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Produto não encontrado.');
                setLoading(false);
            });
    }, [id]);

    const formatPrice = (val: number | string | null | undefined) => {
        if (typeof val === 'number') return val.toFixed(2);
        const parsed = parseFloat(String(val ?? '').replace(',', '.'));
        if (Number.isNaN(parsed)) return '0.00';
        return parsed.toFixed(2);
    };

    if (loading) {
        return (
            <div className="container-wide">
                <div className="flex justify-center items-center py-8">
                    <div className="spinner" />
                    <span className="text-muted" style={{ marginLeft: 12 }}>Carregando produto...</span>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container-wide">
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Produto não encontrado</h3>
                    <p className="text-gray-500 mb-6">O produto que você procura não existe ou foi removido.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        ← Voltar para produtos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="mb-8">
                <Link to="/" className="text-primary" style={{ textDecoration: 'none', fontWeight: 600 }}>
                    ← Voltar para produtos
                </Link>
            </nav>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
                {/* Product Image */}
                <div className="mb-8 lg:mb-0">
                    <div className="rounded-xl overflow-hidden" style={{ background: '#e5e7eb' }}>
                        <img
                            src={product.url_imagem}
                            alt={product.nome}
                            className="w-full aspect-1 object-cover"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/500x500?text=Sem+Imagem';
                            }}
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:pt-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-4">
                            {product.nome}
                        </h1>

                        <div className="text-4xl font-bold text-primary mb-4">
                            R$ {formatPrice(product.preco)}
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {product.quantidade_em_stock > 0 ? (
                                <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full" style={{ background: '#16a34a', width: 8, height: 8, marginRight: 8 }}></div>
                                    <span className="text-success font-medium">
                                        Em estoque ({product.quantidade_em_stock} unidades)
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full" style={{ background: '#dc2626', width: 8, height: 8, marginRight: 8 }}></div>
                                    <span className="text-danger font-medium">Fora de estoque</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {product.descricao && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-3">Descrição</h2>
                            <p className="text-muted" style={{ lineHeight: 1.7 }}>
                                {product.descricao}
                            </p>
                        </div>
                    )}

                    {/* Product Details Card */}
                    <div className="card p-6" style={{ background: '#f9fafb' }}>
                        <h3 className="text-lg font-semibold mb-4">Detalhes do Produto</h3>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-sm font-medium text-muted">ID do Produto</dt>
                                <dd className="text-sm font-mono">{product.id}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm font-medium text-muted">Preço</dt>
                                <dd className="text-sm font-semibold">R$ {formatPrice(product.preco)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm font-medium text-muted">Estoque</dt>
                                <dd className="text-sm">{product.quantidade_em_stock} unidades</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
