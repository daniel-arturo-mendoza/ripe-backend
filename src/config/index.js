// Configuration for downstream service, image processing, and CORS settings
const config = {
    // Settings for the downstream service, such as URL and API key
    downstream: {
        url: process.env.DOWNSTREAM_SERVICE_URL || 'http://localhost:3000/mock-downstream',
        apiKey: process.env.DOWNSTREAM_SERVICE_API_KEY || 'test-key'
    },
    // Settings for image processing, including size limits and supported formats
    image: {
        maxSize: 512 * 1024, // 512KB
        maxWidth: 4096,
        maxHeight: 4096,
        defaultWidth: 800,
        defaultHeight: 600,
        supportedFormats: {
            'jpeg': 'image/jpeg',
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'gif': 'image/gif'
        }
    },
    // CORS settings to control which origins are allowed to access the API
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*']
    }
};

module.exports = config; 