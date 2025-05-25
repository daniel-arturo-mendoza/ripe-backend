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

class ImageValidator {
    static async validateImage(buffer) {
        try {
            // Check if buffer exists and has content
            if (!buffer || buffer.length === 0) {
                throw new ValidationError('Empty image buffer provided');
            }

            // Check file size
            if (buffer.length > config.image.maxSize) {
                throw new ValidationError(
                    `Image size exceeds the maximum allowed size of ${config.image.maxSize / 1024}KB. ` +
                    `Current size: ${(buffer.length / 1024).toFixed(2)}KB`
                );
            }

            // Basic metadata without processing
            const metadata = {
                size: buffer.length,
                // Note: We can't validate format or dimensions without processing
                // These would need to be provided by the client if needed
                format: null,
                width: null,
                height: null
            };

            return metadata;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new ValidationError('Invalid or corrupted image file');
        }
    }

    static getSupportedFormats() {
        return Object.keys(ALLOWED_FORMATS);
    }
}

module.exports = ImageValidator; 