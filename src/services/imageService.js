const ImageValidator = require('../validators/imageValidator');
const ImageProcessor = require('./imageProcessor');
const { ValidationError, ProcessingError } = require('../utils/errors');

class ImageService {
    constructor(downstreamService) {
        this.downstreamService = downstreamService;
    }

    generateFruitEvaluationPrompt() {
        return {
            systemPrompt: `You are an expert in fruit quality assessment. Analyze the image and provide:
1. The type of fruit
2. The ripeness level (Unripe, Slightly Ripe, Perfectly Ripe, Overripe)
3. Visual indicators of ripeness (color, texture, etc.)
4. Recommendations for use based on ripeness level
Keep your response concise and structured.`,
            prompt: "Please analyze this image of a fruit and evaluate its ripeness level."
        };
    }

    async processAndSendImage(imageData, metadata = {}) {
        try {
            // Validate that the input is a valid base64 string
            // if (!imageData || typeof imageData !== 'string') {
            //     throw new ValidationError('Invalid image data format');
            // }

            // Convert to buffer for validation
            // const imageBuffer = Buffer.from(imageData, 'base64');

            // Validate image
            // const imageMetadata = await ImageValidator.validateImage(imageBuffer);

            // Generate fruit evaluation prompt
            const { systemPrompt, prompt } = this.generateFruitEvaluationPrompt();

            // Format the base64 image data with data URL format
            const formattedImageData = `data:image/jpeg;base64,${imageData}`;

            // Prepare data for downstream service
            const downstreamData = {
                image: formattedImageData,
                systemPrompt,
                prompt
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