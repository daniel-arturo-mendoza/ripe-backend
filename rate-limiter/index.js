const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const COOLDOWN_PERIOD = parseInt(process.env.COOLDOWN_PERIOD) || 20; // seconds
const MAX_REQUESTS = parseInt(process.env.MAX_REQUESTS) || 10;
const REQUEST_INTERVAL = parseInt(process.env.REQUEST_INTERVAL) || 5; // seconds

exports.handler = async (event) => {
    const clientIp = event.requestContext.identity.sourceIp;
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    
    try {
        // Get current rate limit state for this IP
        const result = await dynamodb.get({
            TableName: 'RateLimits',
            Key: { clientIp }
        }).promise();
        
        const rateLimit = result.Item || {
            clientIp,
            requestCount: 0,
            lastRequestTime: 0,
            cooldownEndTime: 0
        };
        
        // Check if in cooldown period
        if (now < rateLimit.cooldownEndTime) {
            return generatePolicy('Deny', event.methodArn, {
                message: `Rate limit exceeded. Please wait ${rateLimit.cooldownEndTime - now} seconds.`,
                retryAfter: rateLimit.cooldownEndTime - now
            });
        }
        
        // Check if enough time has passed since last request
        if (now - rateLimit.lastRequestTime < REQUEST_INTERVAL) {
            return generatePolicy('Deny', event.methodArn, {
                message: `Please wait ${REQUEST_INTERVAL - (now - rateLimit.lastRequestTime)} seconds between requests.`,
                retryAfter: REQUEST_INTERVAL - (now - rateLimit.lastRequestTime)
            });
        }
        
        // Update rate limit state
        const newRequestCount = rateLimit.requestCount + 1;
        const needsCooldown = newRequestCount >= MAX_REQUESTS;
        
        await dynamodb.put({
            TableName: 'RateLimits',
            Item: {
                clientIp,
                requestCount: needsCooldown ? 0 : newRequestCount,
                lastRequestTime: now,
                cooldownEndTime: needsCooldown ? now + COOLDOWN_PERIOD : rateLimit.cooldownEndTime
            }
        }).promise();
        
        return generatePolicy('Allow', event.methodArn);
        
    } catch (error) {
        console.error('Rate limit error:', error);
        return generatePolicy('Deny', event.methodArn, {
            message: 'Internal server error'
        });
    }
};

function generatePolicy(effect, resource, context = {}) {
    return {
        principalId: 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        },
        context
    };
} 