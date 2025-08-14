import { MapPin } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold">LocalEats</h4>
            </div>
            <p className="text-gray-400">
              Discover the best restaurants and accommodations in your area.
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Explore</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/places"
                  className="hover:text-white transition-colors"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  href="/places"
                  className="hover:text-white transition-colors"
                >
                  Hotels
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LocalEats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
