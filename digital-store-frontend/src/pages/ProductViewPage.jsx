import { Link, useParams } from 'react-router-dom'
import Gallery from '../components/Gallery'
import BuyBox from '../components/BuyBox'
import Section from '../components/Section'
import ProductListing from '../components/ProductListing'
import { products } from '../data/products'

export default function ProductViewPage({ onBuy }) {
  const { id } = useParams()
  const product = products.find(p=>p.id===Number(id)) || products[0]
  const related = products.filter(p=>p.id!==product.id).slice(0,4)
  const images = (product.images || [product.image]).map(src=>({src}))
  return <div className="container product-view">
    <div className="breadcrumbs"><Link to="/">Home</Link> <span>/</span> Produtos <span>/</span> {product.name}</div>
    <div className="product-detail-layout"><Gallery images={images} showThumbs height={510} radius="8px"/><BuyBox product={product} onBuy={onBuy}/></div>
    <Section title="Descrição do produto"><p className="long-description">{product.description} Desenvolvido para oferecer uma experiência agradável, combinando materiais selecionados, acabamento cuidadoso e design versátil. Ideal para quem busca qualidade e personalidade.</p></Section>
    <Section title="Produtos recomendados" link={{text:'Ver todos',href:'/products'}}><ProductListing products={related}/></Section>
  </div>
}