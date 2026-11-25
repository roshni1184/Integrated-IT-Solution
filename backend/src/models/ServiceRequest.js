import mongoose from 'mongoose'
const serviceRequestSchema = new mongoose.Schema({
  enquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry', default: null }, customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
  requestType: { type: String, enum: ['rental', 'purchase', 'service'], required: true }, deviceType: { type: String, trim: true, maxlength: 80, default: '' },
  quantity: { type: Number, min: 1, max: 10000, default: null }, requirements: { type: String, trim: true, maxlength: 5000, default: '' },
  status: { type: String, enum: ['new', 'reviewing', 'fulfilled', 'cancelled'], default: 'new', index: true },
}, { timestamps: true })
serviceRequestSchema.index({ createdAt: -1 })
export default mongoose.model('ServiceRequest', serviceRequestSchema)
