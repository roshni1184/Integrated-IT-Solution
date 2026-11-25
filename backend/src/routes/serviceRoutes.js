import { Router } from 'express'
import { createService, deleteService, getService, listServices, updateService } from '../controllers/serviceController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createServiceSchema } from '../validation/schemas.js'
export const serviceRouter = Router()
serviceRouter.get('/', listServices)
serviceRouter.get('/:slug', getService)
serviceRouter.post('/', requireAuth, requireRole('admin'), validate(createServiceSchema), createService)
serviceRouter.patch('/:id', requireAuth, requireRole('admin'), validate(createServiceSchema.partial()), updateService)
serviceRouter.delete('/:id', requireAuth, requireRole('admin'), deleteService)
