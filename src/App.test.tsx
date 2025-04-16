import React from 'react';
import { render, screen } from '@testing-library/react';
import TeacherForm from './components/TeacherForm';
import MemoView from './components/MemoView';

describe('TeacherForm', () => {
  it('renders without crashing', () => {
    render(<TeacherForm />);
    expect(screen.getByText(/submit for review/i)).toBeInTheDocument();
  });
});

describe('MemoView', () => {
  it('renders without crashing', () => {
    render(<MemoView />);
    // MemoView may require route params; this checks for a fallback string
    expect(screen.getByText(/memo/i)).toBeTruthy();
  });
});
