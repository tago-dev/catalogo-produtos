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

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!product) return <p className="p-6">Carregando...</p>;

    const formatPrice = (val: number | string | null | undefined) => {
        if (typeof val === 'number') return val.toFixed(2);
        const parsed = parseFloat(String(val ?? '').replace(',', '.'));
        if (Number.isNaN(parsed)) return '0.00';
        return parsed.toFixed(2);
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <img src={product.url_imagem} alt={product.nome} className="w-full h-60 object-cover rounded" />
            <h1 className="text-2xl font-bold mt-4">{product.nome}</h1>
            <p className="text-gray-600 mt-2">{product.descricao}</p>
            <p className="text-blue-600 font-semibold text-lg mt-2">R$ {formatPrice(product.preco)}</p>
            <p className="text-sm text-gray-500">Estoque: {product.quantidade_em_stock}</p>

            <Link to="/" className="block mt-4 text-blue-500 hover:underline">
                Voltar para lista
            </Link>
        </div>
    );
}
