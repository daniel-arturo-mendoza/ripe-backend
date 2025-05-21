const ProviderFactory = require('./providers/providerFactory');
const { DownstreamError } = require('../utils/errors');

class DownstreamService {
    constructor(config) {
        this.config = config;
        this.provider = ProviderFactory.createProvider(
            config.provider.type,
            config.provider.config
        );
    }

    async sendProcessedImage(data) {
        try {
            const result = await this.provider.processRequest(data);
            return {
                success: true,
                provider: result.provider,
                data: result.data,
                metadata: {
                    ...result.metadata,
                    processedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            throw new DownstreamError(`Provider error: ${error.message}`);
        }
    }
}

module.exports = DownstreamService; 