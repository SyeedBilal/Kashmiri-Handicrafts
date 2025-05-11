import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { itemsActions } from '../../store/Slices/itemsSlice';


const Fetchdata = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('http://localhost:3000/api/products', { signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        dispatch(itemsActions.addItem(data));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [dispatch]);

}

export default Fetchdata;