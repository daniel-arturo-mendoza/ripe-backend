const { ValidationError } = require('../utils/errors');
const promptManager = require('../config/prompts');

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

        const { systemPrompt, userPrompt } = promptManager.getPrompts().recipeGeneration;
        const data = {
            prompt: userPrompt(fruitType, ripenessLevel),
            systemPrompt
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