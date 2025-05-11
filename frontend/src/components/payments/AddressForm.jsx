import React from 'react';

const AddressForm = ({ addressData, handleAddressChange, onBack, onContinue }) => (
  <div className="container mx-auto py-8 px-4">
    <h2 className="text-2xl font-bold text-amber-800 mb-6">Shipping Address</h2>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100 max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={addressData.address}
            onChange={handleAddressChange}
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={addressData.city}
            onChange={handleAddressChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">State</label>
          <input
            type="text"
            name="state"
            value={addressData.state}
            onChange={handleAddressChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">PIN Code</label>
          <input
            type="text"
            name="pincode"
            value={addressData.pincode}
            onChange={handleAddressChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-amber-700 text-amber-700 rounded-md hover:bg-amber-50 cursor-pointer"
        >
          Back to Cart
        </button>
        <button
          onClick={onContinue}
          className="flex-grow bg-amber-700 hover:bg-amber-800 text-white py-2 rounded-md cursor-pointer"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  </div>
);

export default AddressForm;
