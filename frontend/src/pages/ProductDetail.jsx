import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addToCartAsync } from "../store/Actions/cartAction"



const ProductsDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.userId;
  const { Id } = useParams(); // product id from LINK 
  const itemsList = useSelector((state) => state.items);
  const product = itemsList.find((item) => item._id === Id);

  useEffect(() => {
    
  }, [Id]);

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please login to add items to cart");
      navigate('/login');
      return;
    }

    try {
      await dispatch(addToCartAsync(userId, Id));
     
  
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add product to cart');
    }
  };

  if (!product) {
    return (
      <h2 className="text-center text-xl font-bold mt-10">Product Not Found</h2>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg transform transition-all duration-500 hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-6">{product.description}</p>

            {/* Price and Discount */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-semibold text-red-500">
                ₹{product.price}
              </span>
              <span className="text-gray-400 line-through text-lg">
                ₹{product.originalPrice}
              </span>
              <span className="text-green-500 text-lg">
                ({product.discountPercentage}% Off)
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <label
              htmlFor="quantity"
              className="block text-lg font-medium text-gray-700"
            >
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              defaultValue="1"
              className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-lg font-medium"
            onClick={handleAddToCart}
            
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetail;
