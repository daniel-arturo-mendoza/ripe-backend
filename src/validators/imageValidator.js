const sharp = require('sharp');
const config = require('../config');
const { ValidationError } = require('../utils/errors');

// Allowed image formats and their MIME types
const ALLOWED_FORMATS = {
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif'
};

// Maximum dimensions allowed
const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;
const MAX_SIZE = 512 * 1024; // 512KB in bytes

class ImageValidator {
    static async validateImage(buffer) {
        try {
            // Check file size
            if (buffer.length > config.image.maxSize) {
                throw new ValidationError(
                    `Image size exceeds the maximum allowed size of ${config.image.maxSize / 1024}KB. ` +
                    `Current size: ${(buffer.length / 1024).toFixed(2)}KB`
                );
            }

            // Get image metadata
            const metadata = await sharp(buffer).metadata();
            
            // Check if it's a supported format
            if (!config.image.supportedFormats[metadata.format]) {
                throw new ValidationError(
                    `Unsupported image format: ${metadata.format}. ` +
                    `Supported formats are: ${Object.keys(config.image.supportedFormats).join(', ')}`
                );
            }

            // Check dimensions
            if (metadata.width > config.image.maxWidth || metadata.height > config.image.maxHeight) {
                throw new ValidationError(
                    `Image dimensions exceed maximum allowed size. ` +
                    `Max dimensions: ${config.image.maxWidth}x${config.image.maxHeight}`
                );
            }

            // Check for potential malicious content
            if (metadata.width === 0 || metadata.height === 0) {
                throw new ValidationError('Invalid image dimensions');
            }

            // Check if the file is actually an image by attempting to process it
            await sharp(buffer)
                .resize(1, 1) // Try to resize to 1x1 to verify it's processable
                .toBuffer();

            return metadata;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new ValidationError('Invalid or corrupted image file');
        }
    }

    static getSupportedFormats() {
        return Object.keys(config.image.supportedFormats);
    }
}

module.exports = ImageValidator; 