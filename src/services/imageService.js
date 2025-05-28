const { ValidationError, ProcessingError } = require('../utils/errors');
const promptManager = require('../config/prompts');

class ImageService {
    constructor(downstreamService) {
        this.downstreamService = downstreamService;
    }

    generateFruitEvaluationPrompt() {
        return promptManager.getPrompts().fruitEvaluation;
    }

    async processAndSendImage(imageData, metadata = {}) {
        try {
            // Generate fruit evaluation prompt
            const { systemPrompt, userPrompt } = this.generateFruitEvaluationPrompt();

            // Format the base64 image data with data URL format
            const formattedImageData = `data:image/jpeg;base64,${imageData}`;

            // Prepare data for downstream service
            const downstreamData = {
                image: formattedImageData,
                systemPrompt,
                prompt: userPrompt
            };

            // Send to downstream service
            return await this.downstreamService.sendProcessedImage(downstreamData);
        } catch (error) {
            if (error instanceof ValidationError || error instanceof ProcessingError) {
                throw error;
            }
            throw new ProcessingError(`Failed to process image: ${error.message}`);
        }
    }
}

module.exports = ImageService; 