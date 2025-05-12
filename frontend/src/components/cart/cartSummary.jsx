import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCartAsync, fetchCart } from '../../store/Actions/cartAction';
import { selectIsAuthenticated } from '../../store/Slices/authSlice';
import { createOrder, verifyPayment } from '../../store/Actions/orderActions';
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
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const userId = user?.userId;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector((state) => state.cart);
  const totalItem = cartItems?.length || 0;
  const CONVENIENCE_FEE = 50; // Example value

  // Memoized cart totals calculation
  const cartTotals = useMemo(() => {
    let totalMRP = 0;
    let totalDiscount = 0;

    // Ensure cartItems is an array before using forEach
    const items = Array.isArray(cartItems) ? cartItems : [];
    
    items.forEach((cartItem) => {
      const product = cartItem.productId;
      if (product) { // Add safety check for product
        totalMRP += product.originalPrice * cartItem.quantity;
        totalDiscount += (product.originalPrice - product.price) * cartItem.quantity;
      }
    });

    const finalPayment = totalMRP - totalDiscount + (totalItem > 0 ? CONVENIENCE_FEE : 0);
    
    return { totalMRP, totalDiscount, finalPayment };
  }, [cartItems, totalItem]);

  // Load cart data
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await dispatch(fetchCart());
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError('Failed to load cart. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && userId) {
      loadCart();
    } else if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [dispatch, userId, isAuthenticated, navigate]);

  const handleRemoveFromCart = useCallback((itemId) => {
    dispatch(removeFromCartAsync(userId, itemId));
  }, [dispatch, userId]);

  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceedToAddress = () => {
    if (totalItem === 0) {
      setError('Your cart is empty');
      return;
    }
    setCheckoutStep('address');
    setError(null);
  };

  const handleProceedToPayment = () => {
    if (!addressData.address || !addressData.city || !addressData.state || !addressData.pincode) {
      setError('Please fill all address fields');
      return;
    }
    setCheckoutStep('payment');
    setError(null);
  };

  const handlePayment = async () => {
    try {
      const orderData = {
        userId,
        shippingAddress: addressData,
      };
      
      const response = await dispatch(createOrder(orderData));
      
      const options = {
        key: response.key,
        amount: response.razorpayOrder.amount,
        currency: response.razorpayOrder.currency,
        name: 'Kashmiri Handicrafts',
        description: 'Purchase',
        order_id: response.razorpayOrder.id,
        handler: async (paymentResponse) => {
          try {
            const paymentData = {
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            };
            
            await dispatch(verifyPayment(paymentData));
            navigate('/order-success', { 
              state: { orderId: paymentResponse.razorpay_order_id } 
            });
          } catch (err) {
            console.error('Payment verification failed:', err);
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || '',
        },
        theme: {
          color: '#B45309',
        },
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (err) {
      console.error('Payment initialization failed:', err);
      setError('Unable to process payment. Please try again later.');
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

  // Show loading state
  if (isLoading) {
    return <p> Loading ...</p>
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render checkout steps
  switch (checkoutStep) {
    case 'address':
      return (
        <AddressForm
          addressData={addressData}
          handleAddressChange={handleAddressChange}
          onBack={() => setCheckoutStep('cart')}
          onContinue={handleProceedToPayment}
        />
      );
    case 'payment':
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
    default:
      return (
        <div className="container mx-auto py-8 px-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
            </div>
          )}
          <main className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow md:w-2/3">
              <h2 className="text-2xl font-bold text-amber-800 mb-6">
                My Bag ({totalItem} Items)
              </h2>
              <CartItemsList
                cartItems={cartItems}
                handleRemoveFromCart={handleRemoveFromCart}
              />
            </div>
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
  }
};

export default CartSummary;