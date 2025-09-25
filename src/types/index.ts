export interface CarouselProps {
  images: string[];
  style?: React.CSSProperties;
  className?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  showIndicators?: boolean;
}
