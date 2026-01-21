"use client";
import Image from "next/image";
import "./Carousel.css";
import { useState, useEffect } from "react";

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = [{ id: 1 }, { id: 2 }, { id: 3 }];

  // Carousel image auto rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    // Carousel image
    <div className="carousel-container">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselImages.map((img) => (
          <div key={img.id} className="carousel-slide">
            <Image
              src={`/images/carousel${img.id}.jpg`}
              alt={`Carousel ${img.id}`}
              fill
              style={{ objectFit: "cover" }}
              className="carousel-image"
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
