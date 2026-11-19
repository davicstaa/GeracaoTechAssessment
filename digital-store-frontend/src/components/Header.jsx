import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X, UserRound } from 'lucide-react'
import Logo from './Logo'

export default function Header({ cartCount = 0 }) {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const search = (e) => {
    e?.preventDefault()
    navigate(`/products?filter=${encodeURIComponent(query.trim())}`)
    setMenuOpen(false)
  }
  const navItems = [['Home', '/'], ['Produtos', '/products'], ['Categorias', '/products'], ['Meus Pedidos', '/orders']]
  return <header className="site-header">
    <div className="header-main container">
      <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X/> : <Menu/>}</button>
      <Logo />
      <form className="search-box" onSubmit={search}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar produto..." aria-label="Pesquisar produto" />
        <button aria-label="Buscar"><Search size={20}/></button>
      </form>
      <div className="header-actions">
        <Link className="signup-link" to="/register">Cadastre-se</Link>
        <Link className="login-button" to="/login">Entrar</Link>
        <Link className="cart-button" to="/cart" aria-label="Carrinho"><ShoppingCart size={23}/>{cartCount > 0 && <span>{cartCount}</span>}</Link>
      </div>
    </div>
    <nav className={`main-nav container ${menuOpen ? 'nav-open' : ''}`}>
      {navItems.map(([label, to], i) => <NavLink key={label} to={to} end={i === 0} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
    </nav>
  </header>
}