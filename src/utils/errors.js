class ArcaneError extends Error {
  constructor(message, code = 'ARCANE_ERROR') {
    super(message);
    this.name = 'ArcaneError';
    this.code = code;
  }
}

class ValidationError extends ArcaneError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

module.exports = {
  ArcaneError,
  ValidationError
};
