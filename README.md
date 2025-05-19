# Ripe Backend

A serverless backend service for image processing using AWS Lambda and the Sharp library.

## Prerequisites

- Node.js 18.x or later
- AWS SAM CLI
- Docker Desktop
- AWS CLI (optional, for deployment)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local API:
   ```bash
   sam local start-api
   ```

3. Test the API:
   ```bash
   curl -X POST http://localhost:3000/process-image -H "Content-Type: application/json" -d @test-event.json
   ```

## Project Structure

- `index.js` - Main Lambda function handler
- `template.yaml` - AWS SAM template
- `test-event.json` - Sample test event for local testing

## Development

The project uses AWS SAM for local development and testing. The main endpoint is `/process-image` which accepts POST requests with image data.

## License

MIT 