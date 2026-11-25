import app from './app.js'
import { env } from './config/env.js'
import { connectDatabase } from './config/database.js'

try {
  await connectDatabase()
  const server = app.listen(env.PORT, () => console.info(`API listening on port ${env.PORT}`))
  const shutdown = (signal) => {
    console.info(`${signal} received; closing server`)
    server.close(async () => { const mongoose = await import('mongoose'); await mongoose.default.disconnect(); process.exit(0) })
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
} catch (error) {
  console.error('Unable to start API:', error.message)
  process.exit(1)
}
