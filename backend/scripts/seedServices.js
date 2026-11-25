import 'dotenv/config'
import mongoose from 'mongoose'
import Service from '../src/models/Service.js'
import { serviceCatalog } from '../src/data/serviceCatalog.js'
import { slugify } from '../src/utils/slugify.js'

if (!process.env.MONGODB_URI) {
  console.error('Set MONGODB_URI before seeding services.')
  process.exit(1)
}
try {
  await mongoose.connect(process.env.MONGODB_URI)
  const rows = serviceCatalog.flatMap(({ category, services }, categoryIndex) => services.map((name, serviceIndex) => ({ name, slug: slugify(name), category, sortOrder: categoryIndex * 100 + serviceIndex })))
  for (const service of rows) await Service.updateOne({ slug: service.slug }, { $setOnInsert: service }, { upsert: true })
  console.info(`Service catalog ready: ${rows.length} services.`)
} catch (error) {
  console.error('Service seed failed:', error.message)
  process.exitCode = 1
} finally { await mongoose.disconnect() }
