import mongoose from 'mongoose'
const serviceSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, maxlength: 120 }, slug: { type: String, trim: true, lowercase: true, required: true, unique: true },
  category: { type: String, trim: true, required: true, maxlength: 120 }, description: { type: String, trim: true, maxlength: 2000, default: '' },
  active: { type: Boolean, default: true, index: true }, sortOrder: { type: Number, default: 0 },
}, { timestamps: true })
export default mongoose.model('Service', serviceSchema)
