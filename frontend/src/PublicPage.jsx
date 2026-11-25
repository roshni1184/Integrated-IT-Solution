import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Search, Network, ShieldCheck, MonitorCog, Laptop, Headphones, Building2, HeartPulse, GraduationCap, Factory, Landmark, ShoppingBag, Check, Mail, Phone, MapPin, Cable, Sparkles, Workflow, Server } from 'lucide-react'
import { categories, industries, EnquiryForm } from './App.jsx'
import { Header } from './ServicePage.jsx'
import { serviceSlug } from './utils/serviceSlug.js'

const pageInfo = {
  about: { eyebrow: 'ABOUT INTEGRATED IT SOLUTION', title: <>One partner.<br/><em>Connected IT.</em></>, intro: 'We bring networking, cyber security, IT infrastructure, devices and ongoing support together for businesses.', image: '1181406', focus: 'A practical approach to business technology' },
  services: { eyebrow: 'OUR SERVICES', title: <>Technology for<br/><em>everyday work.</em></>, intro: 'Explore our complete service range, from networks and cyber security to devices, accessories and business support.', image: '546819', focus: 'All your IT needs, connected' },
  industries: { eyebrow: 'INDUSTRIES WE SERVE', title: <>Built around the<br/><em>way you work.</em></>, intro: 'Different teams have different technology needs. We work with organizations across a range of industries.', image: '3184436', focus: 'IT support for teams of every kind' },
  contact: { eyebrow: 'CONTACT US', title: <>Let’s talk<br/><em>technology.</em></>, intro: 'Tell us what your team needs and we’ll help you take the next step.', image: '4974912', focus: 'Start with a conversation' },
}

const pageCopy = {
  about: 'Integrated IT Solution supports businesses with networking, cyber security, IT infrastructure, device rental and sales, accessories, and corporate IT support. We focus on understanding each requirement and helping teams find a practical way forward.',
  services: 'Browse the services below. Select a category or search for a specific service, then open its page to explore details and request a quote.',
  industries: 'Our services can support day-to-day operations across corporate offices, education, healthcare, manufacturing, professional services, and retail environments.',
  contact: 'Share a few details about your requirements. Our team can follow up to understand your enquiry and discuss suitable next steps.',
}

function PageFooter() {
  return <footer className="site-footer"><div className="wrap"><div className="footer-main"><div className="footer-brand"><a className="brand brand-light" href="/"><span className="brand-icon"><Cable size={21}/></span><span><b>INTEGRATED</b><small>IT SOLUTION</small></span></a><p>One Company, All IT Solutions<br/>Your Technology Partner.</p></div><div className="footer-col"><small>EXPLORE</small><a href="/about">About us</a><a href="/services">Services</a><a href="/industries">Industries</a><a href="/contact">Contact</a></div><div className="footer-col"><small>OUR SERVICES</small><a href="/services">Networking & infrastructure</a><a href="/services">Cyber security & support</a><a href="/services">Laptop & desktop solutions</a><a href="/services">IT hardware & accessories</a></div><div className="footer-contact"><small>GET IN TOUCH</small><p>Have a project in mind?<br/>We’re ready to listen.</p><a className="footer-email" href="/contact">Contact our team <ArrowUpRight size={14}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Integrated IT Solution. All rights reserved.</span><span>One Company, All IT Solutions <span className="footer-blue">●</span></span><a href="#top" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}}>Back to top ↑</a></div></div></footer>
}

function PageHero({ page, info }) {
  return <section className={`public-page-hero public-hero-${page}`} style={{'--page-hero-image':`url(https://images.pexels.com/photos/${info.image}/pexels-photo-${info.image}.jpeg?auto=compress&cs=tinysrgb&w=2000)`}}><div className="public-hero-shade"/><div className="wrap public-hero-content"><div className="public-breadcrumb"><a href="/">Home</a><span>/</span><span>{page[0].toUpperCase()+page.slice(1)}</span></div><motion.div initial={{opacity:0,x:-38,y:10}} animate={{opacity:1,x:0,y:0}} transition={{duration:.65,ease:[.2,.78,.22,1]}}><span className="eyebrow eyebrow-light"><span className="pulse"/>{info.eyebrow}</span><h1>{info.title}</h1><p>{info.intro}</p><div className="public-hero-actions">{page==='contact'?<a className="button button-primary" href="#form">Send an enquiry <ArrowRight size={16}/></a>:page==='services'?<a className="button button-primary" href="#service-directory">Explore services <ArrowRight size={16}/></a>:<a className="button button-primary" href="/contact">Talk to our team <ArrowRight size={16}/></a>}<a className="public-hero-link" href={page==='services'?'/contact':'/services'}>{page==='services'?'Request a quote':'Explore services'} <ArrowUpRight size={15}/></a></div><div className="public-hero-note"><Check size={14}/>{info.focus}</div></motion.div></div></section>
}

function ServiceDirectory() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All services')
  const [catalog, setCatalog] = useState(categories)
  useEffect(()=>{
    const api=import.meta.env.VITE_API_URL
    if(!api)return
    fetch(`${api}/services`).then(res=>res.ok?res.json():null).then(data=>{
      if(!data?.items?.length)return
      const grouped=new Map()
      for(const item of data.items)grouped.set(item.category,[...(grouped.get(item.category)||[]),item.name])
      const updated=categories.map(item=>({...item,services:grouped.get(item.title)||[]})).filter(item=>item.services.length)
      setCatalog(updated)
    }).catch(()=>{})
  },[])
  const filtered=useMemo(()=>catalog.map(category=>({...category,services:category.services.filter(name=>name.toLowerCase().includes(search.trim().toLowerCase()))})).filter(category=>category.services.length&&(activeCategory==='All services'||category.title===activeCategory)),[catalog,search,activeCategory])
  return <section className="public-content public-service-directory" id="service-directory"><div className="wrap"><div className="public-content-heading"><span className="eyebrow">FIND THE RIGHT SERVICE</span><h2>Everything IT,<br/><em>all in one place.</em></h2><p>{pageCopy.services}</p></div><div className="service-explorer"><label className="service-search"><Search size={17}/><input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search all services…" aria-label="Search all services"/>{search&&<button onClick={()=>setSearch('')} aria-label="Clear search">×</button>}</label><div className="service-filter-tabs"><button className={activeCategory==='All services'?'selected':''} onClick={()=>setActiveCategory('All services')}>All services <span>{catalog.reduce((total,item)=>total+item.services.length,0)}</span></button>{catalog.map(item=><button key={item.title} className={activeCategory===item.title?'selected':''} onClick={()=>setActiveCategory(item.title)}>{item.title}<span>{item.services.length}</span></button>)}</div></div><div className="public-service-grid">{filtered.flatMap(category=>category.services.map((service,index)=><motion.a className="public-service-card" href={`/services/${serviceSlug(service)}`} key={service} initial={{opacity:0,x:index%2===0?-18:18,y:8}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.4,ease:[.2,.78,.22,1]}} whileHover={{y:-3}}><span className="public-service-icon"><category.icon size={18}/></span><span><small>{category.title}</small><b>{service}</b></span><ArrowUpRight size={17}/></motion.a>))}</div>{!filtered.length&&<div className="service-empty">No services match “{search}”.</div>}</div></section>
}

function AboutContent() {
  const items=[['Connected expertise','Networking, cyber security, infrastructure and devices considered together.'],['Solutions that fit','Recommendations shaped around your work environment and requirements.'],['Support that continues','Practical help for setup, maintenance and ongoing IT needs.']]
  return <><section className="public-content"><div className="wrap public-two-column"><div><span className="eyebrow">WHO WE ARE</span><h2>IT that works<br/><em>together.</em></h2></div><div><p className="public-lead">{pageCopy.about}</p><p>We help organizations make sense of their IT needs with practical support, clear communication and services that work together.</p><a className="text-link" href="/contact">Discuss your requirements <ArrowRight size={15}/></a></div></div></section><section className="public-content public-values"><div className="wrap"><div className="public-content-heading"><span className="eyebrow">WHY INTEGRATED IT SOLUTION</span><h2>A thoughtful way<br/><em>to move forward.</em></h2></div><div className="public-value-grid">{items.map(([title,text],index)=><motion.article key={title} initial={{opacity:0,x:index%2?-20:20,y:8}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true}} transition={{duration:.45,delay:index*.08}}><span>0{index+1}</span><h3>{title}</h3><p>{text}</p></motion.article>)}</div></div></section></>
}

function IndustriesContent() {
  return <section className="public-content"><div className="wrap"><div className="public-content-heading"><span className="eyebrow">WHO WE SUPPORT</span><h2>Technology for<br/><em>the way you work.</em></h2><p>{pageCopy.industries}</p></div><div className="public-industry-grid">{industries.map((item,index)=>{const Icon=item.icon;return <motion.article key={item.title} initial={{opacity:0,x:index%2?-20:20,y:8}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true}} transition={{duration:.42,delay:index*.06}} whileHover={{y:-4}}><div><Icon size={22}/><span>0{index+1}</span></div><h3>{item.title}</h3><p>{item.text}</p></motion.article>})}</div><div className="public-inline-cta"><div><span className="eyebrow">NEED IT SUPPORT FOR YOUR TEAM?</span><h3>Let’s talk about your environment.</h3></div><a className="button button-primary" href="/contact">Contact us <ArrowRight size={16}/></a></div></div></section>
}

function ContactContent() {
  const services=categories.flatMap(category=>category.services)
  return <section className="public-content public-contact-content" id="form"><div className="wrap public-contact-grid"><div><span className="eyebrow">TELL US WHAT YOU NEED</span><h2>Start with<br/><em>a conversation.</em></h2><p>{pageCopy.contact}</p><div className="public-contact-promise"><span><ShieldCheck size={17}/></span><p>We’ll only use your details to respond to your enquiry.</p></div><div className="public-contact-detail"><Mail size={17}/><span>Company email details coming soon</span></div><div className="public-contact-detail"><Phone size={17}/><span>Phone details coming soon</span></div><div className="public-contact-detail"><MapPin size={17}/><span>Ask us about service availability in your area</span></div></div><motion.div className="public-contact-form" initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.5}}><div><span className="eyebrow">CONTACT OUR TEAM</span><h3>Send an enquiry</h3></div><EnquiryForm compact serviceOptions={services}/></motion.div></div></section>
}

export default function PublicPage() {
  const page=window.location.pathname.split('/').filter(Boolean)[0]||''
  const info=pageInfo[page]
  useEffect(()=>{
    if(!info)return
    const previous=document.title
    const tag=document.querySelector('meta[name="description"]')
    const oldDescription=tag?.content
    document.title=`${page[0].toUpperCase()+page.slice(1)} | Integrated IT Solution`
    tag?.setAttribute('content',info.intro)
    return()=>{document.title=previous;if(tag&&oldDescription)tag.setAttribute('content',oldDescription)}
  },[page,info])
  if(!info)return <><Header/><main className="public-not-found wrap"><span className="eyebrow">PAGE NOT FOUND</span><h1>We couldn’t find that page.</h1><a href="/" className="button button-primary">Back to home <ArrowRight size={16}/></a></main><PageFooter/></>
  return <><Header/><main className="public-page"><PageHero page={page} info={info}/>{page==='about'?<AboutContent/>:page==='services'?<ServiceDirectory/>:page==='industries'?<IndustriesContent/>:<ContactContent/>}<section className="public-bottom-cta"><div className="wrap"><span className="eyebrow eyebrow-light">ONE COMPANY, ALL IT SOLUTIONS</span><h2>Technology that works<br/><em>better for your business.</em></h2><a href="/contact" className="button button-primary">Talk to our team <ArrowRight size={16}/></a></div></section></main><PageFooter/></>
}
