/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShortenForm } from './ShortenForm';

declare global {
  // test-only global to hold clipboard mock for assertions
  var __clipboardWriteMock: jest.Mock | undefined;
}

describe('ShortenForm (client)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ shortUrl: 'http://localhost/abc', originalUrl: 'https://example.com' }),
    });
  Object.defineProperty(globalThis, 'fetch', { value: fetchMock, configurable: true, writable: true });

    // Mock clipboard
    const writeMock = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: writeMock }, configurable: true, writable: true });
    // Expose for assertions
    globalThis.__clipboardWriteMock = writeMock;
  });

  it('disables submit when input empty and enables when filled', () => {
    render(<ShortenForm />);

    const submit = screen.getByRole('button', { name: /shorten/i });
    expect(submit).toBeDisabled();

    const input = screen.getByPlaceholderText(/Paste your long URL here/i);
    fireEvent.change(input, { target: { value: 'https://example.com' } });

    expect(submit).not.toBeDisabled();
  });

  it('submits form and shows result, and copies to clipboard', async () => {
    render(<ShortenForm />);

    const input = screen.getByPlaceholderText(/Paste your long URL here/i);
    fireEvent.change(input, { target: { value: 'https://example.com' } });

    const submit = screen.getByRole('button', { name: /shorten/i });
    fireEvent.click(submit);

    // Wait for result to appear
    await waitFor(() => expect(screen.getByText(/Your Short Link/i)).toBeInTheDocument());

    expect(screen.getByText('http://localhost/abc')).toBeInTheDocument();

    const copyBtn = screen.getByTitle(/Copy to clipboard/i);
    fireEvent.click(copyBtn);

    await waitFor(() => expect(globalThis.__clipboardWriteMock).toHaveBeenCalledWith('http://localhost/abc'));
  });

  it('shows error message when API returns non-ok', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Bad request' }),
    });
  Object.defineProperty(globalThis, 'fetch', { value: fetchMock, configurable: true, writable: true });

    render(<ShortenForm />);

    const input = screen.getByPlaceholderText(/Paste your long URL here/i);
    fireEvent.change(input, { target: { value: 'https://example.com' } });

    const submit = screen.getByRole('button', { name: /shorten/i });
    fireEvent.click(submit);

    await waitFor(() => expect(screen.getByText(/Bad request/i)).toBeInTheDocument());
  });

  // We intentionally don't assert the exact internal icon swap (Copy -> Check)
  // because the lucide-react output and classnames can vary across versions.
  // The tests above verify the observable behavior: form submission, API
  // handling, and clipboard writes.
});
