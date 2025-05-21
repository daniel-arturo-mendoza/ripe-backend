const axios = require('axios');
const BaseProvider = require('./baseProvider');
const { ProviderError } = require('../../utils/errors');

class OpenAIProvider extends BaseProvider {
    constructor(config) {
        super(config);
        this.validateConfig();
        this.client = axios.create({
            baseURL: this.config.baseUrl || 'https://api.openai.com/v1',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    validateConfig() {
        if (!this.config.apiKey) {
            throw new ProviderError('OpenAI API key is required');
        }
    }

    async processRequest(data) {
        try {
            const response = await this.client.post('/images/generations', {
                prompt: data.prompt,
                n: data.n || 1,
                size: data.size || '1024x1024',
                response_format: data.responseFormat || 'url'
            });

            return {
                provider: 'openai',
                data: response.data,
                metadata: {
                    model: 'dall-e-3',
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            throw new ProviderError(`OpenAI API error: ${error.message}`);
        }
    }
}

module.exports = OpenAIProvider; 