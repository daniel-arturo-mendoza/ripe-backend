const sharp = require('sharp');
const axios = require('axios');

exports.handler = async (event) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));
        
        // Parse the incoming event
        const body = JSON.parse(event.body);
        const { image, metadata } = body;

        if (!image) {
            throw new Error('No image provided in the request');
        }

        console.log('Processing image...');
        // Convert base64 image to buffer
        const imageBuffer = Buffer.from(image, 'base64');

        // Process image with sharp
        const processedImage = await sharp(imageBuffer)
            .resize(800, 600, { fit: 'inside' }) // Example processing
            .toBuffer();

        console.log('Image processed successfully');

        // Convert processed image back to base64
        const processedImageBase64 = processedImage.toString('base64');

        // Prepare data for downstream service
        const downstreamData = {
            image: processedImageBase64,
            metadata: {
                ...metadata,
                processedAt: new Date().toISOString(),
                originalSize: imageBuffer.length,
                processedSize: processedImage.length
            }
        };

        console.log('Sending to downstream service...');
        // Send to downstream service (replace with your actual endpoint)
        const downstreamResponse = await axios.post(
            process.env.DOWNSTREAM_SERVICE_URL || 'http://localhost:3000/mock-downstream',
            downstreamData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DOWNSTREAM_SERVICE_API_KEY || 'test-key'}`
                }
            }
        );

        console.log('Downstream service response:', downstreamResponse.data);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Image processed successfully',
                downstreamResponse: downstreamResponse.data
            })
        };

    } catch (error) {
        console.error('Error processing image:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Error processing image',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
}; 