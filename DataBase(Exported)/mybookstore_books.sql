-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: mybookstore
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `is_deleted` bit(1) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  `version` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(1000) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `img_link` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (_binary '\0',15.99,9,64,1,'A story about the University of Washington\'s 1936 eight-oar crew and their epic quest for an Olympic gold medal.','Daniel James Brown','Other','../Images/TheBoysInTheBoat.jpg','The Boys in the Boat'),(_binary '\0',12.99,1,11,2,'Andre Agassi\'s brutally honest autobiography about his life and career in tennis.','Andre Agassi','Other','../Images/Open.jpg','Open'),(_binary '\0',13.99,9,72,3,'A gripping narrative about an epic adventure to discover the secrets of the Tarahumara Indians.','Christopher McDougall','Other','../Images/BornToRun.jpg','Born to Run'),(_binary '\0',16.99,7,14,4,'Memoir by the creator of Nike, detailing the company\'s early days and its evolution into a global brand.','Phil Knight','Other','../Images/ShoeDog.jpg','Shoe Dog'),(_binary '\0',14.99,3,1,5,'The incredible story of Louis Zamperini, a World War II bombardier and former Olympic runner.','Laura Hillenbrand','Other','../Images/Unbroken.jpg','Unbroken'),(_binary '\0',11.99,4,1,6,'The story of a high school football team in Texas and its impact on the community.','H.G. Bissinger','Other','../Images/FridayNightLights.jpg','Friday Night Lights'),(_binary '\0',14.99,2,0,7,'The true story of three men and a racehorse that captivated the nation.','Laura Hillenbrand','Other','../Images/Seabiscuit.jpg','Seabiscuit'),(_binary '\0',12.99,12,18,8,'The story of the Oakland A\'s and their revolutionary approach to baseball.','Michael Lewis','Other','../Images/Moneyball.jpg','Moneyball'),(_binary '\0',10.99,2,1,9,'A novel about baseball, friendship, and the challenges of growing up.','Chad Harbach','Other','../Images/TheArtOfFielding.jpg','The Art of Fielding'),(_binary '\0',17.99,0,1,10,'Insights and stories from the legendary golfer, Arnold Palmer.','Arnold Palmer','Other','../Images/ALifeWellPlayed.jpg','A Life Well Played'),(_binary '\0',18.99,2,2,11,'A biography of Vince Lombardi, one of football\'s greatest coaches.','David Maraniss','Other','../Images/WhenPrideStillMattered.jpg','When Pride Still Mattered'),(_binary '\0',14.99,1,2,12,'An inside look at Michael Jordan and the Chicago Bulls\' first championship season.','Sam Smith','Other','../Images/TheJordanRules.jpg','The Jordan Rules'),(_binary '\0',24.99,20,1,13,'Kobe Bryant\'s personal perspective on his approach to basketball.','Kobe Bryant','Other','../Images/TheMambaMentality.jpg','The Mamba Mentality'),(_binary '\0',13.99,5,5,14,'The story of Michael Oher, a homeless boy who becomes an NFL star.','Michael Lewis','Other','../Images/TheBlindSide.jpg','The Blind Side'),(_binary '\0',16.99,4,0,15,'A biography of Michael Jordan and his impact on the world of basketball.','David Halberstam','Other','../Images/PlayingForKeeps.jpg','Playing for Keeps'),(_binary '\0',19.99,28,32,16,'An account of the 2008 U.S. presidential election, likened to a sports contest.','John Heilemann and Mark Halperin','Other','../Images/RaceOfALifeTime.jpg','Race of a Lifetime'),(_binary '\0',14.99,22,0,17,'The autobiography of Swedish soccer star Zlatan Ibrahimovic.','Zlatan Ibrahimovic','Football','../Images/IAmZlatanIbrahimovic.jpg','I Am Zlatan Ibrahimovic'),(_binary '\0',15.99,15,0,18,'Phil Jackson\'s journey and insights from winning eleven NBA championships.','Phil Jackson','Football','../Images/ElevenRings.jpg','Eleven Rings'),(_binary '\0',12.99,16,37,19,'A reflective look at hockey and life by Hall of Fame goaltender Ken Dryden.','Ken Dryden','Other','../Images/TheGame.jpg','The Game'),(_binary '\0',17.99,50,0,20,'The autobiography of English football legend Kevin Keegan.','Kevin Keegan','Football','../Images/MyLifeInFootball.jpg','My Life in Football'),(_binary '\0',16.99,8,0,21,'An in-depth look at the life and career of Cristiano Ronaldo, one of the greatest soccer players of all time.','Guillem Balague','Football','../Images/CristianoRonaldo.jpg','Cristiano Ronaldo: The Biography'),(_binary '\0',14.99,53,2,22,'A detailed biography of Lionel Messi, chronicling his journey from a young boy in Argentina to a global soccer superstar.','Luca Caioli','Football','../Images/Messi.jpg','Messi: The Inside Story of the Boy Who Became a Legend'),(_binary '\0',12.99,441,0,23,'Neymar\'s own account of his life and career, co-written with his father.','Neymar Jr. and Mauro Beting','Football','../Images/Neymar.jpg','Neymar: My Story: Conversations with My Father'),(_binary '\0',17.99,5,0,24,'The life story of Luka Modrić, from his early years in war-torn Croatia to becoming one of the world\'s best midfielders and winning the Ballon d\'Or.','Luka Modrić','Football','../Images/LukaModric.jpg','Luka Modrić: My Autobiography'),(_binary '',13.99,0,24,25,'\"\'It’s time to shine,’ Paul said to himself as he walked out of the tunnel and onto to the Old Trafford pitch.\"  Pogba tells the exciting story of how French wonder-kid Paul Pogba became Europe’s best young player, and finally fulfilled his dream of returning to his boyhood club Manchester United in a world-record transfer. The sky is the limit for United’s new star.','Matt & Tom Oldfield','Football','../Images/Pogba.jpg','Pogba');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-19  0:27:24
