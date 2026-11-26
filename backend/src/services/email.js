import nodemailer from 'nodemailer'
import { env } from '../config/env.js'
let transporter
function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.MAIL_FROM) return null
  transporter ??= nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_SECURE, auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } })
  return transporter
}
export async function notifyNewEnquiry(enquiry) {
  const mailer = getTransporter()
  if (!mailer || !env.ENQUIRY_NOTIFICATION_EMAIL) return false
  await mailer.sendMail({ from: env.MAIL_FROM, to: env.ENQUIRY_NOTIFICATION_EMAIL, replyTo: enquiry.email, subject: `New ${enquiry.enquiryType} enquiry: ${enquiry.service}`, text: [`Name: ${enquiry.name}`, `Email: ${enquiry.email}`, `Phone: ${enquiry.phone}`, `Company: ${enquiry.company || 'Not provided'}`, `Service: ${enquiry.service}`, `Device type: ${enquiry.deviceType || 'Not provided'}`, `Quantity: ${enquiry.quantity ?? 'Not provided'}`, `Rental or purchase: ${enquiry.preference || 'Not specified'}`, `Message: ${enquiry.message}`].join('\n') })
  return true
}
