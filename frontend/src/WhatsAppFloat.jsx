import { MessageCircle, Phone } from 'lucide-react'

const whatsappUrl = 'https://wa.me/919162986496?text=Hello%2C%20I%20have%20an%20IT%20enquiry.'

export default function WhatsAppFloat() {
  return <a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
    <span className="whatsapp-float-icon"><MessageCircle size={24} strokeWidth={2.4}/><Phone size={11} strokeWidth={3}/></span>
  </a>
}
