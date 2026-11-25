import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, maxlength: 100 },
  email: { type: String, trim: true, lowercase: true, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'team'], default: 'admin', required: true },
  active: { type: Boolean, default: true }, lastLoginAt: { type: Date, default: null },
}, { timestamps: true })
export default mongoose.model('User', userSchema)
