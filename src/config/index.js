const config = {
    downstream: {
        url: process.env.DOWNSTREAM_SERVICE_URL || 'http://localhost:3000/mock-downstream',
        apiKey: process.env.DOWNSTREAM_SERVICE_API_KEY || 'test-key'
    },
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
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*']
    }
};

module.exports = config; 