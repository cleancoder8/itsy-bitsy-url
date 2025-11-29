'use client';

import { useState } from 'react';
import { Copy, ArrowRight, Loader2, Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function ShortenForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ shortUrl: string; originalUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (result?.shortUrl) {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <input
            type="url"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className={twMerge(
              "w-full px-6 py-4 text-lg bg-white border-2 rounded-xl outline-none transition-all duration-200",
              "placeholder:text-gray-400 text-gray-900",
              "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
              error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200"
            )}
          />
          <button
            type="submit"
            disabled={isLoading || !url}
            className={twMerge(
              "absolute right-2 top-2 bottom-2 px-6 rounded-lg font-medium text-white transition-all duration-200",
              "bg-gray-900 hover:bg-gray-800 active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Shorten <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500 ml-2 animate-in slide-in-from-top-1 fade-in">
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm animate-in slide-in-from-top-2 fade-in">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Your Short Link
            </span>
            <div className="flex items-center gap-3">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-medium text-blue-600 hover:underline truncate"
              >
                {result.shortUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500 truncate">
              Original: {result.originalUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
