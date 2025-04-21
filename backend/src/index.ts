import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateShortCode, saveUrl, getOriginalUrl } from './urlShortener.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Handler functions
const healthCheckHandler = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
};

const shortenUrlHandler = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const shortCode = generateShortCode();
    await saveUrl(shortCode, url);

    const shortUrl = `${process.env.API_BASE_URL || `http://localhost:${PORT}`}/${shortCode}`;
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