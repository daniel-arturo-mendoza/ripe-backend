# Ripe Backend

A serverless backend service for image handling using AWS Lambda.

## Features

- Image validation and size checking
- Integration with downstream services
- CORS support
- Error handling and logging

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

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Deploy to AWS:
   ```bash
   sam deploy --guided
   ```

## API Endpoints

### POST /process-image
Processes and validates an image.

Request body:
```json
{
    "image": "base64-encoded-image-data",
    "metadata": {
        "format": "jpeg",
        "dimensions": {
            "width": 800,
            "height": 600
        }
    }
}
```

## Project Structure

- `index.js` - Main Lambda function handler
- `template.yaml` - AWS SAM template
- `test-event.json` - Sample test event for local testing

## Development

Run tests:
```bash
npm test
```

## License

MIT 