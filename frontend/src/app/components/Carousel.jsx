"use client";
import Image from "next/image";
import "./Carousel.css";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef(null);
  const carouselImages = [{ id: 1 }, { id: 2 }, { id: 3 }];

  // Use refs for drag values to avoid stale closures
  const dragStartX = useRef(0);
  const dragIsDragging = useRef(false);

  // Handle touch start
  const handleTouchStart = useCallback((e) => {
    dragStartX.current = e.touches[0].clientX;
    dragIsDragging.current = true;
    setIsDragging(true);
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((e) => {
    if (!dragIsDragging.current) return;
    const diff = e.touches[0].clientX - dragStartX.current;
    setTranslateX(diff);
  }, []);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (!dragIsDragging.current) return;
    dragIsDragging.current = false;
    setIsDragging(false);

    // Determine slide change based on drag distance
    const threshold = 100; // minimum drag distance to change slide
    if (translateX < -threshold) {
      // Swiped left - go to next slide
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    } else if (translateX > threshold) {
      // Swiped right - go to previous slide
      setCurrentSlide(
        (prev) => (prev - 1 + carouselImages.length) % carouselImages.length,
      );
    }

    setTranslateX(0);
  }, [translateX, carouselImages.length]);

  // Handle mouse down
  const handleMouseDown = useCallback((e) => {
    // Prevent default to avoid browser's drag-to-copy behavior
    e.preventDefault();
    dragStartX.current = e.clientX;
    dragIsDragging.current = true;
    setIsDragging(true);
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (!dragIsDragging.current) return;
    const diff = e.clientX - dragStartX.current;
    setTranslateX(diff);
  }, []);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (!dragIsDragging.current) return;
    dragIsDragging.current = false;
    setIsDragging(false);

    // Determine slide change based on drag distance
    const threshold = 100; // minimum drag distance to change slide
    if (translateX < -threshold) {
      // Swiped left - go to next slide
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    } else if (translateX > threshold) {
      // Swiped right - go to previous slide
      setCurrentSlide(
        (prev) => (prev - 1 + carouselImages.length) % carouselImages.length,
      );
    }

    setTranslateX(0);
  }, [translateX, carouselImages.length]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (dragIsDragging.current) {
      dragIsDragging.current = false;
      setIsDragging(false);
      setTranslateX(0);
    }
  }, []);

  // Calculate the transform value
  const getTransform = () => {
    if (isDragging) {
      // During drag, smoothly follow the cursor/finger
      return `translateX(calc(-${currentSlide * 100}% + ${translateX}px))`;
    }
    return `translateX(-${currentSlide * 100}%)`;
  };

  // Add event listeners for mouse move and mouse up when dragging starts
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Carousel image auto rotation
  // Pause auto-rotation when user is interacting with the carousel
  useEffect(() => {
    if (isDragging) return; // Don't auto-rotate during drag

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages.length, isDragging]);

  return (
    <div
      className="carousel-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <div
        className={`carousel-track ${isDragging ? "dragging" : ""}`}
        style={{ transform: getTransform() }}
      >
        {carouselImages.map((img) => (
          <div key={img.id} className="carousel-slide">
            <Image
              src={`/images/carousel${img.id}.jpg`}
              alt={`Carousel ${img.id}`}
              fill
              style={{ objectFit: "cover" }}
              className="carousel-image"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="carousel-indicators">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
