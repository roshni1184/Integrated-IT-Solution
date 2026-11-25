import mongoose from 'mongoose'
const customerSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, maxlength: 120 }, email: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
  phone: { type: String, trim: true, maxlength: 40, default: '' }, company: { type: String, trim: true, maxlength: 160, default: '' },
  notes: { type: String, trim: true, maxlength: 3000, default: '' },
}, { timestamps: true })
customerSchema.index({ email: 1 }); customerSchema.index({ phone: 1 })
export default mongoose.model('Customer', customerSchema)
