import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import carousel1 from '@/assets/carousel/001.jpg';
import carousel2 from '@/assets/carousel/002.jpg';
import carousel3 from '@/assets/carousel/003.jpg';
import carousel4 from '@/assets/carousel/004.jpg';
import carousel5 from '@/assets/carousel/005.jpg';

const carouselImages = [
  { src: carousel1, alt: 'Sustainable Development Project 1' },
  { src: carousel2, alt: 'Sustainable Development Project 2' },
  { src: carousel3, alt: 'Sustainable Development Project 3' },
  { src: carousel4, alt: 'Sustainable Development Project 4' },
  { src: carousel5, alt: 'Sustainable Development Project 5' },
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Carousel Images */}
      <div className="relative h-full w-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `linear-gradient(rgba(22, 78, 41, 0.7), rgba(22, 78, 41, 0.5)), url(${image.src})` }}
            />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Building a Sustainable Future
            <span className="block text-sky-light">for Sri Lanka</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join IDEA SRI LANKA in our mission to create lasting environmental impact through innovative sustainable development projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/projects" className="flex items-center">
                Explore Projects <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/about" className="flex items-center">
                Learn More <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>



      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>


    </div>
  );
};

export default HeroCarousel; 