const mongooseValidation = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send(err)
  } else {
    next(err)
  }
}

const queryValidation = (err, req, res, next) => {
  if (err.name === 'InvalidQueryError') {
    return res.status(400).send({ name: err.name, message: err.message })
  } else {
    next(err)
  }
}

const handleElastic = (err, req, res, next) => {
  if (err.source === 'elastic') {
    return res.status(err.statusCode).send(err)
  } else {
    return next(err)
  }
}

const handleEvents = (err, req, res, next) => {
  if (err.source === 'event-validation') {
    return res.status(400).send({ error: err.name, message: err.message })
  } else {
    next(err)
  }
}

const defaultError = (err, req, res, next) => {
  console.error(err)
  return res
    .status(500)
    .send({ error: process.env.SERVERLESS_STAGE === 'prod' ? err.name : { message: err.message, stack: err.stack } })
}

module.exports = [mongooseValidation, queryValidation, handleElastic, handleEvents, defaultError]
