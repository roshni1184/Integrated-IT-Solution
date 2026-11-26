import Customer from '../models/Customer.js'
import ServiceRequest from '../models/ServiceRequest.js'
import Enquiry from '../models/Enquiry.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createManualEnquiry = asyncHandler(async (req, res) => {
  const item = await Enquiry.create(req.body)
  res.status(201).json({ item })
})
export const listCustomers = asyncHandler(async (req, res) => {
  const { page, limit, search } = res.locals.query
  const filter = search ? { $or: ['name', 'email', 'phone', 'company'].map((field) => ({ [field]: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } })) } : {}
  const [items, total] = await Promise.all([Customer.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Customer.countDocuments(filter)])
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
})
export const createCustomer = asyncHandler(async (req, res) => res.status(201).json({ item: await Customer.create(req.body) }))
export const listServiceRequests = asyncHandler(async (req, res) => {
  const { page, limit, status, requestType } = res.locals.query
  const filter = {}; if (status) filter.status = status; if (requestType) filter.requestType = requestType
  const [items, total] = await Promise.all([ServiceRequest.find(filter).populate('enquiry').populate('customer').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), ServiceRequest.countDocuments(filter)])
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
})
export const updateServiceRequest = asyncHandler(async (req, res) => {
  const item = await ServiceRequest.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true })
  if (!item) return res.status(404).json({ message: 'Service request not found.' })
  res.json({ item })
})
