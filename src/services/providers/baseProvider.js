class BaseProvider {
    constructor(config) {
        this.config = config;
    }

    async processRequest(data) {
        throw new Error('processRequest method must be implemented by provider');
    }

    validateConfig() {
        throw new Error('validateConfig method must be implemented by provider');
    }
}

module.exports = BaseProvider; 