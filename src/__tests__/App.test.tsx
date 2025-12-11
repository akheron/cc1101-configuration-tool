import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { App } from '../App';

describe('App', () => {
  test('renders shell and controls', async () => {
    render(<App />);

    await screen.findByRole('heading', { name: 'CC1101 Configuration Tool' });
    expect(screen.getByLabelText('Search registers')).toBeInTheDocument();
    expect(screen.getByLabelText('Crystal Frequency (MHz)')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Import' })).toBeInTheDocument();
  });

  test('editing channel number updates summary', async () => {
    const { container } = render(<App />);

    const channelInput = await waitFor(
      () =>
        container.querySelector<HTMLInputElement>('input[data-type="register-hex"][data-addr="10"]'),
      { timeout: 2000 }
    );
    expect(channelInput).not.toBeNull();

    fireEvent.change(channelInput!, { target: { value: '0x05' } });

    const channelSummary = await waitFor(
      () => container.querySelector<HTMLElement>('[data-scroll-to="0x09"] strong'),
      { timeout: 2000 }
    );
    expect(channelSummary?.textContent?.trim()).toBe('5');
  });
});

