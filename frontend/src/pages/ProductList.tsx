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

    const fetchProducts = (term?: string) => {
        api.get("/products", { params: term ? { search: term } : {} })
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(search);
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
            <div className="grid grid-cols-3 gap-6">
                {products.length > 0 ? (
                    products.map(p => (
                        <div key={p.id} className="border rounded-lg p-4 shadow-md">
                            <img src={p.url_imagem} alt={p.nome} className="w-full h-40 object-cover rounded" />
                            <h2 className="text-lg font-bold mt-2">{p.nome}</h2>
                            <p className="text-gray-600">{p.descricao}</p>
                            <p className="text-blue-600 font-semibold mt-2">R$ {p.preco.toFixed(2)}</p>
                            <Link to={`/products/${p.id}`} className="text-sm text-blue-500 hover:underline">
                                Ver detalhes
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-3">Nenhum produto encontrado</p>
                )}
            </div>
        </div>
    );
}
