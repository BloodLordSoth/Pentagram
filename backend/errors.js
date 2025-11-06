export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "There seems to be something wrong on your end") {
    super(message, 401);
  }
}

export class UsernameError extends AppError {
  constructor(message = "That username is already taken.") {
    super(message, 409);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "What you\'re looking for can\'t be found.") {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to do that.") {
    super(message, 403);
  }
}

export class InvalidPasswordError extends AppError {
  constructor(message = "Sorry, The passwords don't match. Try again") {
    super(message, 409);
  }
}

export class NoUserFoundError extends AppError {
  constructor(message = "That user doesn\'t exist.") {
    super(message, 404);
  }
}
