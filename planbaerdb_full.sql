/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for osx10.20 (arm64)
--
-- Host: 192.168.178.72    Database: planbaerdb
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `m_position`
--

DROP TABLE IF EXISTS `m_position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_position` (
  `positionsid` int(11) NOT NULL AUTO_INCREMENT,
  `position` varchar(50) NOT NULL,
  PRIMARY KEY (`positionsid`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_position`
--

LOCK TABLES `m_position` WRITE;
/*!40000 ALTER TABLE `m_position` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `m_position` VALUES
(1,'Leitung / Kitaleitung'),
(2,'Stellvertretende Leitung'),
(3,'Erzieher/in'),
(4,'Kinderpfleger/in'),
(5,'Fachkraft für Inklusion / Heilpädagogik'),
(6,'Praktikant/in / FSJ / BFD'),
(7,'Sprachförderkraft / Logopäde'),
(8,'Musikpädagogik / Kunstpädagogik'),
(9,'Therapeutische Fachkraft'),
(10,'Verwaltungsmitarbeitende/in'),
(11,'Hausmeister/in'),
(12,'Küchenpersonal / Koch/Köchin'),
(13,'Reinigungskraft');
/*!40000 ALTER TABLE `m_position` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `m_stamm`
--

DROP TABLE IF EXISTS `m_stamm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_stamm` (
  `stammid` int(11) NOT NULL AUTO_INCREMENT,
  `nachname` varchar(50) NOT NULL,
  `vorname` varchar(50) DEFAULT NULL,
  `mail` varchar(100) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `tel_p` varchar(20) DEFAULT NULL,
  `geburtstag` date DEFAULT NULL,
  `strasse` varchar(50) DEFAULT NULL,
  `nr` varchar(10) DEFAULT NULL,
  `plz` int(11) DEFAULT NULL,
  `ort` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`stammid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_stamm`
--

LOCK TABLES `m_stamm` WRITE;
/*!40000 ALTER TABLE `m_stamm` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `m_stamm` VALUES
(1,'Müller','Anna','anna.mueller@example.com','492211234567','491512345678','1985-03-12','Hauptstrasse','12A',50667,'Köln'),
(2,'Schmidt','Peter','peter.schmidt@example.com','492211234568','491512345679','1978-07-05','Bahnhofstrasse','5',80331,'München'),
(3,'Fischer','Laura','laura.fischer@example.com','492211234569','491512345680','1990-11-20','Gartenweg','7',10115,'Berlin'),
(4,'Weber','Michael','michael.weber@example.com','492211234570','491512345681','1982-02-18','Lindenstrasse','3',40213,'Düsseldorf'),
(5,'Schneider','Julia','julia.schneider@example.com','492211234571','491512345682','1987-09-30','Ringstrasse','8',60311,'Frankfurt'),
(6,'Becker','Thomas','thomas.becker@example.com','492211234572','491512345683','1975-05-12','Parkweg','14',28195,'Bremen'),
(7,'Hoffmann','Sophie','sophie.hoffmann@example.com','492211234573','491512345684','1992-12-01','Wiesenweg','2',4109,'Leipzig'),
(8,'Schulz','Daniel','daniel.schulz@example.com','492211234574','491512345685','1980-08-22','Mozartstrasse','6',80333,'München'),
(9,'Klein','Emma','emma.klein@example.com','492211234575','491512345686','1995-01-15','Schillerstrasse','9',50670,'Köln'),
(10,'Wolf','Lukas','lukas.wolf@example.com','492211234576','491512345687','1989-06-10','Goethestrasse','11',70173,'Stuttgart');
/*!40000 ALTER TABLE `m_stamm` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `m_stamm_position`
--

DROP TABLE IF EXISTS `m_stamm_position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_stamm_position` (
  `stammid` int(11) NOT NULL,
  `positionSid` int(11) NOT NULL,
  PRIMARY KEY (`stammid`),
  KEY `positionSid` (`positionSid`),
  CONSTRAINT `m_stamm_position_ibfk_1` FOREIGN KEY (`stammid`) REFERENCES `m_stamm` (`stammid`) ON DELETE CASCADE,
  CONSTRAINT `m_stamm_position_ibfk_2` FOREIGN KEY (`positionSid`) REFERENCES `m_position` (`positionsid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_stamm_position`
--

LOCK TABLES `m_stamm_position` WRITE;
/*!40000 ALTER TABLE `m_stamm_position` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `m_stamm_position` VALUES
(1,1),
(7,1),
(2,2),
(8,2),
(3,3),
(9,3),
(4,4),
(10,4),
(5,5),
(6,6);
/*!40000 ALTER TABLE `m_stamm_position` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `m_stamm_status`
--

DROP TABLE IF EXISTS `m_stamm_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_stamm_status` (
  `stammid` int(11) NOT NULL,
  `statusid` int(11) NOT NULL,
  PRIMARY KEY (`stammid`),
  KEY `statusid` (`statusid`),
  CONSTRAINT `m_stamm_status_ibfk_1` FOREIGN KEY (`stammid`) REFERENCES `m_stamm` (`stammid`) ON DELETE CASCADE,
  CONSTRAINT `m_stamm_status_ibfk_2` FOREIGN KEY (`statusid`) REFERENCES `m_status` (`statusid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_stamm_status`
--

LOCK TABLES `m_stamm_status` WRITE;
/*!40000 ALTER TABLE `m_stamm_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `m_stamm_status` VALUES
(1,1),
(3,1),
(5,1),
(7,1),
(9,1),
(2,2),
(4,3),
(6,4),
(8,5),
(10,6);
/*!40000 ALTER TABLE `m_stamm_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `m_status`
--

DROP TABLE IF EXISTS `m_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_status` (
  `statusid` int(11) NOT NULL AUTO_INCREMENT,
  `beschreibung` varchar(50) NOT NULL,
  PRIMARY KEY (`statusid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_status`
--

LOCK TABLES `m_status` WRITE;
/*!40000 ALTER TABLE `m_status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `m_status` VALUES
(1,'aktiv'),
(2,'krank'),
(3,'Urlaub'),
(4,'abgemeldet'),
(5,'fehlt'),
(6,'Elternzeit / Mutterschutz'),
(7,'Fortbildung / Schulung'),
(8,'Sabbatical / Sonderurlaub'),
(9,'Probezeit'),
(10,'deaktiviert');
/*!40000 ALTER TABLE `m_status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `m_zeiten`
--

DROP TABLE IF EXISTS `m_zeiten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_zeiten` (
  `zeitid` int(11) NOT NULL AUTO_INCREMENT,
  `stammid` int(11) NOT NULL,
  `soll` decimal(4,2) NOT NULL,
  `team` decimal(4,2) NOT NULL DEFAULT 2.00,
  `vorbereitung` decimal(4,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`zeitid`),
  KEY `stammid` (`stammid`),
  CONSTRAINT `m_zeiten_ibfk_1` FOREIGN KEY (`stammid`) REFERENCES `m_stamm` (`stammid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_zeiten`
--

LOCK TABLES `m_zeiten` WRITE;
/*!40000 ALTER TABLE `m_zeiten` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `m_zeiten` VALUES
(1,1,40.00,2.00,4.00),
(2,2,38.00,2.00,3.80),
(3,3,36.00,2.00,3.60),
(4,4,35.00,2.00,0.00),
(5,5,30.00,2.00,3.00),
(6,6,32.00,2.00,3.20),
(7,7,28.00,2.00,0.00),
(8,8,37.00,2.00,3.70),
(9,9,34.00,2.00,3.40),
(10,10,40.00,2.00,4.00);
/*!40000 ALTER TABLE `m_zeiten` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-10-28 12:10:45
