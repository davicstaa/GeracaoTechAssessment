import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import Section from '../components/Section'
import ProductListing from '../components/ProductListing'
import FilterGroup from '../components/FilterGroup'
import { products } from '../data/products'

export default function ProductListingPage() {
  const [params] = useSearchParams()
  const [sort, setSort] = useState('relevance')
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [genders, setGenders] = useState([])
  const query = (params.get('filter') || '').toLowerCase()
  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const matchesQuery = !query || `${p.name} ${p.brand} ${p.category} ${p.gender}`.toLowerCase().includes(query)
      return matchesQuery && (!brands.length || brands.includes(p.brand)) && (!categories.length || categories.includes(p.category)) && (!genders.length || genders.includes(p.gender))
    })
    if (sort === 'low') result = [...result].sort((a,b)=>(a.priceDiscount||a.price)-(b.priceDiscount||b.price))
    if (sort === 'high') result = [...result].sort((a,b)=>(b.priceDiscount||b.price)-(a.priceDiscount||a.price))
    return result
  }, [query, brands, categories, genders, sort])
  return <div className="container listing-page">
    <div className="breadcrumbs">Home <span>/</span> Produtos {query && <><span>/</span> Busca: “{params.get('filter')}”</>}</div>
    <div className="listing-layout">
      <aside className="filters">
        <div className="filters-title"><SlidersHorizontal size={18}/> <h2>Filtrar por</h2></div>
        <FilterGroup title="Marca" options={['Nike','Adidas','Puma','Digital','Street','Urban'].map(x=>({text:x,value:x}))} value={brands} onChange={setBrands}/>
        <FilterGroup title="Categoria" options={['Tênis','Acessórios','Camisetas'].map(x=>({text:x,value:x}))} value={categories} onChange={setCategories}/>
        <FilterGroup title="Gênero" options={['Masculino','Feminino','Unissex'].map(x=>({text:x,value:x}))} value={genders} onChange={setGenders}/>
        <button className="clear-filters" onClick={()=>{setBrands([]);setCategories([]);setGenders([])}}>Limpar filtros</button>
      </aside>
      <section className="listing-results">
        <div className="listing-toolbar"><Section title={`${filtered.length} produtos encontrados`}/><label className="sort-control">Ordenar por <select value={sort} onChange={e=>setSort(e.target.value)}><option value="relevance">Mais relevantes</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select></label></div>
        <ProductListing products={filtered}/>
      </section>
    </div>
  </div>
}