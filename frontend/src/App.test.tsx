import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Clearbook header', () => {
  render(<App />);
  const headingElement = screen.getByText(/Clearbook - Personal Health Records/i);
  expect(headingElement).toBeInTheDocument();
});
