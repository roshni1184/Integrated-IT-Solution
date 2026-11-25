import Enquiry from '../models/Enquiry.js'
import ServiceRequest from '../models/ServiceRequest.js'
import Customer from '../models/Customer.js'
import { notifyNewEnquiry } from '../services/email.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createEnquiry = asyncHandler(async (req, res) => {
  const data = req.body
  const enquiry = await Enquiry.create(data)
  if (['Rental', 'Purchase', 'Sale / trade-in'].includes(data.preference)) {
    let customer = null
    if (data.email || data.phone) {
      customer = await Customer.findOneAndUpdate({ $or: [{ email: data.email || '__none__' }, { phone: data.phone }] }, { $set: { name: data.name, email: data.email, phone: data.phone, company: data.company } }, { new: true, upsert: true, setDefaultsOnInsert: true })
    }
    await ServiceRequest.create({ enquiry: enquiry.id, customer: customer?.id ?? null, requestType: data.preference === 'Rental' ? 'rental' : 'purchase', deviceType: data.deviceType, quantity: data.quantity, requirements: data.message })
  }
  try { await notifyNewEnquiry(enquiry) } catch (error) { console.error('Enquiry notification email failed:', error.message) }
  res.status(201).json({ message: 'Enquiry received successfully.', id: enquiry.id })
})

function buildEnquiryFilter(query) {
  const filter = {}
  if (query.status) filter.status = query.status
  if (query.service) filter.service = query.service
  if (query.enquiryType) filter.enquiryType = query.enquiryType
  if (query.from || query.to) filter.createdAt = { ...(query.from && { $gte: new Date(query.from) }), ...(query.to && { $lte: new Date(query.to) }) }
  if (query.search) {
    const safe = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    filter.$or = ['name', 'email', 'phone', 'service', 'company'].map((field) => ({ [field]: { $regex: safe, $options: 'i' } }))
  }
  return filter
}
export const listEnquiries = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20))
  const filter = buildEnquiryFilter(req.query)
  const [items, total] = await Promise.all([Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('assignedTo', 'name email').lean(), Enquiry.countDocuments(filter)])
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
})
export const getEnquiry = asyncHandler(async (req, res) => {
  const item = await Enquiry.findById(req.params.id).populate('assignedTo', 'name email').populate('notes.author', 'name email')
  if (!item) return res.status(404).json({ message: 'Enquiry not found.' })
  res.json({ item })
})
export const updateEnquiry = asyncHandler(async (req, res) => {
  const item = await Enquiry.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).populate('assignedTo', 'name email')
  if (!item) return res.status(404).json({ message: 'Enquiry not found.' })
  res.json({ item })
})
export const addEnquiryNote = asyncHandler(async (req, res) => {
  const item = await Enquiry.findByIdAndUpdate(req.params.id, { $push: { notes: { text: req.body.text, author: req.user.id } } }, { new: true, runValidators: true }).populate('notes.author', 'name email')
  if (!item) return res.status(404).json({ message: 'Enquiry not found.' })
  res.status(201).json({ item })
})
export const exportEnquiries = asyncHandler(async (req, res) => {
  const items = await Enquiry.find(buildEnquiryFilter(req.query)).sort({ createdAt: -1 }).limit(10000).lean()
  const fields = ['createdAt', 'name', 'email', 'phone', 'company', 'service', 'enquiryType', 'status', 'deviceType', 'quantity', 'preference', 'message']
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const csv = [fields.join(','), ...items.map((item) => fields.map((field) => escape(field === 'createdAt' ? item[field]?.toISOString() : item[field])).join(','))].join('\r\n')
  res.type('text/csv').attachment('enquiries.csv').send(csv)
})

export const dashboardAnalytics = asyncHandler(async (req, res) => {
  const now = new Date(); const monthStart = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  const [statusCounts, serviceCounts, daily, monthly, total] = await Promise.all([
    Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Enquiry.aggregate([{ $group: { _id: '$service', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 12 }]),
    Enquiry.aggregate([{ $match: { createdAt: { $gte: new Date(now.getTime() - 29 * 86400000) } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Enquiry.aggregate([{ $match: { createdAt: { $gte: monthStart } } }, { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Enquiry.countDocuments(),
  ])
  const byStatus = Object.fromEntries(statusCounts.map(({ _id, count }) => [_id, count]))
  res.json({ total, byStatus: { new: 0, contacted: 0, in_progress: 0, converted: 0, rejected: 0, ...byStatus }, byService: serviceCounts.map(({ _id, count }) => ({ service: _id, count })), daily, monthly })
})
