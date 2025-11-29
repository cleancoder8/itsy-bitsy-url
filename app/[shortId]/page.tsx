import { getUrlMapping } from '@/lib/kv';
import { redirect, notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ shortId: string }>;
}

export default async function ShortIdPage({ params }: PageProps) {
  const { shortId } = await params;

  // Fetch the mapping from KV
  const mapping = await getUrlMapping(shortId);

  if (mapping) {
    // Redirect to the original URL
    // 307 Temporary Redirect is usually best for shorteners so analytics work
    // and browsers don't cache the redirect permanently if you want to change it later.
    // Next.js redirect() defaults to 307 in Server Actions/Route Handlers,
    // but 307 is also good here.
    redirect(mapping.url);
  }

  // If no mapping found, show 404
  notFound();
}
