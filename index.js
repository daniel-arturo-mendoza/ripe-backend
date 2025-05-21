const ImageService = require('./src/services/imageService');
const DownstreamService = require('./src/services/downstreamService');
const ResponseHandler = require('./src/utils/responseHandler');
const { ValidationError } = require('./src/utils/errors');
const config = require('./src/config');

// Middleware to parse and validate request body
const parseRequestBody = (event) => {
    try {
        const body = JSON.parse(event.body);
        if (!body.image) {
            throw new ValidationError('No image provided in the request');
        }
        return body;
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }
        throw new ValidationError('Invalid request body format');
    }
};

// Middleware to handle CORS preflight requests
const handleCors = (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: ResponseHandler.getHeaders(),
            body: JSON.stringify({
                success: true,
                data: {},
                message: 'CORS preflight successful'
            })
        };
    }
    return null;
};

// Initialize services
const downstreamService = new DownstreamService(config);
const imageService = new ImageService(downstreamService);

// Main handler
exports.handler = async (event) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));

        // Handle CORS preflight
        const corsResponse = handleCors(event);
        if (corsResponse) return corsResponse;

        // Parse and validate request body
        const { image, metadata } = parseRequestBody(event);

        // Process image and send to downstream service
        const downstreamResponse = await imageService.processAndSendImage(image, metadata);
        console.log('Downstream service response:', downstreamResponse);

        return {
            statusCode: 200,
            headers: ResponseHandler.getHeaders(),
            body: JSON.stringify({
                success: true,
                data: downstreamResponse,
                message: 'Image processed successfully'
            })
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: error.statusCode || 500,
            headers: ResponseHandler.getHeaders(),
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
}; 