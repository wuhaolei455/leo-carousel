import React$1 from 'react';

interface CarouselProps {
    images: string[];
    style?: React.CSSProperties;
    className?: string;
    autoplay?: boolean;
    autoplayInterval?: number;
    showIndicators?: boolean;
}

declare const Carousel: React$1.FC<CarouselProps>;

export { Carousel, CarouselProps };
