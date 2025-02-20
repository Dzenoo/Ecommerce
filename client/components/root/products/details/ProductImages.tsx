'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProductImagesProps = {
  images: string[];
};

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const prev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbnailContainerRef.current) return;

    const container = thumbnailContainerRef.current;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (images.length === 0) {
    return <div>No images available</div>;
  }

  const isMultipleImages = images.length > 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="image-container relative">
        {isMultipleImages && (
          <button onClick={prev} className="left-2">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="relative h-full max-h-[500px] min-h-[500px] w-full shadow-md">
          <Image
            src={images[currentImage]}
            alt={`Product image ${currentImage + 1}`}
            className="h-full w-full select-none object-contain"
            fill
          />
        </div>
        {isMultipleImages && (
          <button onClick={next} className="right-2">
            <ArrowRight size={20} />
          </button>
        )}
      </div>
      <div
        ref={thumbnailContainerRef}
        onMouseDown={handleMouseDown}
        className={`hide-scrollbar flex touch-pan-x gap-5 overflow-x-scroll ${isMultipleImages && 'cursor-grabbing'}`}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Product thumbnail ${index + 1}`}
            width={100}
            height={100}
            className={cn(
              'h-28 w-28 cursor-pointer select-none object-cover shadow-md transition-all',
              index === currentImage && 'border-2 border-blue-500 opacity-70',
            )}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
