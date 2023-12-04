/* eslint max-classes-per-file: ["error", { ignoreExpressions: true }] */
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
};
