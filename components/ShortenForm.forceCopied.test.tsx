/**
 * Force the internal state of ShortenForm to the 'result present' and
 * 'copied' = true branch by mocking React.useState at module load time.
 * This is brittle but allowed for test-only coverage enforcement.
 */
// Test-only mocking; keep types strict where possible.

// Mock React's useState before importing the component so the module sees
// the mocked implementation at initialization.
let call = 0;
jest.mock('react', () => {
  const React = jest.requireActual('react') as unknown as typeof import('react');
  return {
    ...React,
    useState: (initial: unknown) => {
      call++;
      // Sequence of useState calls inside ShortenForm:
      // 1: url -> ''
      // 2: isLoading -> false
      // 3: error -> null
      // 4: result -> { shortUrl, originalUrl }
      // 5: copied -> true
      switch (call) {
        case 1:
          return ['', jest.fn()];
        case 2:
          return [false, jest.fn()];
        case 3:
          return [null, jest.fn()];
        case 4:
          return [{ shortUrl: 'http://localhost/abc', originalUrl: 'https://example.com' }, jest.fn()];
        case 5:
          return [true, jest.fn()];
        default:
          return [initial, jest.fn()];
      }
    },
  };
});

import React from 'react';
import { render } from '@testing-library/react';
import { ShortenForm } from './ShortenForm';

describe('ShortenForm forced copied branch', () => {
  it('renders the check icon when copied state is true', () => {
    const { container } = render(<ShortenForm />);

    const btn = container.querySelector('button[title="Copy to clipboard"]');
    expect(btn).toBeTruthy();

    const svg = btn?.querySelector('svg');
    expect(svg).toBeTruthy();
    // lucide may render 'lucide-check' or add a green class; accept either
    expect(svg?.getAttribute('class')).toMatch(/(lucide-check|text-green-500)/);
  });
});
