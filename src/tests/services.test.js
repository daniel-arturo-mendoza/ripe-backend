const ImageService = require('../services/imageService');
const RecipeService = require('../services/recipeService');

// Mock downstream service
const mockDownstreamService = {
    sendProcessedImage: jest.fn()
};

describe('Services with PromptManager', () => {
    let imageService;
    let recipeService;

    beforeEach(() => {
        imageService = new ImageService(mockDownstreamService);
        recipeService = new RecipeService(mockDownstreamService);
        mockDownstreamService.sendProcessedImage.mockClear();
    });

    test('ImageService should use correct prompts', async () => {
        const mockImageData = 'base64ImageData';
        mockDownstreamService.sendProcessedImage.mockResolvedValue({ data: 'success' });

        await imageService.processAndSendImage(mockImageData);

        expect(mockDownstreamService.sendProcessedImage).toHaveBeenCalledWith(
            expect.objectContaining({
                image: 'data:image/jpeg;base64,base64ImageData',
                systemPrompt: expect.stringContaining('expert in fruit quality assessment'),
                prompt: 'Please analyze this image of a fruit and evaluate its ripeness level.'
            })
        );
    });

    test('RecipeService should use correct prompts', async () => {
        const fruitType = 'apple';
        const ripenessLevel = 'Perfectly Ripe';
        mockDownstreamService.sendProcessedImage.mockResolvedValue({ data: 'success' });

        await recipeService.generateRecipe(fruitType, ripenessLevel);

        expect(mockDownstreamService.sendProcessedImage).toHaveBeenCalledWith(
            expect.objectContaining({
                systemPrompt: 'You are a helpful assistant that provides recipes.',
                prompt: 'Generate a recipe using apple with a ripeness level of Perfectly Ripe.'
            })
        );
    });

    test('RecipeService should validate inputs', async () => {
        await expect(recipeService.generateRecipe(null, 'Perfectly Ripe'))
            .rejects.toThrow('Fruit type is required');
        
        await expect(recipeService.generateRecipe('apple', null))
            .rejects.toThrow('Ripeness level is required');
    });
}); 