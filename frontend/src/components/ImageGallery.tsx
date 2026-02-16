import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image principale */}
        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden cursor-pointer"
             onClick={() => setIsModalOpen(true)}>
          <img
            src={images[0]}
            alt={`${alt} - Principal`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Grid d'images secondaires */}
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative h-44 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => {
                setCurrentIndex(index + 1);
                setIsModalOpen(true);
              }}
            >
              <img
                src={image}
                alt={`${alt} - ${index + 2}`}
                className="w-full h-full object-cover"
              />
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    +{images.length - 5} photos
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de visualisation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={previousImage}
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh]">
            <img
              src={images[currentIndex]}
              alt={`${alt} - ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}