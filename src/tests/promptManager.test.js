const promptManager = require('../config/prompts');

describe('PromptManager', () => {
    test('should load default prompts', () => {
        const prompts = promptManager.getPrompts();
        
        // Test fruit evaluation prompts
        expect(prompts.fruitEvaluation).toBeDefined();
        expect(prompts.fruitEvaluation.systemPrompt).toContain('expert in fruit quality assessment');
        expect(prompts.fruitEvaluation.userPrompt).toBe('Please analyze this image of a fruit and evaluate its ripeness level.');

        // Test recipe generation prompts
        expect(prompts.recipeGeneration).toBeDefined();
        expect(prompts.recipeGeneration.systemPrompt).toBe('You are a helpful assistant that provides recipes.');
        expect(typeof prompts.recipeGeneration.userPrompt).toBe('function');
    });

    test('should generate recipe prompt with parameters', () => {
        const prompts = promptManager.getPrompts();
        const recipePrompt = prompts.recipeGeneration.userPrompt('apple', 'Perfectly Ripe');
        expect(recipePrompt).toBe('Generate a recipe using apple with a ripeness level of Perfectly Ripe.');
    });

    test('should throw error for unknown prompt type', () => {
        expect(() => {
            promptManager.getPrompt('unknownType', 'systemPrompt');
        }).toThrow('Unknown prompt type: unknownType');
    });

    test('should throw error for unknown prompt field', () => {
        expect(() => {
            promptManager.getPrompt('fruitEvaluation', 'unknownField');
        }).toThrow('Unknown prompt field: unknownField for type: fruitEvaluation');
    });
}); 