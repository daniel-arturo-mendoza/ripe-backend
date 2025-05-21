const { handler } = require('../../index');
const { ValidationError } = require('../utils/errors');

// Mock the downstream service
jest.mock('../../src/services/downstreamService', () => {
    return jest.fn().mockImplementation(() => ({
        sendProcessedImage: jest.fn().mockResolvedValue({
            success: true,
            data: 'Mock recipe for banana with ripeness level ripe.',
            metadata: { timestamp: new Date().toISOString() }
        })
    }));
});

describe('Recipe Handler', () => {
    test('should successfully generate a recipe', async () => {
        const event = {
            path: '/recipe',
            body: JSON.stringify({ fruitType: 'banana', ripenessLevel: 'ripe' })
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(true);
        expect(body.data).toBe('Mock recipe for banana with ripeness level ripe.');
        expect(body.message).toBe('Recipe generated successfully');
    });

    test('should handle missing fruit type', async () => {
        const event = {
            path: '/recipe',
            body: JSON.stringify({ ripenessLevel: 'ripe' })
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(false);
        expect(body.error).toBe('Fruit type is required');
    });

    test('should handle missing ripeness level', async () => {
        const event = {
            path: '/recipe',
            body: JSON.stringify({ fruitType: 'banana' })
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(false);
        expect(body.error).toBe('Ripeness level is required');
    });

    test('should handle invalid JSON', async () => {
        const event = {
            path: '/recipe',
            body: 'invalid json'
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(500);
        const body = JSON.parse(response.body);
        expect(body.success).toBe(false);
        expect(body.error).toBeDefined();
    });
}); 