class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class ProcessingError extends AppError {
    constructor(message) {
        super(message, 422);
    }
}

class DownstreamError extends AppError {
    constructor(message) {
        super(message, 502);
    }
}

class ProviderError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}

module.exports = {
    AppError,
    ValidationError,
    ProcessingError,
    DownstreamError,
    ProviderError
}; 