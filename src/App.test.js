import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra el titulo del juego', () => {
  render(<App />);
  expect(screen.getByText('Ajolote Tycoon')).toBeInTheDocument();
});
