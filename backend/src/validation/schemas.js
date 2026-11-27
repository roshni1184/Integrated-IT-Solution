import { z } from 'zod'

const email = z.string().trim().email().max(254)
const mongoId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid record identifier')
export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120), email, phone: z.string().trim().min(5).max(40), company: z.string().trim().max(160).optional().default(''),
  service: z.string().trim().min(2).max(120), enquiryType: z.enum(['contact', 'quote']).default('contact'), message: z.string().trim().min(10).max(5000),
  source: z.enum(['website', 'whatsapp', 'phone', 'referral', 'other']).optional().default('website'),
  deviceType: z.string().trim().max(80).optional().default(''), quantity: z.union([z.coerce.number().int().min(1).max(10000), z.literal(''), z.null()]).optional().transform((value) => value === '' || value == null ? null : value),
  deviceConfiguration: z.string().trim().max(500).optional().default(''), rentalDuration: z.string().trim().max(120).optional().default(''), location: z.string().trim().max(160).optional().default(''),
  preference: z.enum(['', 'Rental', 'Purchase', 'Sale / trade-in', 'Not applicable']).optional().default(''),
}).strict()
export const loginSchema = z.object({ email, password: z.string().min(1).max(200) }).strict()
export const createServiceSchema = z.object({ name: z.string().trim().min(2).max(120), slug: z.string().trim().min(2).max(140).optional(), category: z.string().trim().min(2).max(120), description: z.string().trim().max(2000).optional().default(''), active: z.boolean().optional(), sortOrder: z.number().int().min(0).max(10000).optional() }).strict()
export const updateEnquirySchema = z.object({ status: z.enum(['new', 'contacted', 'in_progress', 'converted', 'rejected']).optional(), followUpAt: z.union([z.string().datetime(), z.null()]).optional(), assignedTo: z.union([mongoId, z.null()]).optional() }).strict().refine((value) => Object.keys(value).length > 0, 'At least one field must be provided')
export const noteSchema = z.object({ text: z.string().trim().min(1).max(2000) }).strict()
export const customerSchema = z.object({ name: z.string().trim().min(2).max(120), email: z.union([email, z.literal('')]).optional().default(''), phone: z.string().trim().max(40).optional().default(''), company: z.string().trim().max(160).optional().default(''), notes: z.string().trim().max(3000).optional().default('') }).strict()
export const serviceRequestSchema = z.object({ requestType: z.enum(['rental', 'purchase', 'sale_trade_in', 'service']), deviceType: z.string().trim().max(80).optional().default(''), deviceConfiguration: z.string().trim().max(500).optional().default(''), rentalDuration: z.string().trim().max(120).optional().default(''), location: z.string().trim().max(160).optional().default(''), quantity: z.number().int().min(1).max(10000).nullable().optional().default(null), requirements: z.string().trim().max(5000).optional().default(''), enquiry: mongoId.nullable().optional(), customer: mongoId.nullable().optional() }).strict()
export const updateServiceRequestSchema = z.object({ status: z.enum(['new', 'reviewing', 'fulfilled', 'cancelled']) }).strict()
