import Service from '../models/Service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { slugify } from '../utils/slugify.js'

export const listServices = asyncHandler(async (req, res) => {
  const filter = req.user ? {} : { active: true }
  res.json({ items: await Service.find(filter).sort({ sortOrder: 1, name: 1 }).lean() })
})
export const listAllServices = asyncHandler(async (req, res) => res.json({ items: await Service.find().sort({ sortOrder: 1, name: 1 }).lean() }))
export const getService = asyncHandler(async (req, res) => {
  const item = await Service.findOne({ slug: req.params.slug, ...(req.user ? {} : { active: true }) }).lean()
  if (!item) return res.status(404).json({ message: 'Service not found.' })
  res.json({ item })
})
export const createService = asyncHandler(async (req, res) => {
  const item = await Service.create({ ...req.body, slug: slugify(req.body.slug || req.body.name) })
  res.status(201).json({ item })
})
export const updateService = asyncHandler(async (req, res) => {
  const changes = { ...req.body }
  if (changes.name || changes.slug) changes.slug = slugify(changes.slug || changes.name)
  const item = await Service.findByIdAndUpdate(req.params.id, { $set: changes }, { new: true, runValidators: true })
  if (!item) return res.status(404).json({ message: 'Service not found.' })
  res.json({ item })
})
export const deleteService = asyncHandler(async (req, res) => {
  const item = await Service.findByIdAndDelete(req.params.id)
  if (!item) return res.status(404).json({ message: 'Service not found.' })
  res.json({ message: 'Service deleted.' })
})
