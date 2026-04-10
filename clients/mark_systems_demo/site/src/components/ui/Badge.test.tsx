import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Stable</Badge>);
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Badge>d</Badge>);
    expect(screen.getByText('d').className).toContain('border');
  });

  it('applies success variant', () => {
    render(<Badge variant="success">ok</Badge>);
    expect(screen.getByText('ok').className).toContain('success');
  });

  it('applies error variant', () => {
    render(<Badge variant="error">fail</Badge>);
    expect(screen.getByText('fail').className).toContain('error');
  });

  it('all variants render without crashing', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info', 'outline'] as const;
    for (const v of variants) {
      const { unmount } = render(<Badge variant={v}>v</Badge>);
      expect(screen.getByText('v')).toBeInTheDocument();
      unmount();
    }
  });

  it('merges custom className', () => {
    render(<Badge className="custom-badge">c</Badge>);
    expect(screen.getByText('c').className).toContain('custom-badge');
  });
});
