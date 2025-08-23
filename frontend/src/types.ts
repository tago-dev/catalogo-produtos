export interface Product {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  url_imagem?: string;
  quantidade_em_stock: number;
}
