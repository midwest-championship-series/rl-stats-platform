class RecoverableError extends Error {
  constructor(msg, notice) {
    super(msg)
    this.code = 'recoverable_error'
    this.notice = notice
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
