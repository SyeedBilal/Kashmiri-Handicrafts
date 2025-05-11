import React from 'react';
import { useSelector } from 'react-redux';
import Products from './Products';
import Fetchdata from '../components/common/fetchdata';

const ProductPage = () => {
  const items = useSelector((state) => state.items);


  return (<>
  
        <Fetchdata />
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">
        Kashmir Handicrafts Collection
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {items.map((item) => (
          <Products item={item} key={item._id} />
        ))}
      </div>
    </div>
    </>
  );
};

export default ProductPage;