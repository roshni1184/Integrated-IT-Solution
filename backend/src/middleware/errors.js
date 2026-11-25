export function notFound(req, res) { res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }) }
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)
  if (error?.code === 11000) return res.status(409).json({ message: 'A record with that value already exists.' })
  if (error?.name === 'ValidationError') return res.status(400).json({ message: 'The submitted information is invalid.', errors: Object.values(error.errors).map((item) => item.message) })
  if (error?.name === 'CastError') return res.status(400).json({ message: 'The requested record identifier is invalid.' })
  console.error(error)
  res.status(500).json({ message: 'An unexpected server error occurred.' })
}
