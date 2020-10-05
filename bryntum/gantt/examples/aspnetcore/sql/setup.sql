-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bryntum_gantt
-- ------------------------------------------------------
-- Server version	8.0.19

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
-- Table structure for table `Assignments`
--

DROP TABLE IF EXISTS `Assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Assignments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TaskId` int NOT NULL,
  `ResourceId` int NOT NULL,
  `Units` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Assignments_Resources` (`ResourceId`),
  KEY `FK_Assignments_Tasks` (`TaskId`),
  CONSTRAINT `FK_Assignments_Resources` FOREIGN KEY (`ResourceId`) REFERENCES `Resources` (`Id`),
  CONSTRAINT `FK_Assignments_Tasks` FOREIGN KEY (`TaskId`) REFERENCES `Tasks` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Assignments`
--

LOCK TABLES `Assignments` WRITE;
/*!40000 ALTER TABLE `Assignments` DISABLE KEYS */;
INSERT INTO `Assignments` VALUES
 (1,4,1,50),
 (2,4,2,50);
/*!40000 ALTER TABLE `Assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CalendarIntervals`
--

DROP TABLE IF EXISTS `CalendarIntervals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CalendarIntervals` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CalendarId` int NOT NULL,
  `RecurrentStartDate` varchar(255) DEFAULT NULL,
  `RecurrentEndDate` varchar(255) DEFAULT NULL,
  `StartDate` datetime(6) DEFAULT NULL,
  `EndDate` datetime(6) DEFAULT NULL,
  `IsWorking` tinyint unsigned DEFAULT '0',
  `Cls` varchar(55) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_CalendarIntervals_Calendars` (`CalendarId`),
  CONSTRAINT `FK_CalendarIntervals_Calendars` FOREIGN KEY (`CalendarId`) REFERENCES `Calendars` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CalendarIntervals`
--

LOCK TABLES `CalendarIntervals` WRITE;
/*!40000 ALTER TABLE `CalendarIntervals` DISABLE KEYS */;
INSERT INTO `CalendarIntervals` VALUES
 (1,1,NULL,NULL,'2010-01-14 00:00:00.000000','2010-01-15 00:00:00.000000',0,NULL),
 (2,1,NULL,NULL,'2012-10-20 00:00:00.000000','2012-10-21 00:00:00.000000',1,NULL),
 (3,2,NULL,NULL,'2010-01-13 00:00:00.000000','2010-01-14 00:00:00.000000',0,NULL),
 (4,2,NULL,NULL,'2010-02-01 00:00:00.000000','2010-02-02 00:00:00.000000',0,NULL),
 (5,2,NULL,NULL,'2010-12-01 00:00:00.000000','2010-12-02 00:00:00.000000',0,NULL),
 (6,2,NULL,NULL,'2012-03-27 08:00:00.000000','2012-03-27 12:00:00.000000',1,NULL),
 (7,2,NULL,NULL,'2012-03-25 00:00:00.000000','2012-03-26 08:00:00.000000',0,NULL),
 (8,2,NULL,NULL,'2012-03-26 12:00:00.000000','2012-03-27 13:00:00.000000',0,NULL),
 (9,2,NULL,NULL,'2012-03-27 15:00:00.000000','2012-03-29 08:00:00.000000',0,NULL),
 (10,2,NULL,NULL,'2012-03-29 12:00:00.000000','2012-03-31 00:00:00.000000',0,NULL),
 (11,2,NULL,NULL,'2012-02-25 00:00:00.000000','2012-02-26 08:00:00.000000',0,NULL),
 (12,2,NULL,NULL,'2012-02-26 12:00:00.000000','2012-02-27 13:00:00.000000',0,NULL),
 (13,2,NULL,NULL,'2012-02-27 15:00:00.000000','2012-02-28 00:00:00.000000',0,NULL),
 (14,1,'on Sat at 0:00','on Mon at 0:00',NULL,NULL,0,NULL),
 (15,1,'every weekday at 12:00','every weekday at 13:00',NULL,NULL,0,NULL),
 (16,1,'every weekday at 17:00','every weekday at 08:00',NULL,NULL,0,NULL),
 (17,2,'on Sat at 0:00','on Mon at 0:00',NULL,NULL,0,NULL),
 (18,2,'every weekday at 12:00','every weekday at 13:00',NULL,NULL,0,NULL),
 (19,2,'every weekday at 17:00','every weekday at 08:00',NULL,NULL,0,NULL),
 (20,3,'on Sat at 0:00','on Mon at 0:00',NULL,NULL,0,NULL),
 (21,3,'every weekday at 12:00','every weekday at 13:00',NULL,NULL,0,NULL),
 (22,3,'every weekday at 17:00','every weekday at 08:00',NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `CalendarIntervals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Calendars`
--

DROP TABLE IF EXISTS `Calendars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Calendars` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ParentId` int DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DaysPerMonth` int DEFAULT NULL,
  `DaysPerWeek` int DEFAULT NULL,
  `HoursPerDay` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Calendars_Calendars` (`ParentId`),
  CONSTRAINT `FK_Calendars_Calendars` FOREIGN KEY (`ParentId`) REFERENCES `Calendars` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Calendars`
--

LOCK TABLES `Calendars` WRITE;
/*!40000 ALTER TABLE `Calendars` DISABLE KEYS */;
INSERT INTO `Calendars` VALUES
 (1,NULL,'General',20,5,8),
 (2,1,'Holidays',20,5,8),
 (3,NULL,'Night shift',20,5,8);
/*!40000 ALTER TABLE `Calendars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Dependencies`
--

DROP TABLE IF EXISTS `Dependencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Dependencies` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FromId` int NOT NULL,
  `ToId` int NOT NULL,
  `Typ` int DEFAULT NULL,
  `Cls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Lag` decimal(18,2) DEFAULT NULL,
  `LagUnit` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'd',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dependencies`
--

LOCK TABLES `Dependencies` WRITE;
/*!40000 ALTER TABLE `Dependencies` DISABLE KEYS */;
INSERT INTO `Dependencies` VALUES
 (1,8,9,2,'',0.00,'d'),
 (2,13,14,2,'',0.00,'d'),
 (3,14,15,2,'',0.00,'d'),
 (4,16,17,0,'',0.00,'d'),
 (5,15,16,0,'',0.00,'d'),
 (6,17,18,2,'',0.00,'d'),
 (7,7,3,2,'',0.00,'d'),
 (8,7,18,2,'',0.00,'d'),
 (9,10,11,2,'',0.00,'d'),
 (10,11,12,0,'',0.00,'d'),
 (11,12,13,2,'',0.00,'day');
/*!40000 ALTER TABLE `Dependencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Options`
--

DROP TABLE IF EXISTS `Options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Options` (
  `name` varchar(45) NOT NULL,
  `value` varchar(45) DEFAULT NULL,
  `dt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Options`
--

LOCK TABLES `Options` WRITE;
/*!40000 ALTER TABLE `Options` DISABLE KEYS */;
INSERT INTO `Options` VALUES
 ('projectCalendar','1',NULL),
 ('revision','3',NULL);
/*!40000 ALTER TABLE `Options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Resources`
--

DROP TABLE IF EXISTS `Resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Resources` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CalendarId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Resources_Calendars` (`CalendarId`),
  CONSTRAINT `FK_Resources_Calendars` FOREIGN KEY (`CalendarId`) REFERENCES `Calendars` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Resources`
--

LOCK TABLES `Resources` WRITE;
/*!40000 ALTER TABLE `Resources` DISABLE KEYS */;
INSERT INTO `Resources` VALUES
 (1,'Mats',NULL),
 (2,'Nickolay',NULL),
 (3,'Goran',NULL),
 (4,'Dan',NULL),
 (5,'Jake',NULL),
 (6,'Kim',NULL);
/*!40000 ALTER TABLE `Resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TaskSegments`
--

DROP TABLE IF EXISTS `TaskSegments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TaskSegments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TaskId` int NOT NULL,
  `StartDate` datetime(6) NOT NULL,
  `EndDate` datetime(6) DEFAULT NULL,
  `Duration` decimal(18,2) DEFAULT NULL,
  `DurationUnit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Cls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TaskSegments`
--

LOCK TABLES `TaskSegments` WRITE;
/*!40000 ALTER TABLE `TaskSegments` DISABLE KEYS */;
INSERT INTO `TaskSegments` VALUES
 (1,4,'2012-09-03 08:00:00.000000','2012-09-04 17:00:00.000000',2.00,'d',NULL),
 (2,4,'2012-09-06 08:00:00.000000','2012-09-10 17:00:00.000000',3.00,'d',NULL),
 (3,4,'2012-09-12 08:00:00.000000','2012-10-09 17:00:00.000000',20.00,'d',NULL);
/*!40000 ALTER TABLE `TaskSegments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tasks`
--

DROP TABLE IF EXISTS `Tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tasks` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ParentId` int DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `StartDate` datetime(6) DEFAULT NULL,
  `EndDate` datetime(6) DEFAULT NULL,
  `Duration` decimal(18,2) DEFAULT NULL,
  `DurationUnit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `PercentDone` decimal(18,2) DEFAULT NULL,
  `SchedulingMode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `BaselineStartDate` datetime(6) DEFAULT NULL,
  `BaselineEndDate` datetime(6) DEFAULT NULL,
  `BaselinePercentDone` decimal(18,2) DEFAULT NULL,
  `Cls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idx` int DEFAULT '0',
  `CalendarId` int DEFAULT NULL,
  `expanded` tinyint(1) NOT NULL DEFAULT '0',
  `Effort` decimal(18,2) DEFAULT NULL,
  `EffortUnit` varchar(255) DEFAULT NULL,
  `Note` varchar(255) DEFAULT NULL,
  `ConstraintType` varchar(255) DEFAULT NULL,
  `ConstraintDate` datetime(6) DEFAULT NULL,
  `ManuallyScheduled` tinyint(1) NOT NULL DEFAULT '0',
  `Draggable` tinyint(1) NOT NULL DEFAULT '1',
  `Resizable` tinyint(1) NOT NULL DEFAULT '1',
  `Rollup` tinyint(1) NOT NULL DEFAULT '0',
  `ShowInTimeline` tinyint(1) NOT NULL DEFAULT '0',
  `Color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DeadlineDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tasks`
--

LOCK TABLES `Tasks` WRITE;
/*!40000 ALTER TABLE `Tasks` DISABLE KEYS */;
INSERT INTO `Tasks` VALUES
 (1,NULL,'Main project','2012-09-03 08:00:00.000000','2012-11-07 13:00:00.000000',51.00,'d',11.74,NULL,NULL,NULL,NULL,'',0,NULL,1,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (2,NULL,'Second project','2012-09-17 08:00:00.000000','2012-10-30 17:00:00.000000',32.00,'d',0.00,NULL,NULL,NULL,NULL,'',1,NULL,1,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (3,NULL,'Release','2012-12-25 17:00:00.000000','2012-12-25 17:00:00.000000',0.00,'d',0.00,NULL,NULL,NULL,NULL,'',2,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,1,NULL,NULL),
 (4,1,'Initial phase','2012-09-03 08:00:00.000000','2012-10-05 17:00:00.000000',25.00,'d',70.00,NULL,NULL,NULL,NULL,'',0,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (5,1,'Alpha','2012-10-08 08:00:00.000000','2012-09-20 13:00:00.000000',14.00,'d',0.00,NULL,NULL,NULL,NULL,'',1,NULL,1,NULL,NULL,NULL,NULL,NULL,0,1,1,0,1,NULL,'2012-10-04 12:00:00.000000'),
 (6,1,'Beta','2012-09-21 04:00:00.000000','2012-11-07 13:00:00.000000',37.00,'d',0.00,NULL,NULL,NULL,NULL,'',2,NULL,1,NULL,NULL,NULL,NULL,NULL,0,1,1,0,1,NULL,NULL),
 (7,1,'Marketing','2012-11-12 08:00:00.000000','2012-12-25 17:00:00.000000',32.00,'d',0.00,NULL,NULL,NULL,NULL,'',3,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,1,NULL,NULL),
 (8,2,'Research','2012-09-17 08:00:00.000000','2012-10-30 17:00:00.000000',32.00,'d',60.00,NULL,NULL,NULL,NULL,'',0,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (9,2,'Test implementation','2012-10-30 17:00:00.000000','2012-10-30 17:00:00.000000',0.00,'d',0.00,NULL,NULL,NULL,NULL,'',1,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (10,5,'Research','2012-10-08 08:00:00.000000','2012-09-07 13:00:00.000000',5.00,'d',0.00,NULL,NULL,NULL,NULL,'',0,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (11,5,'First implementation','2012-09-10 04:00:00.000000','2012-09-14 13:00:00.000000',5.00,'d',0.00,NULL,NULL,NULL,NULL,'',1,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (12,5,'Tests','2012-09-10 04:00:00.000000','2012-09-20 13:00:00.000000',9.00,'d',0.00,NULL,NULL,NULL,NULL,'',2,NULL,0,NULL,NULL,NULL,'',NULL,0,1,1,0,0,NULL,'2012-09-25 12:00:00.000000'),
 (13,6,'Refactoring after Alpha','2012-09-21 04:00:00.000000','2012-09-28 13:00:00.000000',6.00,'d',0.00,NULL,NULL,NULL,NULL,'',0,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (14,6,'Tests','2012-10-01 04:00:00.000000','2012-10-05 13:00:00.000000',5.00,'d',0.00,NULL,NULL,NULL,NULL,'',1,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (15,6,'Internal beta','2012-10-08 04:00:00.000000','2012-10-23 13:00:00.000000',15.00,'d',0.00,NULL,NULL,NULL,NULL,'',2,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (16,6,'Additional testing','2012-10-08 04:00:00.000000','2012-10-31 13:00:00.000000',21.00,'d',0.00,NULL,NULL,NULL,NULL,'',3,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (17,6,'Public beta','2012-10-08 04:00:00.000000','2012-11-07 13:00:00.000000',26.00,'d',0.00,NULL,NULL,NULL,NULL,'',4,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL),
 (18,6,'Release','2012-11-07 13:00:00.000000','2012-11-07 13:00:00.000000',0.00,'d',0.00,NULL,NULL,NULL,NULL,'',5,NULL,0,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,NULL,NULL);
/*!40000 ALTER TABLE `Tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-12 11:41:06
