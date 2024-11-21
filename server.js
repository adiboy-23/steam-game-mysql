const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); 

const app = express();
const port = process.env.PORT || 3001; 

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'kadian123',
  database: 'ajay',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Fetch all genres
app.get('/api/genres', (req, res) => {
  const genres = [
    { GenreId: '301', GenreName: 'Action' },
    { GenreId: '302', GenreName: 'Adventure' },
    { GenreId: '303', GenreName: 'Shooter' },
    { GenreId: '304', GenreName: 'Role-Playing' },
    { GenreId: '307', GenreName: 'Sports' },
    { GenreId: '308', GenreName: 'Racing' },
    { GenreId: '309', GenreName: 'Puzzle' },
    { GenreId: '310', GenreName: 'Fighting' },
    { GenreId: '311', GenreName: 'Survival' },
    { GenreId: '313', GenreName: 'Open World' },
    { GenreId: '315', GenreName: 'MMORPG' },
  ];
  

  res.json(genres);
});

// Fetch all games with their genres
app.get('/api/games', (req, res) => {
  db.query('SELECT Game.*, Genre.GenreName FROM Game JOIN Genre ON Game.GenreId = Genre.GenreId', (err, results) => {
    if (err) {
      console.error('Error fetching games:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/game', (req, res) => {
  const { gameId } = req.query; // Expect gameId as a query parameter
  console.log(req)

  if (!gameId) {
    return res.status(400).json({ error: 'GameId is required' });
  }

  //  NESTED QUERY

  const query = `
  SELECT 
      Game.*,
      (SELECT GenreName 
       FROM Genre 
       WHERE Genre.GenreId = Game.GenreId) AS GenreName
  FROM Game 
  WHERE Game.GameId = ?`;


  db.query(query, [gameId], (err, results) => {
    if (err) {
      console.error('Error fetching game:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(results[0]); // Return the game object
  });
});


  
app.post('/api/ownedgame', (req, res) => {
  const { userId, gameId, date } = req.body;

  // Validate if all required details are present
  if (!userId || !gameId || !date) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Insert the purchase details into the ownedgame table
  const query = `INSERT INTO ownedgames (UserId, GameId, PurchaseDate) VALUES (?, ?, ?)`;

  db.query(query, [userId, gameId, date], (err, result) => {
    if (err) {
      // Log the error to check for details
      console.error('Error inserting into ownedgame:', err);
      
      // If the error is raised by the trigger, send custom error message
      if (err.code === 'ER_SIGNAL_EXCEPTION') {
        return res.status(400).json({ success: false, sqlState: '45000', message: 'You already own this game!' });
      }

      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    // Send a success response if the insertion was successful
    if (result.affectedRows > 0) {
      return res.json({ success: true });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to add the game to the owned games list' });
    }
  });
});



// Example: Fetching owned games for a specific user from MySQL
app.get('/api/ownedgames/:userId', (req, res) => {
  const { userId } = req.params;

  // SQL query to get owned games for the specific user
  const query = 'SELECT g.GameId, g.GameName FROM game g JOIN ownedgames o ON g.GameId = o.GameId WHERE o.UserId = ?';

  // Use your MySQL database connection to query
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching owned games:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }

    if (results.length > 0) {
      res.json(results); // Send the owned games as a response
    } else {
      res.status(404).json({ message: 'No owned games found for this user.' });
    }
  });
});


// Add a new game
// Add a new game


// Associate a game with a developer
app.post('/api/developergame', (req, res) => {
  console.log('Received request to /api/developergame');
  const { DeveloperId, GameId } = req.body;

  db.query('INSERT INTO developergame (DeveloperId, GameId) VALUES (?, ?)', [DeveloperId, GameId], (err, results) => {
    if (err) {
      console.error('Error updating developergame table:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Associate a game with a publisher
app.post('/api/publishergame', (req, res) => {
  console.log('Received request to /api/publishergame');
  const { PublisherId, GameId } = req.body;

  db.query('INSERT INTO publishergame (PublisherId, GameId) VALUES (?, ?)', [PublisherId, GameId], (err, results) => {
    if (err) {
      console.error('Error updating publishergame table:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

// User sign-in
app.post('/api/signin', (req, res) => {
  const { UserId, Password, UserType } = req.body;

  db.query(
    'SELECT * FROM login WHERE UserId = ? AND Password = ? AND UserType = ?',
    [UserId, Password, UserType],
    (err, results) => {
      if (err) {
        console.error('Error during sign-in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length > 0) {
          res.json({ success: true });
        } else {
          res.json({ success: false, error: 'Invalid credentials' });
        }
      }
    }
  );
});

// Update a game
// Update a game
app.put('/api/games/:GameId', (req, res) => {
  const gameId = req.params.GameId;

  // Check if the game exists before trying to update
  db.query('SELECT * FROM Game WHERE GameId = ?', [gameId], (err, results) => {
    if (err) {
      console.error('Error checking GameId:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      // If the game doesn't exist, return an error
      console.log(`GameId ${gameId} does not exist`);
      res.status(404).json({ error: 'GameId does not exist' });
    } else {
      // If the game exists, proceed with the update
      try {
        db.query('UPDATE Game SET Size = ?, GenreId = ? WHERE GameId = ?', 
          [req.body.Size, req.body.GenreId, gameId], 
          (err, updateResults) => {
            if (err) {
              console.error('Error updating the game:', err);

              // If error comes from trigger or SQL, send an error message
              if (err.code === 'ER_SIGNAL_EXCEPTION') {
                // Custom error from trigger
                res.status(403).json({ error: err.message });
              } else {
                res.status(500).json({ error: 'Internal Server Error' });
              }
            } else {
              res.json({ success: true });
            }
          });
      } catch (error) {
        console.error('Error handling trigger exception:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  });
});


// Delete a game
app.delete('/api/games/:GameId', (req, res) => {
  const gameId = req.params.GameId;

  // Check if GameId exists
  db.query('SELECT * FROM Game WHERE GameId = ?', [gameId], (err, results) => {
    if (err) {
      console.error('Error checking GameId:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      // If no results, log and return a response
      console.log(`GameId ${gameId} does not exist`);
      res.status(404).json({ error: 'Game does not exist!' });
    } else {
      // Proceed with deletion if GameId exists
      db.query('DELETE FROM Game WHERE GameId = ?', [gameId], (err, deleteResults) => {
        if (err) {
          // Check if it's the custom error message from the trigger (SQLSTATE 45000)
          if (err.code === '45000') {
            // Return the error message from the trigger
            console.error('Error from trigger:', err.sqlMessage);
            res.status(400).json({ error: err.sqlMessage });
          } else {
            // Handle other errors
            console.error('Error deleting the game:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        } else {
          console.log(`GameId ${gameId} deleted successfully`);
          res.json({ success: true });
        }
      });
    }
  });
});


// Add this new endpoint
// procedure call for fetching games of the developer

app.get('/api/developergames/:developerId', (req, res) => {
  const developerId = req.params.developerId;

  const callProcedure = `CALL GetDeveloperGames(?)`;

  db.query(callProcedure, [developerId], (err, results) => {
    if (err) {
      console.error('Error fetching developer games:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // First result set contains game details, second contains total count
    const games = results[0]; // Game details
    const totalGames = results[1][0].totalGames; // Game count

    res.json({
      games: games,
      totalGames: totalGames
    });
  });
});


// Add this new endpoint for discount games
// nested query

app.get('/api/discountgames', (req, res) => {
  const query = `
    SELECT g.GameId, g.GameName, g.Size, g.ReleaseDate, g.Rating, gr.GenreName,
           d.DiscountPercentage, d.StartDate, d.EndDate,
           (SELECT COUNT(*) FROM Discount WHERE EndDate >= CURDATE()) as discountCount
    FROM Game g
    JOIN Discount d ON g.GameId = d.GameId
    LEFT JOIN Genre gr ON g.GenreId = gr.GenreId
    WHERE d.EndDate >= CURDATE();
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching discount games:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Extract total discounts from one of the rows (all rows will have the same value for `discountCount`)
    const totalDiscounts = results.length > 0 ? results[0].discountCount : 0;

    // Remove the `discountCount` field from individual game objects
    const games = results.map(({ discountCount, ...game }) => game);

    res.json({
      games: games,
      totalDiscounts: totalDiscounts
    });
  });
});

// Add this endpoint to get the next available ID
app.get('/api/nextId/:userType', (req, res) => {
  const userType = req.params.userType;
  
  const query = 'SELECT MAX(UserId) as maxId FROM login WHERE UserType = ?';
  
  db.query(query, [userType], (err, results) => {
    if (err) {
      console.error('Error getting next ID:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    let nextId;
    const maxId = results[0].maxId;
    
    if (!maxId) {
      // If no existing users of this type, start with base number
      switch(userType) {
        case 'User':
          nextId = 101;
          break;
        case 'Developer':
          nextId = 201;
          break;
        case 'Publisher':
          nextId = 301;
          break;
        default:
          nextId = 101;
      }
    } else {
      nextId = maxId + 1;
    }

    res.json({ nextId });
  });
});

// Update the register endpoint
app.post('/api/register', (req, res) => {
  const { userId, userName, password, userType } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Insert into login table
    const query = 'INSERT INTO login (UserId, UserName, Password, UserType) VALUES (?, ?, ?, ?)';
    
    db.query(query, [userId, userName, password, userType], (err, results) => {
      if (err) {
        db.rollback(() => {
          console.error('Error during registration:', err);
          res.status(400).json({ 
            error: err.code === 'ER_DUP_ENTRY' 
              ? 'User ID or Username already exists' 
              : 'Registration failed' 
          });
        });
        return;
      }

      // If successful, commit the transaction
      db.commit((err) => {
        if (err) {
          db.rollback(() => {
            console.error('Error committing transaction:', err);
            res.status(500).json({ error: 'Registration failed' });
          });
          return;
        }
        res.json({ 
          success: true,
          message: `Registration successful! Your User ID is: ${userId}`
        });
      });
    });
  });
});

app.post('/api/games', (req, res) => {
  const { GameName, ReleaseDate, Size, Price, PublisherId, DeveloperId, GenreId, Rating } = req.body;

  db.query(
    'INSERT INTO Game (GameName, ReleaseDate, Size, Price, PublisherId, DeveloperId, GenreId, Rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [GameName, ReleaseDate, Size, Price, PublisherId, DeveloperId, GenreId, Rating],
    (err, results) => {
      if (err) {
        console.error('Error adding a new game:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('New game added with GameId:', results.insertId);
        res.json({ success: true, insertId: results.insertId }); // Send back the insertId
      }
    }
  );
});



// // Associate a game with a publisher and simulate a trigger to associate with a developer
// app.post('/api/publishergame', (req, res) => {
//   console.log('Received request to /api/publishergame');
//   const { PublisherId, GameId } = req.body;

//   db.beginTransaction((err) => {
//     if (err) {
//       console.error('Error starting transaction:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }

//     // Insert into publishergame table
//     db.query('INSERT INTO publishergame (PublisherId, GameId) VALUES (?, ?)', [PublisherId, GameId], (err, results) => {
//       if (err) {
//         console.error('Error updating publishergame table:', err);
//         db.rollback(() => {
//           res.status(500).json({ error: 'Internal Server Error' });
//         });
//       } else {
//         db.query('SELECT DeveloperId FROM Game WHERE GameId = ?', [GameId], (err, developerResults) => {
//           if (err) {
//             console.error('Error fetching DeveloperId:', err);
//             db.rollback(() => {
//               res.status(500).json({ error: 'Internal Server Error' });
//             });
//           } else {
//             const DeveloperId = developerResults[0].DeveloperId;
//             db.query('INSERT INTO developergame (DeveloperId, GameId) VALUES (?, ?)', [DeveloperId, GameId], (err, results) => {
//               if (err) {
//                 console.error('Error updating developergame table:', err);
//                 db.rollback(() => {
//                   res.status(500).json({ error: 'Internal Server Error' });
//                 });
//               } else {
//                 // Commit the transaction
//                 db.commit((err) => {
//                   if (err) {
//                     console.error('Error committing transaction:', err);
//                     db.rollback(() => {
//                       res.status(500).json({ error: 'Internal Server Error' });
//                     });
//                   } else {
//                     res.json({ success: true });
//                   }
//                 });
//               }
//             });
//           }
//         });
//       }
//     });
//   });
// });

// Serve the main 'index.html' file for all routes
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
