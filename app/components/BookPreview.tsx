"use client";

import { useEffect, useState, ReactElement } from "react";
import dynamic from "next/dynamic";

// Dynamically import the flipbook to avoid SSR issues
const HTMLFlipBook = dynamic(
  () => import("react-pageflip").then((mod) => mod.default),
  { ssr: false }
);

type StoryPage = {
  text: string;
  imageUrl: string;
};

type BookPreviewProps = {
  pages: StoryPage[];
};

const BookPreview = ({ pages }: BookPreviewProps): ReactElement => {
  const [imageLoadStates, setImageLoadStates] = useState<
    Array<"loading" | "loaded" | "error">
  >(pages.map(() => "loading"));

  useEffect(() => {
    setImageLoadStates(pages.map(() => "loading"));
  }, [pages]);

  const handleImageLoad = (index: number) => {
    setImageLoadStates((prev) => {
      const newStates = [...prev];
      newStates[index] = "loaded";
      return newStates;
    });
  };

  const handleImageError = (index: number) => {
    setImageLoadStates((prev) => {
      const newStates = [...prev];
      newStates[index] = "error";
      return newStates;
    });
  };

  return (
    <div className="book-preview-container p-4 flex justify-center">
      {pages.length > 0 ? (
        <HTMLFlipBook
          className="flip-book"
          width={350}
          height={500}
          showCover
          maxShadowOpacity={0.5}
        >
          {pages.map((page, index) => (
            <div
              key={`page-${index}`}
              className="page bg-white p-6 rounded-lg flex flex-col border border-gray-200"
            >
              <div className="image-container flex-1 mb-4 min-h-[200px] relative bg-gray-100 rounded-lg overflow-hidden">
                {imageLoadStates[index] === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-gray-600 text-sm">
                        Loading illustration...
                      </span>
                    </div>
                  </div>
                )}

                {imageLoadStates[index] === "error" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="text-center p-4">
                      <p className="text-red-500 text-sm">Couldn't load image</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Page {index + 1}
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={page.imageUrl}
                    alt={`Page ${index + 1} illustration`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoadStates[index] === "loaded" ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />
                )}
              </div>

              <div
                className={`page-content flex-1 p-4 bg-gray-50 rounded-lg overflow-y-auto ${
                  imageLoadStates[index] === "loaded" ? "opacity-100" : "opacity-70"
                }`}
              >
                <p className="text-gray-800 whitespace-pre-line">{page.text}</p>
              </div>
            </div>
          ))}
        </HTMLFlipBook>
      ) : (
        <div className="text-center p-8">
          <p className="text-gray-500">No pages to display yet</p>
        </div>
      )}
    </div>
  );
};

export default BookPreview;