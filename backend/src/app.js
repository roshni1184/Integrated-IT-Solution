import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { env } from './config/env.js'
import { authRouter } from './routes/authRoutes.js'
import { enquiryRouter } from './routes/enquiryRoutes.js'
import { serviceRouter } from './routes/serviceRoutes.js'
import { dashboardRouter } from './routes/dashboardRoutes.js'
import { notFound, errorHandler } from './middleware/errors.js'

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', env.NODE_ENV === 'production' ? 1 : false)
app.use(helmet())
app.use(cors({ origin: env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()), methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }))
app.use(express.json({ limit: '30kb' }))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }))
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many login attempts. Try again later.' } }))
app.use('/api/enquiries', rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many enquiries from this network. Please try again later.' }, skip: (req) => req.method !== 'POST' || req.path !== '/' }))

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'integrated-it-solution-api' }))
app.use('/api/auth', authRouter)
app.use('/api/enquiries', enquiryRouter)
app.use('/api/services', serviceRouter)
app.use('/api/dashboard', dashboardRouter)
app.use(notFound)
app.use(errorHandler)

export default app
