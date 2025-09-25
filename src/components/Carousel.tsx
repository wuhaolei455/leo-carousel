import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CarouselProps } from '../types';
import './Carousel.less';

const Carousel: React.FC<CarouselProps> = ({
  images,
  style,
  className,
  autoplay = true,
  autoplayInterval = 3000,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);

  const displayImages = images.length > 0 ? [images[images.length - 1], ...images, images[0]] : [];

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;
    stopAutoplay();
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, autoplayInterval);
  }, [autoplay, autoplayInterval]);

  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay]);

  const handleTransitionEnd = () => {
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(images.length);
    } else if (currentIndex === displayImages.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  }, [isTransitioning]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoplay();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // This can be used for swipe-to-slide effect, but for now we keep it simple
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setCurrentIndex(prev => prev - 1);
      }
    }
    startAutoplay();
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index + 1);
  };
  
  const currentRealIndex = (currentIndex - 1 + images.length) % images.length;

  return (
    <div
      className={`carousel-container ${className || ''}`}
      style={style}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="carousel-wrapper"
        style={{
          transform: `translateX(-${currentIndex * 100 / displayImages.length}%)`,
          transition: isTransitioning ? 'transform 0.5s ease' : 'none',
          width: `${displayImages.length * 100}%`
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {displayImages.map((image, index) => (
          <div className="carousel-slide" key={index} style={{ width: `${100 / displayImages.length}%` }}>
            <img src={image} alt={`slide ${index}`} className="carousel-image" />
          </div>
        ))}
      </div>
      {showIndicators && (
        <div className="carousel-indicators">
          {images.map((_: string, index: number) => (
            <div
              key={index}
              className={`indicator ${currentRealIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
