import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSection() {
  const images = [
    "https://i.pinimg.com/564x/8e/45/7f/8e457f8002d029a25c570f93fc14fcfd.jpg",
    "https://i.pinimg.com/564x/24/7c/36/247c36bc62281bbb6103d246cde8b009.jpg",
    "https://i.pinimg.com/564x/bd/c8/2f/bdc82fd26ef708c312cb480ccd47c69b.jpg",
  ];

  return (
    <div className="pt-16">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="h-[500px] w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
                <div className="text-center text-white p-4 md:p-8">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Discover Amazing Gadgets
                  </h2>
                  <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition duration-150">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
