import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiscountCount = () => {
  const [totalDiscounts, setTotalDiscounts] = useState(0);

  useEffect(() => {
    fetchDiscountCount();
  }, []);

  const fetchDiscountCount = () => {
    axios.get('http://localhost:3001/api/discountgames')
      .then((response) => {
        setTotalDiscounts(response.data.totalDiscounts);
      })
      .catch((error) => {
        console.error('Error fetching discount count:', error);
      });
  };

  return (
    <div className="discount-count-container">
      <div className="discount-count-text">
        Currently <span className="highlight">{totalDiscounts}</span> game{totalDiscounts !== 1 ? 's' : ''} on discount
      </div>
    </div>
  );
};

export default DiscountCount;
