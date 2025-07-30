import {useState, useEffect, useRef} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Animal} from "../../../types/animal";
import Button from "../../ui/button";
import AnimalCard from "../../animals/animal-card";

interface CarouselProps {
  animals: Animal[];
  locale: string;
  loading?: boolean;
}

export default function Carousel({animals, locale, loading = false}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [visibleCards, setVisibleCards] = useState<number>(3);
  const [touchStart, setTouchStart] = useState<{x: number; y: number}>({x: 0, y: 0});
  const [touchEnd, setTouchEnd] = useState<{x: number; y: number}>({x: 0, y: 0});
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Update visible cards based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2); // Tablet: 2 cards
      } else {
        setVisibleCards(3); // Desktop: 3 cards
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentSlide(0);
  }, [animals]);

  const totalSlides = Math.ceil(animals.length / visibleCards);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Handle touch events for mobile swiping
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwiping) return;

    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });

    // Determine if this is a horizontal or vertical swipe
    const xDiff = touchStart.x - e.touches[0].clientX;
    const yDiff = touchStart.y - e.touches[0].clientY;

    // If vertical movement is greater than horizontal, it's likely a scroll
    // So we cancel the swipe
    if (Math.abs(yDiff) > Math.abs(xDiff)) {
      setIsSwiping(false);
      return;
    }

    // Prevent default to avoid page scrolling when swiping horizontally
    if (Math.abs(xDiff) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping || !touchStart.x || !touchEnd.x) {
      setIsSwiping(false);
      return;
    }

    const horizontalDistance = touchStart.x - touchEnd.x;
    const verticalDistance = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;

    // Only process as a swipe if horizontal movement is dominant and exceeds minimum distance
    if (Math.abs(horizontalDistance) > Math.abs(verticalDistance) && Math.abs(horizontalDistance) > minSwipeDistance) {
      if (horizontalDistance > 0) {
        // Swiped left, go to next slide
        handleNext();
      } else {
        // Swiped right, go to previous slide
        handlePrev();
      }
    }

    // Reset values
    setTouchStart({x: 0, y: 0});
    setTouchEnd({x: 0, y: 0});
    setIsSwiping(false);
  };

  // Cancel swiping if pointer leaves carousel area
  const handleTouchCancel = () => {
    setIsSwiping(false);
    setTouchStart({x: 0, y: 0});
    setTouchEnd({x: 0, y: 0});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-75"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-150"></div>
        </div>
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-base-content/70 mb-2">No animals uploaded yet.</p>
        <p className="text-sm text-base-content/50">Animals uploaded by this NGO will appear here.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navigation Buttons - Hidden on small screens */}
      <div className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 z-10 hidden sm:flex">
        <Button icon={<ChevronLeft />} onClick={handlePrev} rounded size="lg" />
      </div>
      <div className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 z-10 hidden sm:flex">
        <Button icon={<ChevronRight />} onClick={handleNext} rounded size="lg" />
      </div>

      {/* Carousel Container */}
      <div
        className="w-full overflow-hidden touch-pan-y"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / visibleCards)}%)`,
          }}>
          {animals.map((animal) => (
            <div key={animal.id} className="flex-shrink-0 p-2 md:p-4" style={{width: `${100 / visibleCards}%`}}>
              <AnimalCard animal={animal} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile dots navigation */}
      <div className="flex justify-center mt-4 ">
        {Array.from({length: totalSlides}).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 mx-1 rounded-full cursor-pointer ${index === currentSlide ? "bg-primary" : "bg-gray-300"}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
