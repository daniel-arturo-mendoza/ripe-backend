const OpenAIProvider = require('./openAIProvider');
const { ProviderError } = require('../../utils/errors');

class ProviderFactory {
    static createProvider(providerType, config) {
        switch (providerType.toLowerCase()) {
            case 'openai':
                return new OpenAIProvider(config);
            // Add more providers here as needed
            default:
                throw new ProviderError(`Unsupported provider type: ${providerType}`);
        }
    }
}

module.exports = ProviderFactory; 