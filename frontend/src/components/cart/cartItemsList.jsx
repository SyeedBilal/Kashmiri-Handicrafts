import React from "react";

const CartItemsList = ({ cartItems, handleRemoveFromCart }) => (
  <div className="space-y-4">
    {cartItems.length > 0 ? (
      cartItems.map((item) => {
        const product = item.productId;
        return (
          <div
            key={item._id}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-amber-100 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="font-bold text-amber-700">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    className="text-gray-400 hover:text-amber-700 transition-colors text-xl font-bold"
                    onClick={() => handleRemoveFromCart(product._id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <p className="text-center text-gray-500 py-8">Your bag is empty.</p>
    )}
  </div>
);

export default CartItemsList;