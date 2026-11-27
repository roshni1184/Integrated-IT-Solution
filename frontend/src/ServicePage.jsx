import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Network, ShieldCheck, MonitorCog, Laptop, Headphones, Menu, X, MoveUpRight, Sparkles } from 'lucide-react'
import { Brand, categories } from './App.jsx'
import { serviceSlug } from './utils/serviceSlug.js'

const serviceHeroImages = {
  'Wi-Fi Installation': '3182812',
  'Router & Switch Configuration': '3184325',
  'Server Installation': '3184360',
  'Office Networking Solutions': '3183150',
  'Networking Solutions': '3184291',
  'Cyber Security Solutions': '3184339',
  'Antivirus & Malware Protection': '3184418',
  'Firewall Configuration': '3182781',
  'Data Backup & Recovery': '3182784',
  'Remote IT Support': '3184430',
  'Computer Troubleshooting': '3184435',
  'Cyber Security Guidance': '1181244',
  'Corporate IT Support': '1181271',
  'Annual Maintenance Contract (AMC)': '1181306',
  'IT Infrastructure Setup': '1181319',
  'Office Computer Setup': '1181345',
  'IT Support & Maintenance': '1181370',
  'Business IT Consulting': '1181396',
  'Laptop Rental': '1181423',
  'Desktop Rental': '1181467',
  'Laptop Sale & Purchase': '1181472',
  'Desktop Sale & Purchase': '1181498',
  'IT Accessories Supply': '1181500',
  'All IT Accessories': '1181548',
  'Computer Peripherals': '1181619',
  'Hardware Solutions': '3182820',
}
const categoryFallbackImages = {
  'Networking & IT Infrastructure': '3184438',
  'Cyber Security & IT Support': '3182773',
  'Complete IT Solutions & AMC': '1181639',
  'Laptop & Desktop Solutions': '3182820',
  'IT Hardware & Accessories': '3184430',
}

const copy = {
  'Wi-Fi Installation': ['Reliable Wi-Fi, thoughtfully planned.', 'Get dependable wireless access across the spaces where your team works.', ['Coverage planning', 'Access point setup', 'Connection handover']],
  'Router & Switch Configuration': ['A network configured around your needs.', 'Set up routers and switches to support the way your devices and teams connect.', ['Network requirements', 'Configuration planning', 'Setup and review']],
  'Server Installation': ['A considered foundation for your systems.', 'Plan and install server infrastructure aligned with your organization’s requirements.', ['Environment review', 'Installation planning', 'Setup and handover']],
  'Office Networking Solutions': ['Connect your workplace with confidence.', 'Bring office devices and work areas together with practical networking support.', ['Workspace assessment', 'Network design', 'Implementation planning']],
  'Networking Solutions': ['Networking support that fits your business.', 'Discuss your connectivity requirements and explore an approach suited to your environment.', ['Understand your needs', 'Shape a solution', 'Plan next steps']],
  'Cyber Security Solutions': ['A more considered approach to security.', 'Review your security needs and explore practical ways to protect business technology.', ['Understand your environment', 'Review priorities', 'Plan protective measures']],
  'Antivirus & Malware Protection': ['Help protect the devices your team relies on.', 'Discuss antivirus and malware protection suited to the devices and working practices in your business.', ['Device requirements', 'Protection options', 'Setup guidance']],
  'Firewall Configuration': ['Manage network access with care.', 'Configure firewall rules around your organization’s connectivity and security requirements.', ['Review network needs', 'Plan access rules', 'Configuration review']],
  'Data Backup & Recovery': ['Plan for data continuity.', 'Discuss backup and recovery needs so your team can make informed decisions about protecting business data.', ['Identify important data', 'Review backup needs', 'Discuss recovery planning']],
  'Remote IT Support': ['Practical IT help, wherever work happens.', 'Get support for day-to-day technology issues without needing an on-site visit for every request.', ['Describe the issue', 'Remote assessment', 'Guided resolution']],
  'Computer Troubleshooting': ['Get to the cause of computer issues.', 'Work through computer problems with practical troubleshooting and clear next steps.', ['Understand symptoms', 'Investigate the issue', 'Recommend next steps']],
  'Cyber Security Guidance': ['Make informed security decisions.', 'Talk through cyber security questions and priorities for your organization.', ['Discuss concerns', 'Review current practices', 'Identify next steps']],
  'Corporate IT Support': ['Technology support for your team.', 'Discuss ongoing IT support for the systems and devices your organization depends on.', ['Understand your setup', 'Agree support needs', 'Plan ongoing assistance']],
  'Annual Maintenance Contract (AMC)': ['Plan IT maintenance ahead of time.', 'Explore an annual maintenance arrangement shaped around your equipment and support requirements.', ['Review your environment', 'Set maintenance priorities', 'Discuss an agreement']],
  'IT Infrastructure Setup': ['Build an IT foundation for your workplace.', 'Plan the technology infrastructure your people need to work effectively.', ['Review requirements', 'Plan infrastructure', 'Coordinate setup']],
  'Office Computer Setup': ['Get workplace computers ready for your team.', 'Discuss the computers and setup needs for a new office or growing team.', ['Confirm devices', 'Plan the setup', 'Prepare for handover']],
  'IT Support & Maintenance': ['Keep everyday technology on track.', 'Get help maintaining business devices and resolving common IT needs.', ['Review current needs', 'Prioritize maintenance', 'Coordinate support']],
  'Business IT Consulting': ['Make your next IT decision with clarity.', 'Talk through your business goals and technology questions with a practical IT perspective.', ['Understand your goals', 'Explore options', 'Define next steps']],
  'Laptop Rental': ['Flexible laptops for changing needs.', 'Discuss laptop rental for a project, temporary team or changing device requirements.', ['Choose device type', 'Share quantity and timing', 'Request a rental quote']],
  'Desktop Rental': ['Desktop capacity when your team needs it.', 'Explore desktop rental for temporary workspaces, projects and team requirements.', ['Describe your workspace', 'Share quantity and timing', 'Request a rental quote']],
  'Laptop Sale & Purchase': ['Buy or sell laptops with a clear plan.', 'Discuss laptop purchasing or selling requirements with your organization’s needs in mind.', ['Share specifications', 'Discuss quantities', 'Request a quote']],
  'Desktop Sale & Purchase': ['Desktop options for your workplace.', 'Discuss desktop purchase or sale requirements for your team and work environment.', ['Share specifications', 'Discuss quantities', 'Request a quote']],
  'IT Accessories Supply': ['The accessories your workplace needs.', 'Source IT accessories for your people, devices and workspaces.', ['Identify accessories', 'Confirm quantities', 'Request a supply quote']],
  'All IT Accessories': ['One place to discuss IT accessories.', 'Tell us what your team needs and we can discuss suitable accessories and peripherals.', ['Describe your setup', 'List required items', 'Request a quote']],
  'Computer Peripherals': ['Complete your computer setup.', 'Discuss keyboards, displays and other peripherals to suit your workplace setup.', ['Identify compatible devices', 'Confirm quantities', 'Plan supply']],
  'Hardware Solutions': ['Hardware support for your requirements.', 'Talk through your hardware requirements and explore options aligned with your environment.', ['Understand the use case', 'Review requirements', 'Discuss options']],
}

const faqs = [
  ['How do I get started?', 'Send an enquiry with a short description of what you need. The team can follow up to understand the details.'],
  ['Can I request a quote for my business?', 'Yes. Use the quote form and include the service, quantities, timing and other requirements that may help scope your request.'],
  ['Do you provide support after setup?', 'Support and maintenance options are available. Share your ongoing requirements when you enquire so the team can discuss them with you.'],
]

export function Header() {
  const [open, setOpen] = useState(false)
  return <><div className="topline"><div className="wrap topline-inner"><span><Sparkles size={13}/> Your technology partner</span><a href="/contact">Talk to our team <ArrowUpRight size={13}/></a></div></div><header className="site-header"><div className="wrap header-inner"><Brand/><nav className={open?'nav-open':''} aria-label="Main navigation"><a href="/">Home</a><a href="/about">About</a><a href="/services">Services</a><a href="/industries">Industries</a><a href="/contact">Contact</a><a className="mobile-quote" href="/contact#form">Get a quote <ArrowRight size={15}/></a></nav><a href="/contact#form" className="button button-dark header-cta">Get a quote <ArrowUpRight size={15}/></a><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'}>{open?<X/>:<Menu/>}</button></div></header></>
}

export default function ServicePage() {
  const slug = window.location.pathname.split('/').filter(Boolean).at(-1) || ''
  const staticService = useMemo(()=>categories.flatMap(group=>group.services.map(name=>({name,category:group.title,group}))).find(service=>serviceSlug(service.name)===slug),[slug])
  const [dynamicService,setDynamicService] = useState(null)
  const [loading,setLoading] = useState(!staticService)
  const [openFaq,setOpenFaq] = useState(0)
  const current=staticService|| (dynamicService?{...dynamicService,group:{title:dynamicService.category,icon:MonitorCog,services:[]}}:null)
  const details=current?(copy[current.name]||['Technology support shaped around your business.',`Discuss ${current.name.toLowerCase()} requirements and find a practical next step for your organization.`,['Understand your needs','Explore suitable options','Plan next steps']]):null
  useEffect(()=>{
    if(staticService){setLoading(false);return}
    const api=import.meta.env.VITE_API_URL
    if(!api){setLoading(false);return}
    fetch(`${api}/services/${encodeURIComponent(slug)}`).then(response=>response.ok?response.json():null).then(data=>setDynamicService(data?.item||null)).catch(()=>{}).finally(()=>setLoading(false))
  },[slug,staticService])
  useEffect(()=>{
    if(!current||!details)return
    const oldTitle=document.title
    const descriptionTag=document.querySelector('meta[name="description"]')
    const oldDescription=descriptionTag?.content
    document.title=`${current.name} | Integrated IT Solution`
    descriptionTag?.setAttribute('content',details[1])
    return()=>{document.title=oldTitle;if(descriptionTag&&oldDescription)descriptionTag.setAttribute('content',oldDescription)}
  },[current?.name])
  if(loading)return <div className="service-page-loading">Loading service details…</div>
  if(!current)return <><Header/><main className="service-not-found wrap"><span className="eyebrow">SERVICE NOT FOUND</span><h1>We couldn’t find that service.</h1><p>Browse the full service list and choose the support you need.</p><a href="/#services" className="button button-primary">Browse services <ArrowRight size={16}/></a></main></>
  const Icon=current.group.icon||MonitorCog
  const related=current.group.services.filter(name=>name!==current.name).slice(0,4)
  const photo=serviceHeroImages[current.name]||categoryFallbackImages[current.category||current.group.title]||categoryFallbackImages['Complete IT Solutions & AMC']
  return <><Header/><motion.main className="service-detail-page" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.35}}><section className="detail-hero"><motion.div className="detail-hero-image" initial={{scale:1.06,x:35}} animate={{scale:1,x:0}} transition={{duration:1,ease:[.2,.78,.22,1]}} style={{backgroundImage:`url(https://images.pexels.com/photos/${photo}/pexels-photo-${photo}.jpeg?auto=compress&cs=tinysrgb&w=1700)`}}/><div className="detail-hero-shade"/><motion.div className="wrap detail-hero-content" initial="hidden" animate="visible" variants={{hidden:{opacity:0,x:-28},visible:{opacity:1,x:0,transition:{duration:.55,staggerChildren:.08,ease:[.2,.78,.22,1]}}}}><div className="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><span>{current.name}</span></div><motion.div className="detail-category" variants={{hidden:{opacity:0,x:-16},visible:{opacity:1,x:0}}}><Icon size={15}/>{current.category||current.group.title}</motion.div><motion.h1 variants={{hidden:{opacity:0,x:-22},visible:{opacity:1,x:0}}}>{details[0]}</motion.h1><motion.p variants={{hidden:{opacity:0,x:-16},visible:{opacity:1,x:0}}}>{details[1]}</motion.p><motion.div className="detail-hero-actions" variants={{hidden:{opacity:0,x:-13},visible:{opacity:1,x:0}}}><a className="button button-primary" href="/contact">Request a quote <ArrowRight size={16}/></a><a className="detail-secondary-link" href="/contact">Talk to our team <ArrowUpRight size={15}/></a></motion.div><motion.div className="detail-trust" variants={{hidden:{opacity:0,x:-10},visible:{opacity:1,x:0}}}><span><Check size={14}/> Practical recommendations</span><span><Check size={14}/> Solutions for your requirements</span></motion.div></motion.div></section>
    <section className="detail-intro"><div className="wrap detail-intro-grid"><div><span className="eyebrow">{current.name.toUpperCase()}</span><h2>Technology support,<br/><em>connected to your goals.</em></h2></div><div><p>{details[1]} We start by understanding your environment and priorities, then discuss an approach that fits your team.</p><p>Every organization has different requirements. Share the context, timing and scale of your need so the next steps are useful and clear.</p><a className="text-link" href="/#quote">Tell us what you need <ArrowRight size={15}/></a></div></div></section>
    <section className="detail-process"><div className="wrap"><motion.div className="detail-section-heading" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.4}} transition={{duration:.45}}><span className="eyebrow">A CLEAR WAY FORWARD</span><h2>From first conversation<br/><em>to the next step.</em></h2><p>Start with the requirements that matter to your team.</p></motion.div><div className="detail-feature-grid">{details[2].map((item,index)=><motion.article className="detail-feature" key={item} initial={{opacity:0,x:index%2===0?-34:34,y:8}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,amount:.3}} transition={{duration:.56,delay:index*.1,ease:[.2,.78,.22,1]}} whileHover={{y:-4}}><span>0{index+1}</span><h3>{item}</h3><p>{index===0?'We learn about your environment, goals and any constraints that should guide the solution.':index===1?'We outline relevant options and clarify the scope based on the information you share.':'We agree what information or action will help move your request forward.'}</p></motion.article>)}</div></div></section>
    <section className="detail-quote-band"><div className="wrap detail-quote-inner"><div><span className="eyebrow eyebrow-light">HAVE A REQUIREMENT?</span><h2>Let’s discuss {current.name.toLowerCase()}.</h2><p>Tell us what your team needs. We’ll help you work through the next step.</p></div><a className="button button-primary" href="/#quote">Request a quote <ArrowRight size={16}/></a></div></section>
    <section className="detail-faq"><div className="wrap detail-faq-grid"><motion.div initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.4}}><span className="eyebrow">SERVICE QUESTIONS</span><h2>Before you<br/><em>get started.</em></h2><a className="text-link" href="/#contact">Ask another question <ArrowRight size={15}/></a></motion.div><div className="detail-faq-list">{faqs.map(([question,answer],index)=><motion.article initial={{opacity:0,x:index%2===0?32:-32}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.48,delay:index*.07,ease:[.2,.78,.22,1]}} className={openFaq===index?'faq-active':''} key={question}><button aria-expanded={openFaq===index} onClick={()=>setOpenFaq(openFaq===index?-1:index)}><span>{question}</span><ChevronDown size={18}/></button><AnimatePresence initial={false}>{openFaq===index&&<motion.p key="answer" initial={{height:0,opacity:0,marginTop:-4}} animate={{height:'auto',opacity:1,marginTop:0}} exit={{height:0,opacity:0,marginTop:-4}} transition={{duration:.2}}>{answer}</motion.p>}</AnimatePresence></motion.article>)}</div></div></section>
    {related.length>0&&<section className="detail-related"><div className="wrap"><div className="detail-related-heading"><div><span className="eyebrow">MORE IN {current.group.title.toUpperCase()}</span><h2>Related services</h2></div><a className="text-link" href="/#services">All services <ArrowRight size={15}/></a></div><div className="related-grid">{related.map((name,index)=><motion.a href={`/services/${serviceSlug(name)}`} className="related-card" key={name} initial={{opacity:0,x:index%2===0?-28:28}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} transition={{duration:.45,delay:index*.07,ease:[.2,.78,.22,1]}} whileHover={{y:-3}}><span className="related-icon"><Icon size={18}/></span><b>{name}</b><span className="related-arrow"><MoveUpRight size={17}/></span></motion.a>)}</div></div></section>}
    <footer className="site-footer"><div className="wrap"><div className="footer-main"><div className="footer-brand"><Brand light/><p>One Company, All IT Solutions<br/>Your Technology Partner.</p></div><div className="footer-col"><small>EXPLORE</small><a href="/#about">About us</a><a href="/#services">Services</a><a href="/#industries">Industries</a><a href="/#quote">Get a quote</a></div><div className="footer-col"><small>SERVICE</small><a href="/#services">All services</a><a href="/#contact">Contact our team</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Integrated IT Solution. All rights reserved.</span><a href="#top" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}}>Back to top ↑</a></div></div></footer>
  </motion.main></>
}
