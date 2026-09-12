import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, ShieldCheck, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-indigo-700 transition">
              🛍️
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">ShopAI</span>
              <span className="text-xs ml-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
                E-Commerce
              </span>
            </div>
          </Link>

          {/* Navigation Mode Switcher */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
            <Link
              to="/customer/chat"
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                !isAdmin
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Customer Chat</span>
            </Link>

            <Link
              to="/admin"
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isAdmin
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
