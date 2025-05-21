const sharp = require('sharp');
const config = require('../config');
const { ProcessingError } = require('../utils/errors');

class ImageProcessor {
    static async processImage(buffer, options = {}) {
        const {
            width = config.image.defaultWidth,
            height = config.image.defaultHeight,
            fit = 'inside'
        } = options;

        try {
            const processedImage = await sharp(buffer)
                .resize(width, height, { fit })
                .toBuffer();

            return processedImage;
        } catch (error) {
            throw new ProcessingError(`Failed to process image: ${error.message}`);
        }
    }

    static async getImageMetadata(buffer) {
        try {
            return await sharp(buffer).metadata();
        } catch (error) {
            throw new ProcessingError(`Failed to get image metadata: ${error.message}`);
        }
    }
}

module.exports = ImageProcessor; 