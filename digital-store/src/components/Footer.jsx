import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react'
import Logo from './Logo'

const groups = [
  { title: 'Institucional', links: ['Sobre a Digital Store', 'Nossas lojas', 'Trabalhe conosco', 'Privacidade'] },
  { title: 'Ajuda', links: ['Central de atendimento', 'Dúvidas frequentes', 'Trocas e devoluções', 'Como comprar'] },
  { title: 'Atendimento', links: ['(11) 4002-8922', 'atendimento@digitalstore.com.br', 'Segunda a sexta, 8h às 18h'] }
]
export default function Footer() {
  return <footer className="footer">
    <div className="container footer-top">
      <div className="footer-brand"><Logo light/><p>A Digital Store acredita que estilo é a expressão de quem você é. Encontre produtos que acompanham sua personalidade.</p>
        <div className="social-links"><a href="https://instagram.com" aria-label="Instagram"><Instagram/></a><a href="https://facebook.com" aria-label="Facebook"><Facebook/></a><a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin/></a></div>
      </div>
      {groups.map(group => <div className="footer-group" key={group.title}><h3>{group.title}</h3>{group.links.map(link => <a href="#top" key={link}>{link}</a>)}</div>)}
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Digital Store. Todos os direitos reservados.</span><span>Feito para quem tem estilo.</span></div>
  </footer>
}