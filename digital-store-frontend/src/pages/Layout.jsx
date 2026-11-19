import Header from '../components/Header'
import Footer from '../components/Footer'
export default function Layout({ children, cartCount }) {
  return <><Header cartCount={cartCount}/><main>{children}</main><Footer/></>
}