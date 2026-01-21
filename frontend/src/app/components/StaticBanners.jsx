"use client";
import "./StaticBanners.css";
import Image from "next/image";

export default function StaticBanners() {
  return (
    <div className="static-banners">
      <div className="static-banner">
        <Image
          src="/images/pokeball.jpg"
          alt="Static Banner 1"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="static-banner">
        <Image
          src="/images/pokecards.jpg"
          alt="Static Banner 2"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
