import React from "react";

const Footer = () => {
  return (
    <footer className="bg-orange-200 text-white py-6 md:py-8  max-h-h-[10vh]">
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* About Section */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-3">About Us</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium marketplace for authentic Kashmiri handicrafts. Connect directly with artisans.
            </p>
          </div>

          {/* Quick Links */}
  

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>✉️ syeedbilalkirmaney@gmail.com</li>
              <li>📞 +91 987 654 3210</li>
              <li>📍 Rajbagh, Srinagar, J&K</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Kashmir Handicrafts. Preserving tradition.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;