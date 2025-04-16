import React from 'react';
import { render, screen } from '@testing-library/react';
import MemoView from './MemoView';

describe('MemoView', () => {
  it('renders memo content or fallback', () => {
    render(<MemoView />);
    expect(screen.getByText(/memo/i)).toBeTruthy();
  });
});
