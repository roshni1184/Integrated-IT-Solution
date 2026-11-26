import { Router } from 'express'
import { dashboardAnalytics } from '../controllers/enquiryController.js'
import { createCustomer, listCustomers, listServiceRequests, updateServiceRequest } from '../controllers/adminController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { customerSchema, updateServiceRequestSchema } from '../validation/schemas.js'
export const dashboardRouter = Router()
dashboardRouter.use(requireAuth, requireRole('admin'))
dashboardRouter.get('/analytics', dashboardAnalytics)
dashboardRouter.get('/customers', listCustomers)
dashboardRouter.post('/customers', validate(customerSchema), createCustomer)
dashboardRouter.get('/service-requests', listServiceRequests)
dashboardRouter.patch('/service-requests/:id', validate(updateServiceRequestSchema), updateServiceRequest)
