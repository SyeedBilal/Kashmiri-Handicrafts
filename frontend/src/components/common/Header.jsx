import React, { useState, useEffect } from "react";
import "../../index.css"; // Corrected path

import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuthenticated } from "../../store/Slices/authSlice"; // Corrected path and combined import
import { selectIsAdminAuthenticated } from "../../store/Slices/adminSlice"; // Corrected path
import { api } from "../../services/axiosInstance";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdminAuthenticated);
  const cartItems = useSelector((state) => state.cart); 
  const cartItemCount = cartItems.length;

  const handleSearchQuery = async () => {
    if (searchQuery.trim() === "") {
      return;
    }

    try {
      const response = await api.get(
        `/products/search?query=${searchQuery}`
      );
      const results = response.data;
      navigate("/search-results", {
        state: { searchResults: results, query: searchQuery },
      });
      setSearchQuery(""); 
      setIsMenuOpen(false); 
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleOnLogout = () => {
    api.post(`/logout`)
      .then((response) => {
        
        alert(response.message || "Logout successful");
          dispatch(logout());
          navigate("/"); 
        
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
    setIsMenuOpen(false); 
  };
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [navigate]);

  return (
    <header className="bg-amber-900 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold font-serif flex-shrink-0">
          <Link to={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center cursor-pointer">
            <img
              src="/logo-placeholder.png" 
              alt="Kashmir Handicrafts"
              className="h-10 w-10 mr-2"
              onError={(e) => (e.target.style.display = "none")} // Fallback for broken image
            />
            <span className="text-amber-100">Kashmir Handicrafts</span>
          </Link>
        </div>

        {/* Desktop Navigation & Search */}
        <div className="hidden sm:flex items-center space-x-6 lg:space-x-8 flex-grow justify-center px-4">
          <nav>
            <ul className="flex space-x-6 lg:space-x-8">
              {!isAdmin && (
                <li>
                  <Link to="/" className="hover:text-amber-200 font-medium">
                    Home
                  </Link>
                </li>
              )}
              {!isAdmin && (
                <li>
                  <Link
                    to="/Collections"
                    className="hover:text-amber-200 font-medium"
                  >
                    Collections
                  </Link>
                </li>
              )}
              {isLoggedIn && !isAdmin && (
                <li>
                  <Link
                    to="/user-orders"
                    className="hover:text-amber-200 font-medium"
                  >
                    My Orders
                  </Link>
                </li>
              )}
              {(isAdmin || (!isLoggedIn && !isAdmin)) && (
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="hover:text-amber-200 font-medium"
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          {(!isAdmin) && (
            <div className="flex-1 max-w-xs lg:max-w-sm">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchQuery()}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-amber-800 text-amber-100 placeholder-amber-300 border border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
                <FaSearch
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-300 cursor-pointer"
                  onClick={handleSearchQuery}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Aligned Icons/Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
          {isLoggedIn && !isAdmin && (
            <button
              className="text-amber-100 hover:text-amber-200 cursor-pointer p-1"
              onClick={() => navigate("/cart")}
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <FaShoppingCart className="text-2xl" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </button>
          )}

          {/* Desktop Login/Logout Buttons */}
          {!isLoggedIn && !isAdmin &&(
            <button
              className="hidden sm:block bg-amber-700 px-3 py-2 lg:px-4 rounded hover:bg-amber-800 text-amber-100 border border-amber-600 cursor-pointer text-sm lg:text-base"
              onClick={()=>navigate("/login")}
            >
              Login
            </button>)}
           
          {isLoggedIn && !isAdmin && (
            <button
              className="hidden sm:block bg-amber-700 px-3 py-2 lg:px-4 rounded hover:bg-amber-800 text-amber-100 border border-amber-600 cursor-pointer text-sm lg:text-base"
              onClick={handleOnLogout}
            >
              Logout
            </button>
          )}
          

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden text-amber-100 hover:text-amber-200 text-2xl cursor-pointer p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Only show for non-admin users, appears below main header items */}
      {!isAdmin && (
        <div className="sm:hidden w-full px-4 pb-3 pt-1"> 
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchQuery()}
              placeholder="Search products..."
              className="w-full px-4 py-2 pr-10 rounded-lg bg-amber-800 text-amber-100 placeholder-amber-300 border border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <FaSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-300 cursor-pointer"
              onClick={handleSearchQuery}
            />
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-amber-900 text-center z-50 shadow-xl border-t border-amber-700">
          <ul className="space-y-2 py-4">
            {!isAdmin && (
              <li>
                <Link
                  to="/"
                  className="block py-2 hover:text-amber-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
            )}
            {!isAdmin && (
              <li>
                <Link
                  to="/Collections"
                  className="block py-2 hover:text-amber-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Collections
                </Link>
              </li>
            )}
            {isLoggedIn && !isAdmin && (
              <li>
                <Link
                  to="/user-orders"
                  className="block py-2 hover:text-amber-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
              </li>
            )}
            {(isAdmin || (!isLoggedIn && !isAdmin)) && (
              <li>
                <Link
                  to="/admin/dashboard"
                  className="block py-2 hover:text-amber-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            {/* Mobile Login/Logout Button */}
            <li>
              {isLoggedIn && !isAdmin && (
                <button
                  className="bg-amber-700 px-6 py-2 rounded hover:bg-amber-800 text-amber-100 border border-amber-600 cursor-pointer w-auto mx-auto my-2"
                  onClick={handleOnLogout} 
                >
                  Logout
                </button>
              )}

              {!isLoggedIn && !isAdmin && (
                <button
                  className="bg-amber-700 px-6 py-2 rounded hover:bg-amber-800 text-amber-100 border border-amber-600 cursor-pointer w-auto mx-auto my-2"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </button>
              )}
              
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;