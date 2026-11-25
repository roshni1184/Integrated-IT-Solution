import { Router } from 'express'
import { createEnquiry, listEnquiries, getEnquiry, updateEnquiry, addEnquiryNote, exportEnquiries } from '../controllers/enquiryController.js'
import { createManualEnquiry } from '../controllers/adminController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { enquirySchema, updateEnquirySchema, noteSchema } from '../validation/schemas.js'
export const enquiryRouter = Router()
enquiryRouter.post('/', validate(enquirySchema), createEnquiry)
enquiryRouter.use(requireAuth)
enquiryRouter.get('/', listEnquiries)
enquiryRouter.get('/export.csv', exportEnquiries)
enquiryRouter.post('/manual', requireRole('admin'), validate(enquirySchema), createManualEnquiry)
enquiryRouter.get('/:id', getEnquiry)
enquiryRouter.patch('/:id', validate(updateEnquirySchema), updateEnquiry)
enquiryRouter.post('/:id/notes', validate(noteSchema), addEnquiryNote)
