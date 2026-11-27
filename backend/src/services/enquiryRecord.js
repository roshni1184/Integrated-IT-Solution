import Customer from '../models/Customer.js'
import Enquiry from '../models/Enquiry.js'
import ServiceRequest from '../models/ServiceRequest.js'

const serviceRequestPreferences = new Set(['Rental', 'Purchase', 'Sale / trade-in'])

export async function createEnquiryRecord(data) {
  const enquiry = await Enquiry.create(data)
  if (!serviceRequestPreferences.has(data.preference)) return enquiry

  let customer = null
  if (data.email || data.phone) {
    const identity = data.email ? { email: data.email } : { phone: data.phone }
    customer = await Customer.findOneAndUpdate(
      identity,
      { $set: { name: data.name, email: data.email, phone: data.phone, company: data.company } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
  }

  await ServiceRequest.create({
    enquiry: enquiry.id,
    customer: customer?.id ?? null,
    requestType: data.preference === 'Rental'
      ? 'rental'
      : data.preference === 'Sale / trade-in'
        ? 'sale_trade_in'
        : 'purchase',
    deviceType: data.deviceType,
    quantity: data.quantity,
    requirements: data.message,
  })
  return enquiry
}
