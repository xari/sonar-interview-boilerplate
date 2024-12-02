import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect, describe, it } from 'vitest';

import App from './App';

describe('the App UI', () => {
  it('does some stuff', () => {
    render(<App />);

    const header = screen.getByRole('heading', {
      textContent: 'App component',
    });

    expect(header).toBeInTheDocument();
  });
});
