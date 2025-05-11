import React from 'react';

const PaymentSummary = ({
  addressData,
  cartTotals,
  totalItem,
  CONVENIENCE_FEE,
  onBack,
  onPay,
}) => (
  <div className="container mx-auto py-8 px-4">
    <h2 className="text-2xl font-bold text-amber-800 mb-6">Payment Summary</h2>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100 max-w-lg mx-auto">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
        <p className="text-gray-600">
          {addressData.address}<br />
          {addressData.city}, {addressData.state}<br />
          PIN: {addressData.pincode}
        </p>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Items ({totalItem})</span>
            <span>₹{cartTotals.totalMRP - cartTotals.totalDiscount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Convenience Fee</span>
            <span>₹{CONVENIENCE_FEE}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total Amount</span>
            <span>₹{cartTotals.finalPayment}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-amber-700 text-amber-700 rounded-md hover:bg-amber-50 cursor-pointer transition-colors"
        >
          Back
        </button>
        <button
          onClick={onPay}
          className="flex-grow bg-amber-700 hover:bg-amber-800 text-white py-2 rounded-md cursor-pointer transition-colors"
        >
          Pay ₹{cartTotals.finalPayment}
        </button>
      </div>
    </div>
  </div>
);

export default PaymentSummary;
