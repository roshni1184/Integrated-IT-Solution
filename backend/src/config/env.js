import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().trim().min(1).default('integrated-it-solution'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  SMTP_HOST: z.string().optional().default(''), SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.string().default('false'), SMTP_USER: z.string().optional().default(''), SMTP_PASSWORD: z.string().optional().default(''),
  MAIL_FROM: z.string().optional().default(''), ENQUIRY_NOTIFICATION_EMAIL: z.string().optional().default(''),
})
const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.issues.map(({ path, message }) => `${path.join('.')}: ${message}`).join('; '))
  process.exit(1)
}
export const env = { ...parsed.data, SMTP_SECURE: parsed.data.SMTP_SECURE === 'true' }
