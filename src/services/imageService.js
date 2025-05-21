const ImageValidator = require('../validators/imageValidator');
const ImageProcessor = require('./imageProcessor');
const { ValidationError, ProcessingError } = require('../utils/errors');

class ImageService {
    constructor(downstreamService) {
        this.downstreamService = downstreamService;
    }

    async processAndSendImage(imageData, metadata = {}) {
        try {
            // Convert base64 image to buffer
            const imageBuffer = Buffer.from(imageData, 'base64');

            // Validate image
            const imageMetadata = await ImageValidator.validateImage(imageBuffer);

            // Process image
            const processedImage = await ImageProcessor.processImage(imageBuffer);

            // Prepare data for downstream service
            const downstreamData = {
                image: processedImage.toString('base64'),
                metadata: {
                    ...metadata,
                    processedAt: new Date().toISOString(),
                    originalSize: imageBuffer.length,
                    processedSize: processedImage.length,
                    originalFormat: imageMetadata.format,
                    originalDimensions: {
                        width: imageMetadata.width,
                        height: imageMetadata.height
                    }
                }
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