import { useState } from 'react'
import { Star, Truck } from 'lucide-react'
import ProductOptions from './ProductOptions'
export default function BuyBox({ product, onBuy }) {
  const [size, setSize] = useState(product.sizes?.[0] || '')
  const [color, setColor] = useState(product.colors?.[0] || '')
  const price = product.priceDiscount ?? product.price
  return <div className="buy-box">
    <span className="reference">REF: DS-{String(product.id).padStart(5, '0')}</span>
    <h1>{product.name}</h1>
    <div className="rating-line"><span className="rating-pill">{product.rating} <Star size={13} fill="currentColor"/></span><span className="rating-copy">({Math.round(product.rating * 23)} avaliações)</span></div>
    <div className="detail-price">{product.priceDiscount && <del>{product.price.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</del>}<strong>{price.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></div>
    <p className="installments">ou 10x de {(price / 10).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} sem juros</p>
    <p className="detail-description">{product.description}</p>
    {product.colors?.length > 0 && <div className="option-block"><h3>Cor</h3><ProductOptions options={product.colors} shape="circle" type="color" value={color} onChange={setColor}/></div>}
    {product.sizes?.length > 0 && <div className="option-block"><h3>Tamanho</h3><ProductOptions options={product.sizes} value={size} onChange={setSize}/></div>}
    <div className="shipping-note"><Truck size={18}/> Entrega para todo o Brasil. Consulte o prazo no carrinho.</div>
    <button className="buy-button" onClick={() => onBuy({...product, selectedSize: size, selectedColor: color})}>COMPRAR</button>
  </div>
}