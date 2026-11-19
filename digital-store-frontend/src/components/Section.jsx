export default function Section({ title, titleAlign = 'left', link, children, className = '' }) {
  return <section className={`content-section ${className}`}>
    {(title || link) && <div className={`section-heading ${titleAlign === 'center' ? 'center' : ''}`}>
      {title && <h2>{title}</h2>}
      {link && <a href={link.href}>{link.text} <span>→</span></a>}
    </div>}
    {children}
  </section>
}