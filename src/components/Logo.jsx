import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label="Digital Store - página inicial">
    <span className="logo-mark">D</span><span>digital<span className="logo-strong">store</span></span>
  </Link>
}