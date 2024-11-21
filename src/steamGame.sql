DROP TABLE IF EXISTS `genre`;

CREATE TABLE `genre` (
  `GenreId` int DEFAULT NULL,
  `GenreName` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `genre` VALUES (301,'First-Person Shooter'),(302,'Racing'),(303,'Open World');



-- Table structure for table `game`
DROP TABLE IF EXISTS `game`;

CREATE TABLE `game` (
  `GameId` int NOT NULL AUTO_INCREMENT,
  `GameName` varchar(255) DEFAULT NULL,
  `Rating` float DEFAULT NULL,
  `ReleaseDate` date DEFAULT NULL,
  `Size` float DEFAULT NULL,
  `Price` Decimal(10,2) DEFAULT NULL,
  `PublisherId` int DEFAULT NULL,
  `DeveloperId` int DEFAULT NULL,
  `GenreId` int DEFAULT NULL,
  PRIMARY KEY (`GameId`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `game` VALUES 
(1, 'COD MW3', 4.5, '2023-01-01', 20, 59.99, 101, 201, 301),
(2, 'COD MW2', 3.8, '2023-02-15', 1024.5, 49.99, 102, 202, 302),
(3, 'COD 1', 4.2, '2023-03-20', 1024.5, 39.99, 103, 203, 303),
(4, 'COD 2', 4.1, '2023-04-05', 1024.5, 29.99, 104, 204, 304),
(5, 'COD 3', 4.7, '2023-05-10', 1024.5, 19.99, 105, 205, 305),
(6, 'COD 4', 4.3, '2023-06-15', 1024.5, 9.99, 106, 206, 306),
(7, 'Forza 5', 4.9, '2023-07-20', 1024.5, 69.99, 107, 207, 307),
(8, 'Forza 6', 4.6, '2023-08-25', 1024.5, 79.99, 108, 208, 308),
(9, 'GTA 5', 4.8, '2023-09-30', 1024.5, 89.99, 109, 209, 309),
(10, 'GTA 6', 4.4, '2023-10-15', 10, 99.99, 110, 210, 301),
(20, 'Batman', 5, '2023-11-04', 200, 29.99, 306, 201, 301),
(21, 'Batman2', 5, '2023-11-11', 10, 19.99, 302, 203, 303),
(22, 'Batman', 5, '2023-11-30', 1, 9.99, 301, 201, 301),
(23, 'car', 5, '2023-11-05', 15, 14.99, 301, 201, 301),
(24, 'Batman', 5, '2023-12-01', 12, 24.99, 103, 102, 302),
(25, 'chota bheem', 5, '2023-11-09', 10, 4.99, 301, 201, 301);

-- Table structure for table `developergame`

DROP TABLE IF EXISTS `developergame`;

CREATE TABLE developergame (
    DeveloperId int NOT NULL,
    GameId int NOT NULL,
    PRIMARY KEY (DeveloperId, GameId),
    KEY GameId (GameId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO developergame (DeveloperId, GameId) VALUES 
(201, 1),
(201, 2),
(202, 7),
(202, 8),
(203, 9),
(203, 10);

DROP TABLE IF EXISTS `publishergame`;

CREATE TABLE publishergame (
    PublisherId int NOT NULL,
    GameId int NOT NULL,
    PRIMARY KEY (PublisherId, GameId),
    KEY GameId (GameId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO publishergame (PublisherId, GameId) VALUES 
(101, 1),
(101, 2),
(102, 7),
(102, 8),
(103, 9),
(103, 10);



--
-- Table structure for table `genre`
--


DROP TABLE IF EXISTS `login`;CREATE TABLE `login` (
  `UserId` int NOT NULL,
  `UserName` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `UserType` enum('User','Publisher','Developer') NOT NULL,
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `login` VALUES (101,'user1','123','User'),(102,'user2','123','User'),(103,'user3','123','User'),(201,'dev1','123','Developer'),(202,'dev2','123','Developer'),(301,'pub1','123','Publisher');

--
--


DROP TABLE IF EXISTS `sysreq`;CREATE TABLE `sysreq` (
  `SysReqId` int NOT NULL,
  `GameId` int DEFAULT NULL,
  `OS` varchar(100) DEFAULT NULL,
  `Storage` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`SysReqId`),
  KEY `GameId` (`GameId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `sysreq` VALUES (1,1,'Windows 10','50 GB'),(2,2,'Windows 7','40 GB'),(3,3,'Windows 8','60 GB'),(4,7,'Windows 10','70 GB'),(5,8,'Windows 7','45 GB'),(6,9,'Windows 10','80 GB'),(7,10,'Windows 8','100 GB');

-- OWNED GAMES BY USER
CREATE TABLE OWNEDGAMES (
    UserId INT NOT NULL,
    GameId INT NOT NULL,
    PurchaseDate DATE NOT NULL,
    PRIMARY KEY (UserId, GameId),
    FOREIGN KEY (UserId) REFERENCES LOGIN(UserId) ON DELETE CASCADE,
    FOREIGN KEY (GameId) REFERENCES GAME(GameId) ON DELETE CASCADE
);


CREATE TABLE discount (
    DiscountId INT NOT NULL AUTO_INCREMENT,
    GameId INT,
    DiscountPercentage DECIMAL(5,2),
    StartDate DATE,
    EndDate DATE,
    PRIMARY KEY (DiscountId),
    FOREIGN KEY (GameId) REFERENCES game(GameId) ON DELETE CASCADE
);



DELIMITER $$

CREATE PROCEDURE GetDeveloperGames(
    IN devId INT
)
BEGIN
    CREATE TEMPORARY TABLE TempGames AS
    SELECT g.GameId, g.GameName, g.Size, g.ReleaseDate, g.Rating, gr.GenreName 
    FROM Game g
    JOIN developergame dg ON g.GameId = dg.GameId
    LEFT JOIN Genre gr ON g.GenreId = gr.GenreId
    WHERE dg.DeveloperId = devId;

    SELECT COUNT(*) AS gameCount
    INTO @gameCount
    FROM developergame
    WHERE DeveloperId = devId;

    SELECT * FROM TempGames;

    SELECT @gameCount AS totalGames;

    DROP TEMPORARY TABLE TempGames;
END$$



DELIMITER //

CREATE TRIGGER prevent_duplicate_ownership
BEFORE INSERT ON ownedgames
FOR EACH ROW
BEGIN
    DECLARE game_exists INT;

    -- Check if the user already owns the game
    SELECT COUNT(*) INTO game_exists
    FROM ownedgames
    WHERE UserId = NEW.UserId AND GameId = NEW.GameId;

    -- If the game is already owned, throw an error
    IF game_exists > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You already own this game!';
    END IF;
END;
//

DELIMITER ;




-- TRIGGER FOR THE DELETION GAME 
DELIMITER $$

CREATE TRIGGER after_game_delete
AFTER DELETE ON Game
FOR EACH ROW
BEGIN
    DELETE FROM developergame WHERE GameId = OLD.GameId;
    DELETE FROM publishergame WHERE GameId = OLD.GameId;
END$$

DELIMITER ;


-- trigger for deletion of game which doestn exist
DELIMITER $$

CREATE TRIGGER before_game_delete
BEFORE DELETE ON game
FOR EACH ROW
BEGIN
    -- Check if the game exists
    DECLARE game_exists INT;
    SELECT COUNT(*) INTO game_exists FROM game WHERE GameId = OLD.GameId;

    -- Log and prevent deletion if the game doesn't exist
    IF game_exists = 0 THEN
        INSERT INTO failed_deletions_log (AttemptedGameId, ErrorMessage)
        VALUES (OLD.GameId, 'Game does not exist.');
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Game does not exist !';
    END IF;
END $$

DELIMITER ;


