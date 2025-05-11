import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Collections = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categorizedProducts, setCategorizedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Get items from Redux store
  const items = useSelector((state) => state.items);


  
  // Categories we want to display
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'shawls', name: 'Shawls' },
    { id: 'carpet', name: 'Carpets' },
    { id: 'papermache', name: 'Paper Mache' },
    { id: 'others', name: 'Others' }
  ];
  
  // Process and categorize products
  useEffect(() => {
    if (items && items.length > 0) {
      const grouped = {
        all: items,
        shawls: items.filter(item => item.category === 'shawls'),
        carpet: items.filter(item => item.category === 'carpets'),
        papermache: items.filter(item => 
          item.category === 'papermache' || item.category === 'paper mache'
        ),
        others: items.filter(item => 
          !['shawls', 'carpet', 'papermache', 'paper mache'].includes(item.category)
        )
      };
      
      setCategorizedProducts(grouped);
      setLoading(false);

     
    }
  }, [items]);

  // Calculate discount percentage if not already provided
  const getDiscountPercentage = (original, current) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="collections-container">
      {/* Header section */}
      <div className="collections-header">
        <h1>Our Collections</h1>
        <p>Discover authentic Kashmiri craftsmanship</p>
      </div>
      
      {/* Category navigation */}
      <div className="category-tabs">
        {categories.map(category => (
          <button 
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Products display */}
      <div className="products-container">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : categorizedProducts[selectedCategory]?.length > 0 ? (
          <div className="products-grid">
            {categorizedProducts[selectedCategory].map(product => (
              <div className="product-card" key={product._id}>
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image" 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Available';
                    }}
                  />
                  {(product.discountPercentage || product.originalPrice > product.price) && (
                    <span className="discount-badge">
                      {product.discountPercentage ? 
                        `-${Math.round(product.discountPercentage)}%` : 
                        `-${getDiscountPercentage(product.originalPrice, product.price)}%`}
                    </span>
                  )}
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-description">{
                    product.description.length > 70 
                      ? `${product.description.substring(0, 70)}...` 
                      : product.description
                  }</p>
                  <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">${product.originalPrice}</span>
                    )}
                  </div>
                <Link  className='view-product-btn' to={`/productDetails/${product._id}`}>
                  
                    View Details
                    </Link>
                 
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-products">No products found in this category</div>
        )}
      </div>
      
      <style jsx>{`
        .collections-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Roboto', sans-serif;
        }
        .collections-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .collections-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #333;
        }
        .collections-header p {
          font-size: 1.1rem;
          color: #666;
        }
        .category-tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
        }
        .category-tab {
          padding: 10px 20px;
          background: #f0f0f0;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
          color: #555;
        }
        .category-tab:hover {
          background: #e0e0e0;
        }
        .category-tab.active {
          background: #4a5568;
          color: white;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }
        .product-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          background: white;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        .product-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #e53e3e;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.8rem;
        }
        .product-details {
          padding: 15px;
        }
        .product-details h3 {
          margin: 0 0 5px 0;
          font-size: 1.1rem;
          color: #2d3748;
        }
        .product-category {
          color: #718096;
          font-size: 0.9rem;
          margin: 0 0 10px 0;
          text-transform: capitalize;
        }
        .product-description {
          color: #4a5568;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 15px;
        }
        .product-price {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        .current-price {
          font-weight: bold;
          font-size: 1.2rem;
          color: #2d3748;
          margin-right: 10px;
        }
        .original-price {
          color: #a0aec0;
          text-decoration: line-through;
          font-size: 1rem;
        }
        .view-product-btn {
          width: 100%;
          padding: 8px;
          background: #4a5568;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .view-product-btn:hover {
          background: #2d3748;
        }
        .loading, .no-products {
          text-align: center;
          padding: 50px 0;
          color: #718096;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  )
}

// Export as named export to match the import in App.jsx
export { Collections as CollectionItems }

// Keep the default export for future use
export default Collections
