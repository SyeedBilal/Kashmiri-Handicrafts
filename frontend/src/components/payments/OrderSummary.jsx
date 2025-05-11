import React from "react";

const OrderSummary = ({
  cartTotals,
  totalItem,
  CONVENIENCE_FEE,
  handleProceedToAddress,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
    <h3 className="text-lg font-bold text-amber-800 mb-4">PRICE DETAILS</h3>
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span>Total MRP</span>
        <span>₹{cartTotals.totalMRP}</span>
      </div>
      <div className="flex justify-between text-green-600">
        <span>Discount on MRP</span>
        <span>-₹{cartTotals.totalDiscount}</span>
      </div>
      <div className="flex justify-between">
        <span>Convenience Fee</span>
        <span>₹{totalItem > 0 ? CONVENIENCE_FEE : 0}</span>
      </div>
      <hr className="my-4 border-amber-100" />
      <div className="flex justify-between font-bold text-amber-800">
        <span>Total Amount</span>
        <span>₹{cartTotals.finalPayment}</span>
      </div>
    </div>
    <button
      className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg mt-6 transition-colors cursor-pointer"
      disabled={totalItem === 0}
      onClick={handleProceedToAddress}
    >
      PROCEED TO CHECKOUT
    </button>
  </div>
);

export default OrderSummary;