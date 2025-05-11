import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import ProductsDetail from './pages/ProductDetail';
import Cart from "./components/cart/Cart";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ProductPage from './pages/ProductsPage';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from './Admin/AdminDashboard';
import AdminLogin from './Admin/AdminLogin';
import AdminEditProduct from './Admin/AdminEditProduct';
import OrderSuccess from './components/payments/OrderSucess';
import SearchedItems from './pages/searchedItems';
import { CollectionItems } from './pages/Collections';
import Fetchdata from './components/common/fetchdata';
import UserOrders from './pages/UserOrders';
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/productDetails/:Id" element={<ProductsDetail />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/products/edit/:productId" element={<AdminEditProduct />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/search-results" element={<SearchedItems />} />
        <Route path="/Collections" element={<Fetchdata /> && <CollectionItems />} />
        <Route path="/user-orders" element={<UserOrders />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
