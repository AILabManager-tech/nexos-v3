import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="primary">P</Button>);
    expect(screen.getByRole('button').className).toContain('bg-[var(--color-primary)]');

    rerender(<Button variant="outline">O</Button>);
    expect(screen.getByRole('button').className).toContain('border');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Button size="sm">sm</Button>);
    expect(screen.getByRole('button').className).toContain('text-xs');

    rerender(<Button size="lg">lg</Button>);
    expect(screen.getByRole('button').className).toContain('text-base');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>go</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('respects disabled state', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        disabled
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>r</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(<Button className="extra-class">c</Button>);
    expect(screen.getByRole('button').className).toContain('extra-class');
  });
});
