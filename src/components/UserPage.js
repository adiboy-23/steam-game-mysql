import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css'; // Import the CSS file

const UserPage = () => {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [gameDetails, setGameDetails] = useState(null);
  const [sysReq, setSysReq] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [ownedGames, setOwnedGames] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isOwnedGame, setIsOwnedGame] = useState(false); // State for checking if the game is owned

  const hardcodedSysReq = {
    OS: "Windows 10",
    Storage: "50GB",
    RAM: "8GB",
  };
  


  useEffect(() => {
    // Fetch the list of games when the component mounts
    axios.get('http://localhost:3001/api/games')
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.error('Error fetching games:', error);
      });
  }, []);

  const handleLogin = () => {
    const authenticationEndpoint = 'http://localhost:3001/api/signin';

    axios.post(authenticationEndpoint, {
      UserId: userId,
      Password: password,
      UserType: 'User',
    })
      .then((response) => {
        if (response.data.success) {
          setIsLoggedIn(true);
        } else {
          alert('Invalid credentials. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error during authentication:', error);
        alert('Error during authentication. Please try again.');
      });
  };

  const handleSysReq = (gameId) => {
    axios.get(`http://localhost:3001/api/sysreq/${gameId}`)
      .then((response) => {
        setSysReq(response.data);
      })
      .catch((error) => {
        console.error('Error fetching system requirements:', error);
      });
  };

  const handleGameDetails = (gameId) => {
    axios.get(`http://localhost:3001/api/gameDetails/${gameId}`)
      .then((response) => {
        setGameDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching game details:', error);
      });
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setSelectedGameId(game.GameId);
    setSysReq(null);

    axios
      .get(`http://localhost:3001/api/game`, {
        params: {
          gameId: game.GameId, // Pass gameId as a query parameter
        },
      })
      .then((response) => {
        setGameDetails(response.data); // Set game details from response
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching game details:', error);
      });
  };
  

  const handleBuyClick = (gameId) => {
    // Check if the user already owns the game
    const alreadyOwnsGame = ownedGames.some(game => game.GameId === gameId);
  
    if (alreadyOwnsGame) {
      // If the user already owns the game, show a message
      alert("You already own this game!");
    } else {
      // Otherwise, show the buy form
      setShowBuyForm(true);
    }
  };
  


  const handlePaymentChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleBuySubmit = () => {
    if (paymentDetails.cardNumber && paymentDetails.expiryDate && paymentDetails.cvv) {
      const purchaseDetails = {
        userId: userId,
        gameId: selectedGameId,
        date: new Date().toISOString().slice(0, 10), // Current date in YYYY-MM-DD format
      };
  
      axios.post('http://localhost:3001/api/ownedgame', purchaseDetails)
        .then((response) => {
          if (response.data.success) {
            alert('Payment successful! The game has been added to your owned games.');
            setShowBuyForm(false);
          }
        })
        .catch((error) => {
          // console.log('Error Response:', error.response);
          // console.log('Error Message:', error.response ? error.response.data.message : 'No response data');

          // TRIGGER FOR CHECKING IF ALREADY OWN THIS GAME
          if (error.response && error.response.data.sqlState === '45000') {
            alert('You already owned this game!');
          } else {
            alert('error');
          }
        });
    } else {
      alert('Please provide valid payment details.');
    }
  };
  
  
  

  // New function to fetch owned games
  const handleShowOwnedGames = () => {
    if (!isVisible) {
      // Fetch owned games only if not already visible
      axios.get(`http://localhost:3001/api/ownedgames/${userId}`)
        .then((response) => {
          setOwnedGames(response.data); // Set owned games from the backend response
        })
        .catch((error) => {
          console.error('Error fetching owned games:', error);
          alert('YOU DIDNT OWN ANY GAME KINDLY PURCHASE');
        });
    }
  
    // Toggle visibility
    setIsVisible(!isVisible);
  };
  

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1 className="header">Login</h1>
        <label>
          User ID:
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="header">Welcome User!{userId}</h1>

      

      {/* Display the list of games */}
      <ul>
        {games.map((game) => (
          <li key={game.GameId}>
            {game.GameName}
            <button onClick={() => handleGameClick(game)}>View Details</button>
          </li>
        ))}
      </ul>

      {/* Display details of the selected game */}
      {selectedGame && (
        <div className="selected-game">
          <h2>{selectedGame.GameName}</h2>
          <p>System Requirements:</p>

           
            <div className="sys-req">
            <h3>System Requirements</h3>
            <table>
              <thead>
                <tr>
                  <th>OS</th>
                  <th>Storage</th>
                  <th>RAM</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{hardcodedSysReq.OS}</td>
                  <td>{hardcodedSysReq.Storage}</td>
                  <td>{hardcodedSysReq.RAM}</td>
                  <td>{gameDetails?.Price}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          
              <div>
            <button onClick={handleBuyClick}>Buy</button>
          </div>
        </div>
      )}

      {/* Buy Form */}
      {showBuyForm && selectedGame && (
        <div className="buy-form">
          <h3>Buy {selectedGame.GameName}</h3>
          <label>
            Card Number:
            <input type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} placeholder="1234 5678 9012" />
          </label>
          <label>
            Expiry Date:
            <input type="text" name="expiryDate" value={paymentDetails.expiryDate} onChange={handlePaymentChange} placeholder="MM/YY" />
          </label>
          <label>
            CVV:
            <input type="text" name="cvv" value={paymentDetails.cvv} onChange={handlePaymentChange} placeholder="123" />
          </label>
          <button onClick={handleBuySubmit}>Submit</button>
        </div>
      )}

<button onClick={handleShowOwnedGames}>Show Owned Games</button>

{/* Display owned games if available */}
{ownedGames.length > 0 && (
  <div className="owned-games">
    <h2>Your Owned Games</h2>
    <ul>
      {ownedGames.map((game) => (
        <li key={game.GameId}>
          {game.GameName}
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
    

  );
  
};

export default UserPage;
