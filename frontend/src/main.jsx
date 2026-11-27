import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import Admin from './Admin.jsx'
import ServicePage from './ServicePage.jsx'
import PublicPage from './PublicPage.jsx'
import IndustryPage from './IndustryPage.jsx'
import './styles.css'

const path = window.location.pathname
const Root = path.startsWith('/admin') ? Admin : path.startsWith('/services/') ? ServicePage : path.startsWith('/industries/') ? IndustryPage : path === '/' ? App : PublicPage
createRoot(document.getElementById('root')).render(<React.StrictMode><MotionConfig reducedMotion="user"><Root /></MotionConfig></React.StrictMode>)
