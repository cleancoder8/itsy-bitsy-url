# Itsy Bitsy URL Shortener

A production-ready URL shortener built with Next.js, TypeScript, **Vercel Blob**, and Tailwind CSS.

## Features

- **Short ID Generation**: Uses UUID v4 -> Base64 -> Trimmed to 10 chars for secure, collision-resistant IDs.
- **Data Storage**: Powered by **Vercel Blob** (Object Storage).
- **Modern Design**: Clean, minimal aesthetic inspired by Anthropic.
- **Performance**: Built on Next.js App Router.

## Getting Started

### Prerequisites

- Node.js 18+
- A Vercel account

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Local Development Setup

To run this app locally, you need to connect it to a Vercel Blob store.

1. **Create a Vercel Project**:
   - Go to your Vercel Dashboard.
   - Create a new project or use an existing one.

2. **Create a Blob Store**:
   - In your Vercel project, go to the "Storage" tab.
   - Click "Create Database" and select **Blob**.
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
   - This will download `BLOB_READ_WRITE_TOKEN` to `.env.local`.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

1. Push your code to the GitHub repository.
2. Import the repository in Vercel.
3. Ensure the Blob store is connected to the project in Vercel.
4. Vercel will automatically deploy the app.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `lib/`: Utility functions.
  - `shortId.ts`: ID generation logic.
  - `kv.ts`: Vercel Blob client and helpers (Note: named `kv.ts` for legacy reasons, but uses Blob).
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
