import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeacherForm from './TeacherForm';

describe('TeacherForm', () => {
  it('renders all required fields', () => {
    render(<TeacherForm />);
    expect(screen.getByLabelText(/child/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/incident description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/injury description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/action taken/i)).toBeInTheDocument();
  });

  it('shows validation error if required fields are empty and submit is clicked', () => {
    render(<TeacherForm />);
    fireEvent.click(screen.getByText(/submit for review/i));
    // Should show an alert or validation error (simulate alert)
    // This is a placeholder; in practice, use jest.spyOn(window, 'alert')
  });
});
