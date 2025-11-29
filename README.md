# Itsy Bitsy URL Shortener

A production-ready URL shortener built with Next.js, TypeScript, Vercel KV, and Tailwind CSS.

## Features

- **Short ID Generation**: Uses UUID v4 -> Base64 -> Trimmed to 10 chars for secure, collision-resistant IDs.
- **Data Storage**: Powered by Vercel KV (Redis) for fast lookups.
- **Modern Design**: Clean, minimal aesthetic inspired by Anthropic.
- **Performance**: Built on Next.js App Router for optimal performance.

## Getting Started

### Prerequisites

- Node.js 18+
- A Vercel account (for KV storage)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Local Development Setup

To run this app locally, you need to connect it to a Vercel KV instance.

1. **Create a Vercel Project**:
   - Go to your Vercel Dashboard.
   - Create a new project or use an existing one.

2. **Create a KV Database**:
   - In your Vercel project, go to the "Storage" tab.
   - Click "Create Database" and select "KV".
   - Follow the prompts to create it.

3. **Link Local Project**:
   - Install Vercel CLI: `npm i -g vercel`
   - Link your project:
     ```bash
     vercel link
     ```
   - Pull environment variables:
     ```bash
     vercel env pull .env.local
     ```
   - This will download `KV_REST_API_URL` and `KV_REST_API_TOKEN` to `.env.local`.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

1. Push your code to the GitHub repository.
2. Import the repository in Vercel.
3. Ensure the KV database is connected to the project in Vercel (it should be if you created it in the dashboard).
4. Vercel will automatically deploy the app.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
  - `page.tsx`: Landing page.
  - `[shortId]/page.tsx`: Redirect logic.
  - `api/shorten/route.ts`: API endpoint to create short URLs.
- `lib/`: Utility functions.
  - `shortId.ts`: ID generation logic.
  - `kv.ts`: Vercel KV client and helpers.
- `components/`: React components.

## API

### POST /api/shorten

Request body:
```json
{
  "url": "https://example.com/very/long/url"
}
```

Response:
```json
{
  "shortId": "abc123xyz",
  "shortUrl": "https://your-domain.com/abc123xyz",
  "originalUrl": "https://example.com/very/long/url"
}
```
