/**
 * @jest-environment node
 */
// Register mocks before importing the page so the module uses them
jest.mock('@/lib/kv');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

import ShortIdPage from './page';
import { getUrlMapping } from '@/lib/kv';
import { redirect, notFound } from 'next/navigation';

describe('app/[shortId]/page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // In Next.js runtime `redirect()` throws to interrupt execution. Mock that
    // behavior so the server component doesn't continue to call `notFound()`.
    (redirect as jest.Mock).mockImplementation(() => {
      throw new Error('redirect');
    });
  });

  it('redirects when mapping exists', async () => {
    (getUrlMapping as jest.Mock).mockResolvedValue({ url: 'https://example.com' });

    type PageProps = { params: Promise<{ shortId: string }> };
    const props: PageProps = { params: Promise.resolve({ shortId: 'abc' }) };

    try {
      await ShortIdPage(props);
    } catch {
      // redirect() throws to interrupt execution in Next.js runtime; ignore here
    }

    expect(redirect).toHaveBeenCalledWith('https://example.com');
    expect(notFound).not.toHaveBeenCalled();
  });

  it('calls notFound when no mapping', async () => {
    (getUrlMapping as jest.Mock).mockResolvedValue(null);

    const props: { params: Promise<{ shortId: string }> } = { params: Promise.resolve({ shortId: 'not-exists' }) };

    await ShortIdPage(props);

    expect(notFound).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
