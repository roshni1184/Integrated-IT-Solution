import { z } from 'zod'

const pagination = {
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}

export const enquiryQuerySchema = z.object({
  ...pagination,
  search: z.string().trim().max(120).optional(),
  status: z.enum(['new', 'contacted', 'in_progress', 'converted', 'rejected']).optional(),
  service: z.string().trim().min(1).max(120).optional(),
  enquiryType: z.enum(['contact', 'quote']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
}).strict().refine(({ from, to }) => !from || !to || Date.parse(from) <= Date.parse(to), {
  path: ['to'],
  message: 'End date must be after the start date.',
})

export const customerQuerySchema = z.object({
  ...pagination,
  search: z.string().trim().max(120).optional(),
}).strict()

export const serviceRequestQuerySchema = z.object({
  ...pagination,
  status: z.enum(['new', 'reviewing', 'fulfilled', 'cancelled']).optional(),
  requestType: z.enum(['rental', 'purchase', 'service']).optional(),
}).strict()
