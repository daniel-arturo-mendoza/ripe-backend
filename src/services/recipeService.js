const { ValidationError } = require('../utils/errors');

class RecipeService {
    constructor(downstreamService) {
        this.downstreamService = downstreamService;
    }

    async generateRecipe(fruitType, ripenessLevel) {
        if (!fruitType) {
            throw new ValidationError('Fruit type is required');
        }
        if (!ripenessLevel) {
            throw new ValidationError('Ripeness level is required');
        }

        const prompt = `Generate a recipe using ${fruitType} with a ripeness level of ${ripenessLevel}.`;
        const data = {
            prompt,
            systemPrompt: 'You are a helpful assistant that provides recipes.'
        };

        try {
            const result = await this.downstreamService.sendProcessedImage(data);
            return result.data;
        } catch (error) {
            throw new Error(`Failed to generate recipe: ${error.message}`);
        }
    }
}

module.exports = RecipeService; 