"use client";

import { useState } from "react";
import { Copy, ArrowRight, Loader2, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    shortUrl: string;
    originalUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
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
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                : "border-gray-200"
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

            {/* QR Code section */}
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Use a public QR image generator to avoid extra dependencies. */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  result.shortUrl
                )}`}
                alt="QR code"
                className="w-40 h-40 bg-white border rounded-md"
              />

              <div className="flex flex-col gap-2">
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                    result.shortUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Open QR (larger)
                </a>
                <div className="flex flex-row items-center gap-2">
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                            result.shortUrl
                          )}`
                        );
                        setQrCopied(true);
                        setTimeout(() => setQrCopied(false), 2000);
                      } catch {
                        // ignore clipboard failures
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
                  >
                    {qrCopied ? "Link copied" : "Copy QR link"}
                  </button>

                  <button
                    onClick={async () => {
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                        result.shortUrl
                      )}`;
                      try {
                        const res = await fetch(qrUrl);
                        if (!res.ok) {
                          throw new Error(`Failed to fetch QR: ${res.status}`);
                        }
                        const blob = await res.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = objectUrl;
                        // include a short file name using the short URL
                        const fileName = `itsybitsy-qr.png`;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        // revoke after a short delay to ensure download started
                        setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
                      } catch {
                        // If fetch/download fails, we silently ignore. The user said they'll handle CORS.
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                  >
                    Download QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
