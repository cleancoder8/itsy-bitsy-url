/**
 * @jest-environment node
 */
// Mock the next/font/google module so the font functions return predictable
// variable strings that the layout uses.
jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders children and includes font variables on body', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <div>hello world</div>
      </RootLayout>
    );

    expect(html).toContain('hello world');
    // font variables should be present in the body class string
    expect(html).toContain('--font-geist-sans');
    expect(html).toContain('--font-geist-mono');
  });
});
