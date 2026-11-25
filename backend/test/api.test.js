import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'

process.env.NODE_ENV = 'test'
process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/integrated-it-solution-test'
process.env.JWT_SECRET ||= 'test-only-secret-with-at-least-32-characters'
process.env.CLIENT_ORIGIN ||= 'http://localhost:5173'
const { default: app } = await import('../src/app.js')

let server
let base
before(async () => {
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  base = `http://127.0.0.1:${server.address().port}/api`
})
after(async () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())))

describe('API boundary behavior', () => {
  it('reports API health without exposing configuration', async () => {
    const response = await fetch(`${base}/health`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { status: 'ok', service: 'integrated-it-solution-api' })
  })
  it('rejects invalid enquiry payloads before database access', async () => {
    const response = await fetch(`${base}/enquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'not-an-email' }) })
    assert.equal(response.status, 400)
    assert.ok((await response.json()).errors.length > 0)
  })
  it('protects administrative enquiry data from unauthenticated requests', async () => {
    const response = await fetch(`${base}/enquiries`)
    assert.equal(response.status, 401)
  })
  it('does not expose public account registration', async () => {
    const response = await fetch(`${base}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@example.com', password: 'not-a-real-password' }) })
    assert.equal(response.status, 404)
  })
  it('validates login input before trying to read a user', async () => {
    const response = await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'bad', password: '' }) })
    assert.equal(response.status, 400)
  })
})
