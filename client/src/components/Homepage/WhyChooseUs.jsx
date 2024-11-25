import { FiTruck, FiShield, FiHeadphones, FiRefreshCw } from "react-icons/fi";

export default function WhyChooseUs() {
  const features = [
    {
      icon: FiTruck,
      title: "Free Shipping",
      description: "On orders over $100",
    },
    {
      icon: FiShield,
      title: "Secure Payment",
      description: "100% secure payment",
    },
    {
      icon: FiHeadphones,
      title: "24/7 Support",
      description: "Dedicated support",
    },
    {
      icon: FiRefreshCw,
      title: "Easy Returns",
      description: "30 day return policy",
    },
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
          Why Choose Gizmo Galaxy?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <feature.icon className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
