import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../src/models/User.js'
import { connectDatabase } from '../src/config/database.js'

const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before seeding.')
  process.exit(1)
}
if (ADMIN_PASSWORD.length < 14) {
  console.error('ADMIN_PASSWORD must contain at least 14 characters.')
  process.exit(1)
}
try {
  await connectDatabase()
  const email = ADMIN_EMAIL.trim().toLowerCase()
  const existing = await User.findOne({ email })
  if (existing) {
    console.error('An account with this email already exists; no changes were made.')
    process.exitCode = 1
  } else {
    await User.create({ name: ADMIN_NAME.trim(), email, passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'admin' })
    console.info(`Admin account created for ${email}`)
  }
} catch (error) {
  console.error('Admin seed failed:', error.message)
  process.exitCode = 1
} finally { await mongoose.disconnect() }
