import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  test('renders with children text', () => {
    render(<Button>Click Here</Button>);
    
    // Check if a button with the text "Click Here" is in the document
    const buttonElement = screen.getByText(/Click Here/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('applies the correct base classes', () => {
    const { container } = render(<Button>Test</Button>);
    const button = container.firstChild;
    
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
  });

  test('applies variant classes correctly', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.firstChild;
    
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });
});
