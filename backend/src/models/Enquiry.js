import mongoose from 'mongoose'
const enquirySchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, minlength: 2, maxlength: 120 },
  email: { type: String, trim: true, lowercase: true, required: true, maxlength: 254 },
  phone: { type: String, trim: true, required: true, maxlength: 40 },
  company: { type: String, trim: true, maxlength: 160, default: '' },
  service: { type: String, trim: true, required: true, maxlength: 120 },
  enquiryType: { type: String, enum: ['contact', 'quote'], default: 'contact', required: true },
  message: { type: String, trim: true, required: true, minlength: 10, maxlength: 5000 },
  deviceType: { type: String, trim: true, maxlength: 80, default: '' },
  quantity: { type: Number, min: 1, max: 10000, default: null },
  preference: { type: String, enum: ['', 'Rental', 'Purchase', 'Sale / trade-in', 'Not applicable'], default: '' },
  status: { type: String, enum: ['new', 'contacted', 'in_progress', 'converted', 'rejected'], default: 'new', index: true },
  notes: [{ text: { type: String, trim: true, maxlength: 2000 }, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }],
  followUpAt: { type: Date, default: null }, assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true })
enquirySchema.index({ createdAt: -1 })
enquirySchema.index({ name: 'text', email: 'text', phone: 'text', service: 'text' })
export default mongoose.model('Enquiry', enquirySchema)
