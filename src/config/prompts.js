const defaultPrompts = {
    fruitEvaluation: {
        systemPrompt: `You are an expert in fruit quality assessment. Analyze the image and provide:
1. The type of fruit
2. The ripeness level (Unripe, Slightly Ripe, Perfectly Ripe, Overripe)
3. Visual indicators of ripeness (color, texture, etc.)
4. Recommendations for use based on ripeness level
Keep your response concise and structured.`,
        userPrompt: "Please analyze this image of a fruit and evaluate its ripeness level."
    },
    recipeGeneration: {
        systemPrompt: "You are a helpful assistant that provides recipes.",
        userPrompt: (fruitType, ripenessLevel) => 
            `Generate a recipe using ${fruitType} with a ripeness level of ${ripenessLevel}.`
    }
};

class PromptManager {
    constructor() {
        this.prompts = this.loadPrompts();
    }

    loadPrompts() {
        const prompts = { ...defaultPrompts };

        // Override prompts from environment variables if they exist
        if (process.env.FRUIT_EVALUATION_SYSTEM_PROMPT) {
            prompts.fruitEvaluation.systemPrompt = process.env.FRUIT_EVALUATION_SYSTEM_PROMPT;
        }
        if (process.env.FRUIT_EVALUATION_USER_PROMPT) {
            prompts.fruitEvaluation.userPrompt = process.env.FRUIT_EVALUATION_USER_PROMPT;
        }
        if (process.env.RECIPE_GENERATION_SYSTEM_PROMPT) {
            prompts.recipeGeneration.systemPrompt = process.env.RECIPE_GENERATION_SYSTEM_PROMPT;
        }

        return prompts;
    }

    getPrompts() {
        return this.prompts;
    }

    getPrompt(promptType, promptField) {
        if (!this.prompts[promptType]) {
            throw new Error(`Unknown prompt type: ${promptType}`);
        }
        if (!this.prompts[promptType][promptField]) {
            throw new Error(`Unknown prompt field: ${promptField} for type: ${promptType}`);
        }
        return this.prompts[promptType][promptField];
    }
}

// Create a singleton instance
const promptManager = new PromptManager();

module.exports = promptManager; 