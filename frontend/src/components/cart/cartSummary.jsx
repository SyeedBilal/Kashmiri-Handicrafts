import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCartAsync, fetchCart } from '../../store/Actions/cartAction';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { createOrder, verifyPayment } from '../../store/Actions/orderActions';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../payments/AddressForm';
import CartItemsList from './cartItemsList';
import OrderSummary from '../payments/OrderSummary';
import PaymentSummary from '../payments/PaymentSummary';

const CartSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'address', 'payment'
  const [addressData, setAddressData] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const user = useSelector((state) => state.auth.user);
  const userId = user?.userId;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector((state) => state.cart);
  const totalItem = cartItems.length;
  const CONVENIENCE_FEE = 99;

  const cartTotals = useMemo(() => {
    let totalMRP = 0;
    let totalDiscount = 0;

    cartItems.forEach((cartItem) => {
      const product = cartItem.productId;
      totalMRP += product.originalPrice * cartItem.quantity;
      totalDiscount += (product.originalPrice - product.price) * cartItem.quantity;
    });

    const finalPayment = totalMRP - totalDiscount + (totalItem > 0 ? CONVENIENCE_FEE : 0);

    return {
      totalMRP,
      totalDiscount,
      finalPayment,
    };
  }, [cartItems, totalItem]);

  const handleRemoveFromCart = useCallback((itemId) => {
    dispatch(removeFromCartAsync(userId, itemId));
  }, [dispatch, userId]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        dispatch(fetchCart());
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadCart();
    }
  }, [dispatch, userId]);

  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceedToAddress = () => {
    if (totalItem === 0) return;
    setCheckoutStep('address');
  };

  const handleProceedToPayment = () => {
    // Basic validation
    if (!addressData.address || !addressData.city || !addressData.state || !addressData.pincode) {
      alert('Please fill all address fields');
      return;
    }
    setCheckoutStep('payment');
  };

  const handlePayment = async () => {
    try {
      // Create order and get Razorpay details
      const orderData = {
        userId,
        shippingAddress: addressData,
      };
      
      const response = await dispatch(createOrder(orderData));

   
      
      // Initialize Razorpay
      const options = {
        key: response.key,
        amount: response.razorpayOrder.amount,
        currency: response.razorpayOrder.currency,
        name: 'Kashmiri Handicrafts',
        description: 'Purchase',
        order_id: response.razorpayOrder.id,
        handler: async (response) => {
          // Handle success payment
          const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };
          
          try {
            await dispatch(verifyPayment(paymentData));
            // Navigate to success page
            navigate('/order-success', { 
              state: { orderId: response.razorpay_order_id } 
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || '',
        },
        theme: {
          color: '#B45309', // Amber 700
        },
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Unable to process payment. Please try again later.');
    }
  };

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">Please Login to view your cart</h2>
        <p className="text-gray-600">You need to be logged in to access your cart.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading cart items...</div>;
  }

  // Render address form
  if (checkoutStep === 'address') {
    return (
      <AddressForm
        addressData={addressData}
        handleAddressChange={handleAddressChange}
        onBack={() => setCheckoutStep('cart')}
        onContinue={handleProceedToPayment}
      />
    );
  }

  // Render payment summary
  if (checkoutStep === 'payment') {
    return (
      <PaymentSummary
        addressData={addressData}
        cartTotals={cartTotals}
        totalItem={totalItem}
        CONVENIENCE_FEE={CONVENIENCE_FEE}
        onBack={() => setCheckoutStep('address')}
        onPay={handlePayment}
      />
    );
  }

  // Default cart view
  return (
    <div className="container mx-auto py-8 px-4">
    <main className="flex flex-col md:flex-row gap-6">
      {/* Cart Items Section */}
      <div className="flex-grow md:w-2/3">
        <h2 className="text-2xl font-bold text-amber-800 mb-6">
          My Bag ({totalItem} Items)
        </h2>
        <CartItemsList
          cartItems={cartItems}
          handleRemoveFromCart={handleRemoveFromCart}
        />
      </div>
      {/* Order Summary Section */}
      <div className="md:w-1/3">
        <OrderSummary
          cartTotals={cartTotals}
          totalItem={totalItem}
          CONVENIENCE_FEE={CONVENIENCE_FEE}
          handleProceedToAddress={handleProceedToAddress}
        />
      </div>
    </main>
  </div>
  );
};

export default CartSummary;