import React from 'react';
import { useLocation, Link } from 'react-router-dom';


// Rename to follow React component naming convention (capital first letter)
const SearchedItems = () => {

  const location = useLocation();

  const { searchResults = [], query = "" } = location.state || {};
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">
        Search Results for "{query}" ({searchResults.length} items)
      </h2>
      
      {searchResults.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No products found matching your search.</p>
          <Link to="/products" className="text-amber-600 hover:text-amber-800 mt-4 inline-block">
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/productDetails/${item._id}`}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {e.target.onerror = null; e.target.src = '/placeholder.png'}}
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-amber-600 font-bold">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-gray-400 line-through ml-2 text-sm">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>
                    {item.discountPercentage > 0 && (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        {item.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchedItems;