import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { env } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ message: 'Authentication is required.' })
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { issuer: 'integrated-it-solution' })
    const user = await User.findById(payload.sub).select('name email role active')
    if (!user?.active) return res.status(401).json({ message: 'Your session is no longer active.' })
    req.user = user
    next()
  } catch { return res.status(401).json({ message: 'Your session is invalid or has expired.' }) }
})

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'You do not have access to this resource.' })
    next()
  }
}
