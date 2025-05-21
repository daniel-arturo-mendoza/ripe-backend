module.exports = {
    provider: {
        type: process.env.PROVIDER_TYPE || 'openai',
        config: {
            openai: {
                apiKey: process.env.OPENAI_API_KEY,
                baseUrl: process.env.OPENAI_API_BASE_URL,
                model: process.env.OPENAI_MODEL || 'dall-e-3',
                defaultSize: process.env.OPENAI_DEFAULT_SIZE || '1024x1024'
            }
        }
    },
    cors: {
        allowedOrigins: [process.env.CORS_ALLOWED_ORIGIN || '*']
    },
    // Common settings
    defaults: {
        maxRetries: process.env.MAX_RETRIES || 3,
        timeout: process.env.REQUEST_TIMEOUT || 30000,
        maxConcurrent: process.env.MAX_CONCURRENT || 5
    }
}; 