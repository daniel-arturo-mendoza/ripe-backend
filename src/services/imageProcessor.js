const { ProcessingError } = require('../utils/errors');

class ImageProcessor {
    static async processImage(buffer, options = {}) {
        // Since we're moving image processing to the client side,
        // this function now just validates the buffer
        try {
            // Basic validation: check if buffer exists and has content
            if (!buffer || buffer.length === 0) {
                throw new ProcessingError('Invalid image buffer');
            }

            // Check if buffer size is within reasonable limits (e.g., 5MB)
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB
            if (buffer.length > MAX_SIZE) {
                throw new ProcessingError('Image size exceeds maximum limit of 5MB');
            }

            // Return the original buffer since we're not processing it
            return buffer;
        } catch (error) {
            throw new ProcessingError(`Failed to validate image: ${error.message}`);
        }
    }

    static async getImageMetadata(buffer) {
        try {
            // Basic metadata
            return {
                size: buffer.length,
                // Note: We can't get actual dimensions without processing the image
                // These would need to be provided by the client if needed
                width: null,
                height: null,
                format: null
            };
        } catch (error) {
            throw new ProcessingError(`Failed to get image metadata: ${error.message}`);
        }
    }
}

module.exports = ImageProcessor; 