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
        <div className="p-6">
            {/* Barra de busca */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar produto..."
                    className="border rounded px-3 py-2 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Buscar
                </button>
            </form>

            {/* Lista de produtos */}
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {loading ? (
                <p className="text-gray-600">Carregando...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.length > 0 ? (
                        products.map((p) => (
                            <div key={p.id} className="border rounded-lg p-4 shadow-md flex flex-col">
                                <img src={p.url_imagem} alt={p.nome} className="w-full h-40 object-cover rounded" />
                                <div className="mt-2 flex-1">
                                    <h2 className="text-lg font-bold">{p.nome}</h2>
                                    <p className="text-gray-600 text-sm mt-1">{p.descricao}</p>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-blue-600 font-semibold">R$ {formatPrice(p.preco)}</p>
                                    <div className="flex gap-2">
                                        <Link to={`/products/${p.id}`} className="text-sm text-blue-500 hover:underline">
                                            Ver
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-sm text-red-500 hover:underline"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-3">Nenhum produto encontrado</p>
                    )}
                </div>
            )}
        </div>
    );
}
