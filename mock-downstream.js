const express = require('express');
const app = express();
const port = 3001;

app.use(express.json({ limit: '50mb' }));

app.post('/mock-downstream', (req, res) => {
    console.log('Received request at mock downstream service');
    console.log('Request body:', {
        ...req.body,
        image: req.body.image ? 'base64 image data...' : undefined
    });
    
    res.json({
        status: 'success',
        message: 'Image received by downstream service',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`Mock downstream service listening at http://localhost:${port}`);
}); 