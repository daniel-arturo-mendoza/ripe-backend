const axios = require('axios');
const BaseProvider = require('./baseProvider');
const { ProviderError } = require('../../utils/errors');

class OpenAIProvider extends BaseProvider {
    constructor(config) {
        super(config);
        this.validateConfig();
        this.client = axios.create({
            baseURL: this.config.openai.baseUrl || 'https://api.openai.com/v1',
            headers: {
                'Authorization': `Bearer ${this.config.openai.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    validateConfig() {
        if (!this.config.openai?.apiKey) {
            throw new ProviderError('OpenAI API key is required');
        }
    }

    async processRequest(data) {
        if (data.image) {
            return this.analyzeImage(data);
        } else {
            return this.generateTextCompletion(data);
        }
    }

    async analyzeImage(data) {
        try {
            const response = await this.client.post('/chat/completions', {
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'system',
                        content: data.systemPrompt || 'You are an expert in fruit quality assessment.'
                    },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: data.prompt || 'Please analyze this image of a fruit and evaluate its ripeness level.' },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${data.image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 500
            });

            return {
                provider: 'openai',
                data: response.data.choices[0].message.content,
                metadata: {
                    model: 'gpt-4-vision-preview',
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('OpenAI API error:', error.response?.data || error.message);
            throw new ProviderError(`OpenAI API error: ${error.message}`);
        }
    }

    async generateTextCompletion(data) {
        try {
            const response = await this.client.post('/chat/completions', {
                model: data.model || this.config.model || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: data.systemPrompt || 'You are a helpful assistant.' },
                    { role: 'user', content: data.prompt }
                ],
                max_tokens: data.maxTokens || 256,
                temperature: data.temperature || 0.7
            });

            return {
                provider: 'openai',
                data: response.data.choices[0].message.content,
                metadata: {
                    model: data.model || this.config.model || 'gpt-3.5-turbo',
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            throw new ProviderError(`OpenAI API error: ${error.message}`);
        }
    }
}

module.exports = OpenAIProvider; 