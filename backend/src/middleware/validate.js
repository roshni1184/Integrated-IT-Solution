export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) return res.status(400).json({ message: 'Please check the submitted information.', errors: result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) })
    req[source] = result.data
    next()
  }
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) return res.status(400).json({ message: 'Please check the query parameters.', errors: result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) })
    res.locals.query = result.data
    next()
  }
}
