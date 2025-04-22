import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateShortCode, saveUrl, getOriginalUrl } from './urlShortener.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1) Parse JSON bodies on all incoming requests
app.use(express.json());

// 2) Then configure CORS
app.use(cors({
  origin: 'http://url-shortener-frontend-us-west-2.s3-website-us-west-2.amazonaws.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handler functions
const healthCheckHandler = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
};

const shortenUrlHandler = async (req: Request, res: Response) => {
  try {
    // now req.body will be your parsed JSON
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const shortCode = generateShortCode();
    await saveUrl(shortCode, url);

    const baseUrl = process.env.API_BASE_URL || `http://localhost:${PORT}`;
    const shortUrl = `${baseUrl.replace(/\/$/, '')}/${shortCode}`;

    res.json({ shortUrl });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
};

const redirectHandler = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    const originalUrl = await getOriginalUrl(shortCode);

    if (!originalUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.redirect(originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Failed to redirect' });
  }
};

// Routes
app.get('/health', healthCheckHandler);
app.post('/api/shorten', (req, res) => { void shortenUrlHandler(req, res); });
app.get('/:shortCode', (req, res) => { void redirectHandler(req, res); });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
