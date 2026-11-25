import { Router } from 'express'
import { currentUser, login } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { loginSchema } from '../validation/schemas.js'
export const authRouter = Router()
authRouter.post('/login', validate(loginSchema), login)
authRouter.get('/me', requireAuth, currentUser)
