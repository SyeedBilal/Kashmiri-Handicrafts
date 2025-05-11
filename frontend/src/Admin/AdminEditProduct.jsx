import { useState, useEffect } from 'react';
import { Plus, Upload, DollarSign } from 'lucide-react';
import { api } from "../services/axiosInstance";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminItemsActions } from '../store/Slices/adminItemsSlice';
import { useNavigate } from 'react-router-dom';


const AdminEditProduct = ({ setActiveTab }) => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get all admin products from Redux store (stored in local storage using redux persistant ) otherise had to make an api call to fetch  particular admin products
  const allAdminProducts = useSelector((state) => state.adminItems);
 

  // Find the current product
  const currentProduct = allAdminProducts.find((product) => product._id === productId);

  // Initialize state with current product data
  const [product, setProduct] = useState({
    name: currentProduct?.name || '',
    description: currentProduct?.description || '',
    price: currentProduct?.price || '',
    originalPrice: currentProduct?.originalPrice || '',
    quantity: currentProduct?.quantity || '',
    discountPercentage: currentProduct?.discountPercentage || '',
    category: currentProduct?.category || '',
    image: null, // handle image separately
    existingImage: currentProduct?.imageUrl || null // Keep track of existing image
  });


  const calculateDiscount = () => {
    if (product.originalPrice && product.price) {
      const original = parseFloat(product.originalPrice);
      const current = parseFloat(product.price);
      if (original > 0 && current > 0 && original > current) {
        const discount = ((original - current) / original) * 100;
        setProduct(prev => ({
          ...prev,
          discountPercentage: discount.toFixed(2)
        }));
      }
    }
  };

  useEffect(() => {
    calculateDiscount();
  }, [product.originalPrice, product.price]);

  // Handle form submission for updating product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('originalPrice', product.originalPrice);
      formData.append('quantity', product.quantity);
      formData.append('category', product.category);
      formData.append('discountPercentage', product.discountPercentage);
      
      // Only append image if a new one was selected
      if (product.image) {
        formData.append('image', product.image);
      }

      const response = await api.put(
        `/admin/updateProduct/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Update the product in Redux store
        dispatch(adminItemsActions.removeAdminItem(productId));
        alert('Product updated successfully!');
        navigate('/admin/dashboard');
      } else {
        alert(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert('Failed to update product');
    }
  };

  // Reset form to original values
  const handleReset = () => {
    if (currentProduct) {
      setProduct({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        originalPrice: currentProduct.originalPrice,
        quantity: currentProduct.quantity,
        discountPercentage: currentProduct.discountPercentage,
        category: currentProduct.category,
        image: null,
        existingImage: currentProduct.imageUrl
      });
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProduct(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product details in your inventory</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Product Name</label>
              <input
                type="text"
                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={product.name}
                onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={product.category}
                onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Select Category</option>
                <option value="shawls">Shawls</option>
                <option value="carpets">Carpets</option>
                <option value="walnut-wood">Walnut Wood</option>
                <option value="paper-mache">Paper Mache</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Original Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Original Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={product.originalPrice}
                onChange={(e) => setProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
                required
              />
            </div>
            
            {/* Sale Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Sale Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={product.price}
                onChange={(e) => setProduct(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
            
            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Quantity in Stock</label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={product.quantity}
                onChange={(e) => setProduct(prev => ({ ...prev, quantity: e.target.value }))}
                required
              />
            </div>
            
            {/* Discount Percentage (read-only) */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Discount Percentage (%)</label>
              <input
                type="number"
                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-100"
                value={product.discountPercentage}
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Auto-calculated from Original and Sale Price</p>
            </div>
            
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 h-32"
                value={product.description}
                onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Product Image</label>
              <div className="flex items-center">
                <label className="flex items-center justify-center w-full p-4 border-2 border-amber-300 border-dashed rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-amber-500" />
                    <p className="mt-2 text-sm text-amber-600">
                      {product.existingImage ? 'Change image' : 'Upload image'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (max. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                <div className="ml-4">
                  {product.image ? (
                    <p className="text-sm text-gray-600">New image: {product.image.name}</p>
                  ) : product.existingImage ? (
                    <div className="flex items-center">
                      <img 
                        src={product.existingImage} 
                        alt="Current" 
                        className="h-10 w-10 rounded-full object-cover mr-2"
                      />
                      <span className="text-sm text-gray-600">Current image</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No image selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-6 bg-amber-100 text-amber-900 rounded-lg hover:bg-amber-200 transition duration-200 cursor-pointer"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              className="flex items-center py-3 px-6 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition duration-200 cursor-pointer"
            >
              <Plus className="mr-2" size={18} />
              Update Product
            </button>
          </div>
        </form>
      </div>
      
      {/* Navigation to Analytics */}
      <div className="mt-6">
        <button 
          onClick={() => setActiveTab('analytics')}
          className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
        >
          <DollarSign className="mr-2" size={16} />
          View Dashboard Analytics
        </button>
      </div>
    </div>
  );
};

export default AdminEditProduct;