const config = require('../config');

class ResponseHandler {
    static success(data, message = 'Success') {
        return {
            statusCode: 200,
            headers: this.getHeaders(),
            body: JSON.stringify({
                message,
                data
            })
        };
    }

    static error(error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';

        return {
            statusCode,
            headers: this.getHeaders(),
            body: JSON.stringify({
                message: 'Error processing request',
                error: message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }

    static getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': config.cors.allowedOrigins[0],
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };
    }
}

module.exports = ResponseHandler; 