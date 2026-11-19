import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import HomePage from './pages/HomePage'
import ProductListingPage from './pages/ProductListingPage'
import ProductViewPage from './pages/ProductViewPage'
import { CartPage, AccountPage } from './pages/UtilityPages'

export default function App() {
  const [cart, setCart] = useState([])
  const addToCart = product => {
    setCart(current => [...current, product])
    window.alert('Produto adicionado ao carrinho!')
  }
  return <Layout cartCount={cart.length}>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/products" element={<ProductListingPage/>}/>
      <Route path="/produtos" element={<ProductListingPage/>}/>
      <Route path="/product/:id" element={<ProductViewPage onBuy={addToCart}/>}/>
      <Route path="/produto/:id" element={<ProductViewPage onBuy={addToCart}/>}/>
      <Route path="/cart" element={<CartPage cart={cart}/>}/>
      <Route path="/login" element={<AccountPage/>}/>
      <Route path="/register" element={<AccountPage register/>}/>
      <Route path="/orders" element={<div className="container utility-page"><h1>Meus pedidos</h1><p>Faça login para acompanhar seus pedidos.</p></div>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  </Layout>
}