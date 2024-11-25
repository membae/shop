import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="text-white bg-gray-900 min-h-full">
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
      {/* Company Info */}
      <div>
        <h3 className="text-lg md:text-2xl font-bold mb-4">Gizmo Galaxy</h3>
        <p className="text-gray-400">
          Your one-stop shop for all things tech.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-gray-400 hover:text-white">
              About Us
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white">
              Contact
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white">
              FAQs
            </a>
          </li>
        </ul>
      </div>

      {/* Customer Service */}
      <div>
        <h3 className="text-lg font-bold mb-4">Customer Service</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-gray-400 hover:text-white">
              Shipping Info
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white">
              Returns
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-white">
              Order Status
            </a>
          </li>
        </ul>
      </div>

      {/* Follow Us */}
      <div>
        <h3 className="text-lg font-bold mb-4">Follow Us</h3>
        <div className="flex space-x-6">
          <FiFacebook className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
          <FiTwitter className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
          <FiInstagram className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />
        </div>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="mt-12 pt-8 border-t border-gray-800 text-center">
      <p className="text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Gizmo Galaxy. All rights reserved.
      </p>
    </div>
  </div>
</footer>

  );
}
