import ProductCard1 from "./ProductCard1";


export default function BestSellers() {
  const products = [
    {
      id: 1,
      title: "Wireless Earbuds",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb",
    },
    {
      id: 2,
      title: "Smart Watch",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
    },
    {
      id: 3,
      title: "4K Camera",
      price: 599.99,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    },
    {
      id: 4,
      title: "Gaming Mouse",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    },
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-white">
          Best Sellers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard1 key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
