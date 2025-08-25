import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
jest.mock('axios');

test('renderiza o header com links principais', () => {
  render(<App />);
  expect(screen.getByText(/Catálogo/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Produtos/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
});
