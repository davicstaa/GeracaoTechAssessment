import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function Gallery({ images = [], showThumbs = false, className = '', height = 470, radius = '8px' }) {
  const [active, setActive] = useState(0)
  const list = images.length ? images : []
  if (!list.length) return <div className="gallery-placeholder">Imagem indisponível</div>
  const move = (step) => setActive(current => Math.max(0, Math.min(list.length - 1, current + step)))
  return <div className={`gallery ${className}`}>
    <div className="gallery-main" style={{height, borderRadius: radius}}>
      <img src={list[active].src} alt={`Imagem ${active + 1} do produto`} />
      <button className="gallery-arrow left" onClick={() => move(-1)} disabled={active === 0} aria-label="Imagem anterior"><ChevronLeft/></button>
      <button className="gallery-arrow right" onClick={() => move(1)} disabled={active === list.length - 1} aria-label="Próxima imagem"><ChevronRight/></button>
      <div className="gallery-dots">{list.map((_, i) => <button key={i} onClick={() => setActive(i)} className={i === active ? 'active' : ''} aria-label={`Ir para imagem ${i + 1}`}/>)}</div>
    </div>
    {showThumbs && <div className="gallery-thumbs">{list.map((img, i) => <button key={i} className={i === active ? 'selected' : ''} onClick={() => setActive(i)}><img src={img.src} alt={`Miniatura ${i + 1}`}/></button>)}</div>}
  </div>
}