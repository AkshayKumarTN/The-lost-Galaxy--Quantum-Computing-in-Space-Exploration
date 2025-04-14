// Tutorial.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Tutorial from './Tutorial';

describe('Tutorial Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Tutorial />
      </MemoryRouter>
    );
  });

  test('renders the first slide initially', () => {
    expect(screen.getByText(/Introduction to Quantum Computing/i)).toBeInTheDocument();
  });

  test('next button navigates to second slide', () => {
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    expect(screen.getByText(/Qubits, Superposition, and Measurement/i)).toBeInTheDocument();
  });

  test('previous button goes back to first slide', () => {
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    const prevButton = screen.getByText(/Previous/i);
    fireEvent.click(prevButton);
    expect(screen.getByText(/Introduction to Quantum Computing/i)).toBeInTheDocument();
  });

  test('next button is disabled on last slide', () => {
    const nextButton = screen.getByText(/Next/i);
    // 點擊直到最後一張
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText(/Applications and Future of Quantum Computing/i)).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });

  test('previous button is disabled on first slide', () => {
    const prevButton = screen.getByText(/Previous/i);
    expect(prevButton).toBeDisabled();
  });
});
