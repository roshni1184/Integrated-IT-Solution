import Customer from '../models/Customer.js'
import Enquiry from '../models/Enquiry.js'
import ServiceRequest from '../models/ServiceRequest.js'

const serviceRequestPreferences = new Set(['Rental', 'Purchase', 'Sale / trade-in'])

export async function createEnquiryRecord(data) {
  const enquiry = await Enquiry.create(data)
  const customer = await Customer.findOneAndUpdate(
    { email: data.email },
    { $set: { name: data.name, email: data.email, phone: data.phone, company: data.company } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )
  if (!serviceRequestPreferences.has(data.preference)) return enquiry

  await ServiceRequest.create({
    enquiry: enquiry.id,
    customer: customer.id,
    requestType: data.preference === 'Rental'
      ? 'rental'
      : data.preference === 'Sale / trade-in'
        ? 'sale_trade_in'
        : 'purchase',
    deviceType: data.deviceType,
    deviceConfiguration: data.deviceConfiguration,
    rentalDuration: data.rentalDuration,
    location: data.location,
    quantity: data.quantity,
    requirements: data.message,
  })
  return enquiry
}
