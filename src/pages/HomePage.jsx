import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Section from '../components/Section'
import ProductListing from '../components/ProductListing'
import { products, heroSlides } from '../data/products'

const collections = [
  {title:'Tênis', image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85', text:'Encontre seu ritmo'},
  {title:'Acessórios', image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85', text:'Detalhes que fazem a diferença'},
  {title:'Camisetas', image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85', text:'Vista sua personalidade'}
]
export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const current = heroSlides[slide]
  return <div className="home-page">
    <section className="hero" style={{backgroundImage:`linear-gradient(90deg, rgba(18,18,24,.83), rgba(18,18,24,.12)), url(${current.image})`}}>
      <div className="container hero-content"><span className="eyebrow">{current.eyebrow}</span><h1>{current.title}</h1><p>{current.text}</p><Link to="/products" className="primary-button">{current.button} <ArrowRight size={18}/></Link>
        <div className="hero-dots">{heroSlides.map((_, i)=><button key={i} onClick={()=>setSlide(i)} className={i===slide?'active':''} aria-label={`Slide ${i+1}`}/>)}</div>
      </div>
      <button className="hero-arrow prev" onClick={()=>setSlide((slide+heroSlides.length-1)%heroSlides.length)} aria-label="Banner anterior"><ChevronLeft/></button>
      <button className="hero-arrow next" onClick={()=>setSlide((slide+1)%heroSlides.length)} aria-label="Próximo banner"><ChevronRight/></button>
    </section>
    <div className="container home-content">
      <Section title="Coleções em destaque" titleAlign="center" className="collections-section">
        <div className="collections-grid">{collections.map(item=><Link to={`/products?filter=${item.title}`} className="collection-card" key={item.title}><img src={item.image} alt={item.title}/><div><span>{item.text}</span><h3>{item.title}</h3><b>Explorar coleção <ArrowRight size={15}/></b></div></Link>)}</div>
      </Section>
      <Section title="Produtos em alta" link={{text:'Ver todos',href:'/products'}}><ProductListing products={products.slice(0,8)}/></Section>
      <div className="promo-strip"><div><span>SEU ESTILO, SUA ESCOLHA</span><h2>Peças que acompanham sua jornada.</h2><p>Descubra novidades e encontre seus próximos favoritos.</p></div><Link to="/products" className="primary-button">Comprar agora <ArrowRight size={18}/></Link></div>
    </div>
  </div>
}