import { useState } from 'react';
import axios from 'axios';

function App() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const raw = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const API_BASE = raw.replace(/\/$/, '');


    const shortenUrl = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url) {
            setError('Please enter a URL');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE}/api/shorten`, { url });
            setShortUrl(response.data.shortUrl);
        } catch (err) {
            setError('Failed to shorten URL');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="flex min-h-screen bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold mb-8 text-center">URL Shortener</h1>

              <form onSubmit={shortenUrl} className="w-full max-w-md">
                  <div className="mb-4">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL to shorten"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                      {isLoading ? 'Shortening...' : 'Shorten URL'}
                  </button>
              </form>

              {error && <p className="mt-4 text-red-400">{error}</p>}

              {shortUrl && (
                <div className="mt-8 p-6 bg-gray-800 rounded-lg w-full max-w-md">
                    <p className="text-lg mb-2">Your shortened URL:</p>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                        {shortUrl}
                    </a>
                    <button
                      onClick={() => {
                          navigator.clipboard.writeText(shortUrl);
                          alert('Copied to clipboard!');
                      }}
                      className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Copy
                    </button>
                </div>
              )}
          </div>
      </div>
    );
}

export default App;