import express, { RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateShortCode, saveUrl, getOriginalUrl } from './urlShortener.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1) JSON bodies
app.use(express.json());

// 2) Collapse ///foo//bar → /foo/bar
app.use((req, _res, next) => {
  req.url = req.url.replace(/\/+/g, '/');
  next();
});

// 3) CORS
if (process.env.NODE_ENV === 'production') {
  // lock down to your real frontend in prod
  app.use(cors({ origin: 'http://url-shortener-frontend-us-west-2.s3-website-us-west-2.amazonaws.com' }));
} else {
  // wide open for local dev
  app.use(cors());        // <— this alone enables ALL origins + methods + headers
}

// ——— Handlers ———

// health check
const healthCheckHandler: RequestHandler = (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
};

// POST /api/shorten
interface ShortenBody { url?: string }
const shortenUrlHandler: RequestHandler<{},{},ShortenBody> = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;                     // <-- void
    }

    const shortCode = generateShortCode();
    await saveUrl(shortCode, url);

    const baseUrl = (process.env.API_BASE_URL ?? `http://localhost:${PORT}`)
      .replace(/\/$/, '');
    const shortUrl = `${baseUrl}/${shortCode}`;

    res.status(200).json({ shortUrl });
  } catch (err) {
    console.error('Error shortening URL:', err);
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
};

// GET /:shortCode
const redirectHandler: RequestHandler<{ shortCode: string }> = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const originalUrl = await getOriginalUrl(shortCode);

    if (!originalUrl) {
      res.status(404).json({ error: 'URL not found' });
      return;                   // <-- void
    }

    res.redirect(originalUrl);
  } catch (err) {
    console.error('Error redirecting:', err);
    res.status(500).json({ error: 'Failed to redirect' });
  }
};

// ——— Routes ———
app.get('/health', healthCheckHandler);
app.post('/api/shorten', shortenUrlHandler);
app.get('/:shortCode', redirectHandler);

// ——— Start ———
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
