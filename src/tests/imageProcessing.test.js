const { handler } = require('../../index');
const { ValidationError, ProcessingError, DownstreamError } = require('../utils/errors');

// Mock the services
jest.mock('../services/imageService');
jest.mock('../services/downstreamService');

describe('Image Processing Lambda', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('should successfully process a valid image request', async () => {
        // Mock event
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                image: 'base64EncodedImageString',
                metadata: {
                    prompt: 'test prompt',
                    size: '1024x1024'
                }
            })
        };

        // Mock successful response
        const mockResponse = {
            provider: 'openai',
            data: {
                url: 'https://example.com/generated-image.jpg'
            },
            metadata: {
                model: 'dall-e-3',
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        };

        // Mock the service response
        const ImageService = require('../services/imageService');
        ImageService.prototype.processAndSendImage.mockResolvedValue(mockResponse);

        // Call the handler
        const response = await handler(event);

        // Assertions
        const responseBody = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        expect(responseBody.success).toBe(true);
        expect(responseBody.message).toBe('Image processed successfully');
        expect(responseBody.data).toMatchObject({
            provider: 'openai',
            data: { url: 'https://example.com/generated-image.jpg' },
            metadata: {
                model: 'dall-e-3',
                timestamp: expect.any(String)
            }
        });
    });

    test('should handle CORS preflight request', async () => {
        const event = {
            httpMethod: 'OPTIONS'
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({
            success: true,
            data: {},
            message: 'CORS preflight successful'
        });
    });

    test('should handle missing image in request', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                metadata: {
                    prompt: 'test prompt'
                }
            })
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toEqual({
            success: false,
            error: 'No image provided in the request'
        });
    });

    test('should handle invalid JSON in request body', async () => {
        const event = {
            httpMethod: 'POST',
            body: 'invalid json'
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toEqual({
            success: false,
            error: 'Invalid request body format'
        });
    });

    test('should handle image processing errors', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                image: 'base64EncodedImageString',
                metadata: {
                    prompt: 'test prompt'
                }
            })
        };

        // Mock processing error
        const ImageService = require('../services/imageService');
        ImageService.prototype.processAndSendImage.mockRejectedValue(
            new ProcessingError('Failed to process image')
        );

        const response = await handler(event);

        expect(response.statusCode).toBe(422);
        expect(JSON.parse(response.body)).toEqual({
            success: false,
            error: 'Failed to process image'
        });
    });

    test('should handle downstream service errors', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                image: 'base64EncodedImageString',
                metadata: {
                    prompt: 'test prompt'
                }
            })
        };

        // Mock downstream error
        const ImageService = require('../services/imageService');
        ImageService.prototype.processAndSendImage.mockRejectedValue(
            new DownstreamError('Downstream service unavailable')
        );

        const response = await handler(event);

        expect(response.statusCode).toBe(502);
        expect(JSON.parse(response.body)).toEqual({
            success: false,
            error: 'Downstream service unavailable'
        });
    });
}); 