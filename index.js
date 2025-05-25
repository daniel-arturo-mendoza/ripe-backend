const ImageService = require('./src/services/imageService');
const DownstreamService = require('./src/services/downstreamService');
const ResponseHandler = require('./src/utils/responseHandler');
const { ValidationError, ProviderError } = require('./src/utils/errors');
const getConfig = require('./src/config');
const RecipeService = require('./src/services/recipeService');

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
const handleCors = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return await ResponseHandler.success({}, 'CORS preflight successful');
    }
    return null;
};

// Main handler
exports.handler = async (event) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));

        // Handle CORS preflight
        const corsResponse = await handleCors(event);
        if (corsResponse) return corsResponse;

        // Initialize services with config
        const config = await getConfig();
        const downstreamService = new DownstreamService(config);
        const imageService = new ImageService(downstreamService);
        const recipeService = new RecipeService(downstreamService);

        // Route based on path
        if (event.path === '/recipe') {
            const { fruitType, ripenessLevel } = JSON.parse(event.body);
            const recipe = await recipeService.generateRecipe(fruitType, ripenessLevel);
            return await ResponseHandler.success(recipe, 'Recipe generated successfully');
        } else {
            // Parse and validate request body for image processing
            const { image, metadata } = parseRequestBody(event);
            const downstreamResponse = await imageService.processAndSendImage(image, metadata);
            console.log('Downstream service response:', downstreamResponse);
            return await ResponseHandler.success(downstreamResponse, 'Image processed successfully');
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return await ResponseHandler.error(error);
    }
}; 