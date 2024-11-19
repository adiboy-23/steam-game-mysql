import React, { useState, useEffect } from 'react';
import axios from 'axios';
import gameImages from '../utils/gameImages';
import './DiscountPage.css';

const DiscountPage = () => {
  const [discountGames, setDiscountGames] = useState([]);
  const [totalDiscounts, setTotalDiscounts] = useState(0);

  useEffect(() => {
    fetchDiscountGames();
  }, []);

  const fetchDiscountGames = () => {
    axios.get('http://localhost:3001/api/discountgames')
      .then((response) => {
        console.log('Discount Games Response:', response.data);
        setDiscountGames(response.data.games);
        setTotalDiscounts(response.data.totalDiscounts);
      })
      .catch((error) => {
        console.error('Error fetching discount games:', error);
      });
  };

  return (
    <div className="discount-page-container">
      <div className="discount-header">
        <h2>Games on Discount</h2>
        <div className="discount-count">
          Currently <span className="highlight">{totalDiscounts}</span> game{totalDiscounts !== 1 ? 's' : ''} on discount
        </div>
      </div>

      <div className="discount-games-grid">
        {discountGames.map((game) => {
          const imageKey = `${game.GameId}`;
          return (
            <div key={game.GameId} className="discount-game-card">
              <img 
                src={gameImages[imageKey] || '/placeholder-game.jpg'} 
                alt={game.GameName}
                className="game-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-game.jpg';
                }}
              />
              <div className="game-info">
                <h3>{game.GameName}</h3>
                <p>Genre: {game.GenreName}</p>
                <p>Discount: {game.DiscountPercentage}% OFF</p>
                <p>Valid until: {new Date(game.EndDate).toLocaleDateString()}</p>
                <p>Rating: {game.Rating}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscountPage;
