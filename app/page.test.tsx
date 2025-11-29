/**
 * @jest-environment node
 */
import { renderToStaticMarkup } from 'react-dom/server';
import Home from './page';

describe('Home page', () => {
  it('renders expected content and current year in footer', () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('ItsyBitsy');
    expect(html).toContain('Shorten your links');
    // Footer has current year
    expect(html).toContain(new Date().getFullYear().toString());
  });
});
