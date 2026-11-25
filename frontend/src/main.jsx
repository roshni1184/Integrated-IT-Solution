import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Admin from './Admin.jsx'
import ServicePage from './ServicePage.jsx'
import './styles.css'

const path = window.location.pathname
const Root = path.startsWith('/admin') ? Admin : path.startsWith('/services/') ? ServicePage : App
createRoot(document.getElementById('root')).render(<React.StrictMode><Root /></React.StrictMode>)
