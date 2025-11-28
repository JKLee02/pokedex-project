"use client";
import './SideImage.css';
import Image from "next/image";

export default function SideImage({ src, alt }) {
  return (
    <div className="side-image">
      <div className="side-image-wrapper">
        <div className="side-image-content">
          <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}
