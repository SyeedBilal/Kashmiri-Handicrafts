import React from 'react';

import { Link } from 'react-router-dom';

const Products = ({ item }) => {



  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
      <div className="relative pt-[100%] w-full">
        <img 
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={item.image}

          alt={item.name} 
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-semibold text-amber-800 mb-2 line-clamp-2">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-amber-700">₹{item.price}</span>
            {item.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
            )}
          </div>
        </div>

     


          <Link 
            to={`/productDetails/${item._id}`}
            className="w-full px-4 py-2 rounded text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white text-center transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    
  );
};

export default Products;
