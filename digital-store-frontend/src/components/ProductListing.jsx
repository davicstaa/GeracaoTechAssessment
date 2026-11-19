import ProductCard from './ProductCard'
export default function ProductListing({ products = [] }) {
  if (!products.length) return <div className="empty-state">Nenhum produto encontrado. Tente alterar sua busca ou seus filtros.</div>
  return <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product}/>)}</div>
}