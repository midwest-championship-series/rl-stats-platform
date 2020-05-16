module.exports = (req, res, next) => {
  if (req.context) {
    return res.status(req.status || 200).send(req.context)
  } else {
    return res.status(404).send()
  }
}
