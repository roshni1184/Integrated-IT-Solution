import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import Admin from './Admin.jsx'
import ServicePage from './ServicePage.jsx'
import PublicPage from './PublicPage.jsx'
import './styles.css'

const path = window.location.pathname
const publicRoutes = ['/about', '/services', '/industries', '/contact']
const Root = path.startsWith('/admin') ? Admin : path.startsWith('/services/') ? ServicePage : publicRoutes.includes(path.replace(/\/$/, '')) ? PublicPage : App
createRoot(document.getElementById('root')).render(<React.StrictMode><MotionConfig reducedMotion="user"><Root /></MotionConfig></React.StrictMode>)
