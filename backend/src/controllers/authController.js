import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { env } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase(), active: true }).select('+passwordHash')
  const valid = user && await bcrypt.compare(req.body.password, user.passwordHash)
  if (!valid) return res.status(401).json({ message: 'Email or password is incorrect.' })
  user.lastLoginAt = new Date()
  await user.save()
  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN, issuer: 'integrated-it-solution' })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

export const currentUser = asyncHandler(async (req, res) => res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } }))
