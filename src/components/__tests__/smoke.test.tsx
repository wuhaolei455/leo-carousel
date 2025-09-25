import React from 'react';
import { render } from '@testing-library/react';
import { Carousel } from '../Carousel';

describe('Carousel', () => {
  it('renders without crashing', () => {
    const images = [
      'https://via.placeholder.com/800x400/ff0000/ffffff',
      'https://via.placeholder.com/800x400/00ff00/ffffff',
      'https://via.placeholder.com/800x400/0000ff/ffffff',
    ];
    const { container } = render(<Carousel images={images} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
