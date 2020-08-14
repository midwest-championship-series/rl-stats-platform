const mongooseValidation = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send(err)
  } else {
    next(err)
  }
}

module.exports = [mongooseValidation]
