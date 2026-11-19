import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
export default function ProductCard({ product }) {
  const price = product.priceDiscount ?? product.price
  return <article className="product-card">
    <Link to={`/product/${product.id}`} className="product-image-wrap">
      {product.tag && <span className="product-tag">{product.tag}</span>}
      <img src={product.image} alt={product.name} loading="lazy"/>
    </Link>
    <button className="favorite-button" aria-label="Adicionar aos favoritos"><Heart size={18}/></button>
    <div className="product-info">
      <span className="product-category">{product.category}</span>
      <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
      <div className="product-prices">
        {product.priceDiscount && <del>{product.price.toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}</del>}
        <strong>{price.toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}</strong>
      </div>
    </div>
  </article>
}