
class ApiResponseError extends Error {
    constructor(message, code) {
        super(message);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundApiResponseError extends ApiResponseError {
    constructor(message) {
        super(message, 404);
    }
}

module.exports = {
    ApiResponseError,
    NotFoundApiResponseError,
};