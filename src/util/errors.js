class RecoverableError extends Error {
  constructor(msg) {
    super(msg)
    this.code = 'recoverable_error'
  }
}

class UnRecoverableError extends Error {
  constructor(code, msg) {
    super(msg)
    this.code = code
  }
}

module.exports = {
  RecoverableError,
  UnRecoverableError,
}
