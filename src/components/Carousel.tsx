import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CarouselProps } from '../types';
import './Carousel.css';

const Carousel: React.FC<CarouselProps> = ({
  images,
  style,
  className,
  autoplay = true,
  autoplayInterval = 3000,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);

  const imageCount = images.length;

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!autoplay || imageCount <= 1) {
      stopAutoplay();
      return;
    }

    stopAutoplay();
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        if (imageCount === 0) return 0;
        return (prev + 1) % imageCount;
      });
    }, autoplayInterval);
  }, [autoplay, autoplayInterval, imageCount, stopAutoplay]);

  const goToNext = useCallback(() => {
    if (imageCount === 0) return;
    setCurrentIndex(prev => (prev + 1) % imageCount);
  }, [imageCount]);

  const goToPrev = useCallback(() => {
    if (imageCount === 0) return;
    setCurrentIndex(prev => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  const goToSlide = useCallback(
    (index: number) => {
      if (imageCount === 0) return;
      const clampedIndex = Math.min(Math.max(index, 0), imageCount - 1);
      setCurrentIndex(clampedIndex);
    },
    [imageCount]
  );

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (imageCount === 0) {
      setCurrentIndex(0);
      stopAutoplay();
    } else {
      setCurrentIndex(prev => Math.min(prev, imageCount - 1));
    }
  }, [imageCount, stopAutoplay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    stopAutoplay();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    startAutoplay();
  };

  const wrapperWidth = imageCount === 0 ? 100 : imageCount * 100;
  const slideWidth = imageCount === 0 ? 100 : 100 / imageCount;
  const offset = imageCount === 0 ? 0 : (currentIndex * 100) / imageCount;

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
          transform: `translateX(-${offset}%)`,
          transition: 'transform 0.5s ease',
          width: `${wrapperWidth}%`,
        }}
      >
        {images.map((image, index) => (
          <div className="carousel-slide" key={index} style={{ width: `${slideWidth}%` }}>
            <img src={image} alt={`slide ${index}`}
              className="carousel-image"
            />
          </div>
        ))}
      </div>
      {showIndicators && imageCount > 0 && (
        <div className="carousel-indicators">
          {images.map((_: string, index: number) => (
            <div
              key={index}
              className={`indicator ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
