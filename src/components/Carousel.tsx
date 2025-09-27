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
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);

  const displayImages = images.length > 0 ? [...images, images[0]] : [];
  const imageCount = images.length;
  const slidePercent = 100 / (displayImages.length || 1);
  const currentRealIndex = currentIndex === imageCount ? 0 : currentIndex;

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
      goToNext()
    }, autoplayInterval);
  }, [autoplay, autoplayInterval, imageCount, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const goToNext = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev + 1) % (imageCount + 1));
  }

  const goToPrev = () => {
    setIsTransitioning(true);
    if (currentIndex === 0) {
      setCurrentIndex(Math.max(imageCount - 1, 0));
    } else {
      setCurrentIndex(prev => (prev - 1 + imageCount + 1) % (imageCount + 1));
    }
  }

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
    stopAutoplay();
    setTimeout(() => {
      startAutoplay()
    }, 1000);
  }

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

    setTimeout(() => {
      startAutoplay();
    }, 1000);
  };

  const handleTransitionEnd = () => {
    if (imageCount > 0 && currentIndex === imageCount) {
      setIsTransitioning(false);
      setCurrentIndex(0);
      setTimeout(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      }, 0);
    }
  };

  return (imageCount > 0 &&
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
          transform: `translateX(-${currentIndex * slidePercent}%)`,
          transition: isTransitioning ? 'transform 0.3s ease' : 'none',
          width: `${displayImages.length * 100}%`, 
          willChange: 'transform'
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {displayImages.map((image, index) => (
          <div className="carousel-slide" key={index} style={{ width: `${slidePercent}%` }}>
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
