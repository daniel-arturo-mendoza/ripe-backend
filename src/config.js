const AWS = require('aws-sdk');
// Lambda automatically provides AWS_REGION environment variable
const ssm = new AWS.SSM();

async function getOpenAIKey() {
    try {
        console.log('Attempting to get parameter from SSM...');
        const parameter = await ssm.getParameter({
            Name: '/ripe-backend/openai-key',
            WithDecryption: true
        }).promise();
        console.log('Successfully retrieved parameter from SSM');
        console.log('Parameter details:', {
            name: parameter.Parameter.Name,
            type: parameter.Parameter.Type,
            lastModified: parameter.Parameter.LastModifiedDate,
            valueLength: parameter.Parameter.Value ? parameter.Parameter.Value.length : 0,
            value: parameter.Parameter.Value ? '***' : null
        });
        return parameter.Parameter.Value;
    } catch (error) {
        console.error('Error fetching OpenAI API key:', {
            message: error.message,
            code: error.code,
            requestId: error.requestId,
            statusCode: error.statusCode,
            region: AWS.config.region,
            stack: error.stack
        });
        throw error;
    }
}

async function getConfig() {
    const apiKey = await getOpenAIKey();
    return {
        provider: {
            type: process.env.PROVIDER_TYPE || 'openai',
            config: {
                openai: {
                    apiKey,
                    baseUrl: process.env.OPENAI_API_BASE_URL,
                    model: process.env.OPENAI_MODEL || 'gpt-4-vision-preview',
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
        },
        // Basic validation settings
        validation: {
            maxFileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB in bytes
            allowedMimeTypes: [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/gif'
            ]
        }
    };
}

module.exports = getConfig; 