import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard1";
import "swiper/css";
import "swiper/css/navigation";

export default function NewArrivals() {
  const products = [
    {
      id: 1,
      title: "VR Headset",
      price: 299.99,
      image:
        "https://i.pinimg.com/564x/ea/28/bd/ea28bd245054694d282c5f4419fe51e1.jpg",
    },
    {
      id: 2,
      title: "Camera",
      price: 499.99,
      image:
        "https://i.pinimg.com/564x/4d/a2/05/4da205bee0604d4d289e3a8c9b273187.jpg",
    },
    {
      id: 3,
      title: "Gaming Console",
      price: 399.99,
      image:
        "https://i.pinimg.com/736x/4a/d1/69/4ad1691fa1848fcb299357e780ab9f26.jpg",
    },
    {
      id: 4,
      title: "Tablet",
      price: 649.99,
      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764",
    },
    {
      id: 5,
      title: "Smart Speaker",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc",
    },
    {
      id: 6,
      title: "Headphone",
      price: 250.00,
      image: "https://i.pinimg.com/564x/ba/74/71/ba7471be930e62d89e1ec23ab50648a9.jpg",
    },
    {
      id: 7,
      title: "laptop",
      price: 470.99,
      image: "https://i.pinimg.com/564x/6c/47/df/6c47df78ccce9e250cae829fc1276015.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-white">
          New Arrivals
        </h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="py-4"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
