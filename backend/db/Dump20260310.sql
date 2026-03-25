-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: school_management
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `add_strand`
--

DROP TABLE IF EXISTS `add_strand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `add_strand` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strand_name` varchar(255) NOT NULL,
  `trackId` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `add_strand`
--

LOCK TABLES `add_strand` WRITE;
/*!40000 ALTER TABLE `add_strand` DISABLE KEYS */;
INSERT INTO `add_strand` VALUES (3,'GAS','4','2024-11-30 17:54:53.865228','2025-10-09 22:30:21.000000'),(5,'FBS','3','2024-11-30 17:55:22.728797','2024-11-30 17:55:22.728797'),(6,'AP NCII','3','2024-11-30 17:55:35.325239','2025-10-23 15:45:06.000000');
/*!40000 ALTER TABLE `add_strand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `add_tracks`
--

DROP TABLE IF EXISTS `add_tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `add_tracks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tracks_name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `add_tracks`
--

LOCK TABLES `add_tracks` WRITE;
/*!40000 ALTER TABLE `add_tracks` DISABLE KEYS */;
INSERT INTO `add_tracks` VALUES (3,'TVL','2024-11-30 17:54:36.015650','2024-11-30 17:54:36.015650'),(4,'Academic','2024-11-30 17:54:44.767478','2025-10-18 11:41:16.000000'),(5,'Arts & Design','2026-03-04 01:19:48.081966','2026-03-04 01:19:48.081966'),(6,'Sports','2026-03-04 01:20:05.017897','2026-03-04 01:20:05.017897');
/*!40000 ALTER TABLE `add_tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assigned_module`
--

DROP TABLE IF EXISTS `assigned_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned_module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `selected_modules` text NOT NULL,
  `assign_mods` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e029475bec50243bf748359082` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_module`
--

LOCK TABLES `assigned_module` WRITE;
/*!40000 ALTER TABLE `assigned_module` DISABLE KEYS */;
INSERT INTO `assigned_module` VALUES (1,'Admin Default','2023-05-23 15:53:16.339189','2025-11-12 08:52:22.000000','[13,14,36,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":36,\"title\":\"Settings\",\"icon\":\"mdi-cog-outline\",\"route\":null,\"parentID\":null,\"isParent\":1,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-05-22T04:00:28.765Z\",\"subLink\":[{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]}]'),(2,'Teacher','2023-05-22 10:38:21.180318','2026-02-27 22:53:55.000000','[13,102,109,114,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":102,\"title\":\"Verify Student\",\"icon\":\"mdi-account-reactivate\",\"route\":\"/student_verify\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2024-11-29T02:27:05.567Z\",\"updatedAt\":\"2024-11-29T02:27:05.567Z\"},{\"id\":109,\"title\":\"My Schedule\",\"icon\":\"mdi-microsoft-excel\",\"route\":\"/my-scheduled-program\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T03:03:22.365Z\",\"updatedAt\":\"2024-12-04T03:03:22.365Z\"},{\"id\":114,\"title\":\"My Subjects\",\"icon\":\"mdi-file\",\"route\":\"/my-student-record\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-09-18T09:36:04.280Z\",\"updatedAt\":\"2026-02-27T14:53:30.000Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]'),(3,'High School Head','2023-05-22 10:39:26.546590','2025-10-20 16:04:10.000000','[13,14,108,105,106,104,103,107,113,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":108,\"title\":\"Faculty Schedule\",\"icon\":\"mdi-list-status\",\"route\":\"/faculty-schedule\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T02:34:16.467Z\",\"updatedAt\":\"2024-12-04T02:34:16.467Z\"},{\"id\":105,\"title\":\"Tracks\",\"icon\":\"mdi-file\",\"route\":\"/add-tracks\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-30T02:37:31.058Z\",\"updatedAt\":\"2024-11-30T02:37:31.058Z\"},{\"id\":106,\"title\":\"Strand\",\"icon\":\"mdi-file\",\"route\":\"/add-strands\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-30T05:33:44.978Z\",\"updatedAt\":\"2024-11-30T05:33:44.978Z\"},{\"id\":104,\"title\":\"Rooms\",\"icon\":\"mdi-google-classroom\",\"route\":\"/high-school-rooms\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-29T15:07:14.841Z\",\"updatedAt\":\"2025-10-14T04:01:04.000Z\"},{\"id\":103,\"title\":\"Subjects\",\"icon\":\"mdi-file-multiple\",\"route\":\"/create-subject\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-29T07:17:28.067Z\",\"updatedAt\":\"2025-10-14T03:58:08.000Z\"},{\"id\":107,\"title\":\"Program\",\"icon\":\"mdi-file-arrow-up-down\",\"route\":\"/classroom-programm\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-03T00:17:03.997Z\",\"updatedAt\":\"2025-10-14T04:01:27.000Z\"},{\"id\":113,\"title\":\"School Year\",\"icon\":\"mdi-calendar-check\",\"route\":\"/add-school-year\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-11T07:56:44.587Z\",\"updatedAt\":\"2024-12-11T07:56:44.587Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]'),(4,'Superadmin','2023-05-22 10:40:40.474410','2024-12-04 16:48:57.000000','[13,14,41,42,35,36,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":41,\"title\":\"Modules\",\"icon\":\"mdi-account-group-outline\",\"route\":null,\"parentID\":null,\"isParent\":1,\"createdAt\":\"2023-05-22T02:24:21.248Z\",\"updatedAt\":\"2023-05-22T04:00:28.768Z\",\"subLink\":[{\"id\":42,\"title\":\"List\",\"icon\":\"mdi-text-box-outline\",\"route\":\"/modules-list\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-22T02:24:21.250Z\",\"updatedAt\":\"2023-05-22T04:00:28.769Z\"},{\"id\":35,\"title\":\"User Modules\",\"icon\":\"mdi-animation-outline\",\"route\":\"/user-modules\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.384Z\",\"updatedAt\":\"2023-05-22T04:00:28.765Z\"}]},{\"id\":36,\"title\":\"Settings\",\"icon\":\"mdi-cog-outline\",\"route\":null,\"parentID\":null,\"isParent\":1,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-05-22T04:00:28.765Z\",\"subLink\":[{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]}]'),(21,'Elementary Head','2025-10-10 08:42:30.100523','2025-10-14 12:03:44.000000','[13,14,108,103,110,112,113,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":108,\"title\":\"Faculty Schedule\",\"icon\":\"mdi-list-status\",\"route\":\"/faculty-schedule\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T02:34:16.467Z\",\"updatedAt\":\"2024-12-04T02:34:16.467Z\"},{\"id\":103,\"title\":\"Subjects\",\"icon\":\"mdi-file-multiple\",\"route\":\"/create-subject\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-29T07:17:28.067Z\",\"updatedAt\":\"2025-10-14T03:58:08.000Z\"},{\"id\":110,\"title\":\"Room\",\"icon\":\"mdi-google-classroom\",\"route\":\"/elementary-rooms\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-06T14:25:38.889Z\",\"updatedAt\":\"2025-10-14T04:02:48.000Z\"},{\"id\":112,\"title\":\"Programs\",\"icon\":\"mdi-file-arrow-up-down\",\"route\":\"/elementary-programm\",\"parentID\":\"111\",\"isParent\":0,\"createdAt\":\"2024-12-06T14:44:34.340Z\",\"updatedAt\":\"2025-10-14T04:03:29.000Z\"},{\"id\":113,\"title\":\"School Year\",\"icon\":\"mdi-calendar-check\",\"route\":\"/add-school-year\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-11T07:56:44.587Z\",\"updatedAt\":\"2024-12-11T07:56:44.587Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-18T01:23:00.755Z\"}]');
/*!40000 ALTER TABLE `assigned_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability`
--

DROP TABLE IF EXISTS `availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacherID` int NOT NULL,
  `day` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `subjectId` int NOT NULL,
  `roomId` int NOT NULL,
  `times_slot_from` varchar(255) NOT NULL,
  `times_slot_to` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `hours` varchar(255) NOT NULL,
  `school_yearId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability`
--

LOCK TABLES `availability` WRITE;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
INSERT INTO `availability` VALUES (21,17,'Monday','2025-10-21 10:02:26.196892','2025-10-21 10:02:26.196892',14,1,'08:30','09:30','Grade 7','1',2),(22,17,'Tuesday','2025-10-21 10:02:26.205735','2025-10-21 10:02:26.205735',14,1,'08:30','09:30','Grade 7','1',2),(23,17,'Wednesday','2025-10-21 10:02:26.209512','2025-10-21 10:02:26.209512',14,1,'08:30','09:30','Grade 7','1',2),(24,17,'Thursday','2025-10-21 10:02:26.214744','2025-10-21 10:02:26.214744',14,1,'08:30','09:30','Grade 7','1',2),(25,17,'Friday','2025-10-21 10:02:26.218672','2025-10-21 10:02:26.218672',14,1,'08:30','09:30','Grade 7','1',2),(62,17,'Tuesday','2025-10-22 10:08:39.944945','2025-10-24 10:50:32.000000',19,1,'13:00','14:00','Grade 7','1',2),(63,17,'Wednesday','2025-10-22 10:08:39.950229','2025-10-24 10:50:42.000000',19,1,'13:00','14:00','Grade 7','1',2),(64,17,'Thursday','2025-10-22 10:08:39.954189','2025-10-24 10:50:52.000000',19,1,'13:00','14:00','Grade 7','1',2),(65,17,'Friday','2025-10-22 10:08:39.958954','2025-10-24 10:51:02.000000',19,1,'13:00','14:00','Grade 7','1',2),(77,17,'Monday','2025-10-23 22:30:44.484617','2025-10-29 09:10:00.000000',19,1,'13:00','14:00','Grade 7','1',2),(84,17,'Monday','2026-02-27 23:40:31.192080','2026-02-27 23:40:31.192080',13,7,'10:30','11:30','Grade 7','1',2),(85,17,'Tuesday','2026-02-27 23:40:31.213433','2026-02-27 23:40:31.213433',13,7,'10:30','11:30','Grade 7','1',2),(86,17,'Wednesday','2026-02-27 23:40:31.221251','2026-02-27 23:40:31.221251',13,7,'10:30','11:30','Grade 7','1',2),(87,17,'Thursday','2026-02-27 23:40:31.227436','2026-02-27 23:40:31.227436',13,7,'10:30','11:30','Grade 7','1',2),(88,17,'Friday','2026-02-27 23:40:31.233394','2026-02-27 23:40:31.233394',13,7,'10:30','11:30','Grade 7','1',2);
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `callback_elementary_enrollment_summary`
--

DROP TABLE IF EXISTS `callback_elementary_enrollment_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `callback_elementary_enrollment_summary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `school_year_from` varchar(255) NOT NULL,
  `school_year_to` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `male_count` int NOT NULL DEFAULT '0',
  `female_count` int NOT NULL DEFAULT '0',
  `total_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callback_elementary_enrollment_summary`
--

LOCK TABLES `callback_elementary_enrollment_summary` WRITE;
/*!40000 ALTER TABLE `callback_elementary_enrollment_summary` DISABLE KEYS */;
INSERT INTO `callback_elementary_enrollment_summary` VALUES (1,'2022','2023','Kindergarten',34,36,70,'2026-03-04 09:32:30.886126'),(2,'2022','2023','Grade 1',43,28,71,'2026-03-04 09:32:30.886748'),(3,'2022','2023','Grade 2',46,39,85,'2026-03-04 09:32:30.888315'),(4,'2022','2023','Grade 3',40,35,75,'2026-03-04 09:32:30.888651'),(5,'2022','2023','Grade 4',37,45,82,'2026-03-04 09:32:30.888950'),(6,'2022','2023','Grade 5',38,43,75,'2026-03-04 09:32:30.889320'),(7,'2022','2023','Grade 6',31,44,75,'2026-03-04 09:32:30.889606'),(8,'2023','2024','Kindergarten',59,41,100,'2026-03-04 09:32:30.889850'),(9,'2023','2024','Grade 1',36,44,80,'2026-03-04 09:32:30.890323'),(10,'2023','2024','Grade 2',48,28,76,'2026-03-04 09:32:30.890569'),(11,'2023','2024','Grade 3',44,43,87,'2026-03-04 09:32:30.890771'),(12,'2023','2024','Grade 4',39,42,81,'2026-03-04 09:32:30.890967'),(13,'2023','2024','Grade 5',43,47,90,'2026-03-04 09:32:30.891165'),(14,'2023','2024','Grade 6',39,42,81,'2026-03-04 09:32:30.891512'),(15,'2024','2025','Kindergarten',31,32,63,'2026-03-04 09:32:30.891712'),(16,'2024','2025','Grade 1',36,35,71,'2026-03-04 09:32:30.891905'),(17,'2024','2025','Grade 2',56,40,96,'2026-03-04 09:32:30.892114'),(18,'2024','2025','Grade 3',37,44,81,'2026-03-04 09:32:30.892293'),(19,'2024','2025','Grade 4',50,28,78,'2026-03-04 09:32:30.892473'),(20,'2024','2025','Grade 5',48,43,91,'2026-03-04 09:32:30.892665'),(21,'2024','2025','Grade 6',43,27,70,'2026-03-04 09:32:30.892853');
/*!40000 ALTER TABLE `callback_elementary_enrollment_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `callback_enrollment_summary`
--

DROP TABLE IF EXISTS `callback_enrollment_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `callback_enrollment_summary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `school_year_from` varchar(255) NOT NULL,
  `school_year_to` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `track` varchar(255) DEFAULT NULL,
  `male_count` int NOT NULL DEFAULT '0',
  `female_count` int NOT NULL DEFAULT '0',
  `total_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callback_enrollment_summary`
--

LOCK TABLES `callback_enrollment_summary` WRITE;
/*!40000 ALTER TABLE `callback_enrollment_summary` DISABLE KEYS */;
INSERT INTO `callback_enrollment_summary` VALUES (5,'2022','2023','Grade 7',NULL,83,68,151,'2026-03-04 01:18:56.772950'),(6,'2022','2023','Grade 8',NULL,82,75,157,'2026-03-04 01:18:56.773453'),(7,'2022','2023','Grade 9',NULL,87,73,160,'2026-03-04 01:18:56.773768'),(8,'2022','2023','Grade 10',NULL,78,74,152,'2026-03-04 01:18:56.774017'),(9,'2022','2023','Grade 11','4',29,49,78,'2026-03-04 01:18:56.774238'),(10,'2022','2023','Grade 11','3',57,39,96,'2026-03-04 01:22:25.668674'),(11,'2022','2023','Grade 12','4',32,51,83,'2026-03-04 01:22:25.669184'),(12,'2022','2023','Grade 12','3',38,17,55,'2026-03-04 01:22:25.669466'),(13,'2023','2024','Grade 7',NULL,53,84,137,'2026-03-04 01:32:56.271074'),(14,'2023','2024','Grade 8',NULL,48,57,105,'2026-03-04 01:32:56.271590'),(15,'2023','2024','Grade 9',NULL,61,65,126,'2026-03-04 01:32:56.271884'),(16,'2023','2024','Grade 10',NULL,60,59,119,'2026-03-04 01:32:56.272132'),(17,'2023','2024','Grade 11','4',8,18,26,'2026-03-04 01:32:56.272393'),(18,'2023','2024','Grade 11','3',35,22,57,'2026-03-04 01:32:56.272609'),(19,'2023','2024','Grade 12','4',25,41,66,'2026-03-04 01:32:56.272813'),(20,'2023','2024','Grade 12','3',31,9,40,'2026-03-04 01:32:56.273022'),(21,'2024','2025','Grade 7',NULL,98,103,201,'2026-03-04 01:32:56.273276'),(22,'2024','2025','Grade 8',NULL,77,70,147,'2026-03-04 01:32:56.273489'),(23,'2024','2025','Grade 9',NULL,68,79,147,'2026-03-04 01:32:56.273684'),(24,'2024','2025','Grade 10',NULL,49,61,110,'2026-03-04 01:32:56.273902'),(25,'2024','2025','Grade 11','4',33,30,63,'2026-03-04 01:32:56.274133'),(26,'2024','2025','Grade 11','3',38,33,71,'2026-03-04 01:32:56.274381'),(27,'2024','2025','Grade 12','4',26,25,51,'2026-03-04 01:32:56.274596'),(28,'2024','2025','Grade 12','3',28,28,56,'2026-03-04 01:32:56.274814');
/*!40000 ALTER TABLE `callback_enrollment_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elementary_enrollment_summary`
--

DROP TABLE IF EXISTS `elementary_enrollment_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elementary_enrollment_summary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `school_year_id` int NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `male_count` int NOT NULL DEFAULT '0',
  `female_count` int NOT NULL DEFAULT '0',
  `total_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elementary_enrollment_summary`
--

LOCK TABLES `elementary_enrollment_summary` WRITE;
/*!40000 ALTER TABLE `elementary_enrollment_summary` DISABLE KEYS */;
/*!40000 ALTER TABLE `elementary_enrollment_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enroll_student`
--

DROP TABLE IF EXISTS `enroll_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enroll_student` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `mname` varchar(255) DEFAULT NULL,
  `suffix` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `bdate` varchar(255) DEFAULT NULL,
  `birth_place` varchar(255) DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `seniorJunior` varchar(255) DEFAULT NULL,
  `transfered` tinyint NOT NULL DEFAULT '0',
  `is_IP` tinyint NOT NULL DEFAULT '0',
  `ip_Name` varchar(255) DEFAULT NULL,
  `fourPs` tinyint NOT NULL DEFAULT '0',
  `fourpis` varchar(255) DEFAULT NULL,
  `blood_type` varchar(255) DEFAULT NULL,
  `residential_zip` varchar(255) DEFAULT NULL,
  `residential_house_no` varchar(255) DEFAULT NULL,
  `residential_street` varchar(255) DEFAULT NULL,
  `residential_subd` varchar(255) DEFAULT NULL,
  `residential_brgy` varchar(255) DEFAULT NULL,
  `residential_city` varchar(255) DEFAULT NULL,
  `residential_prov` varchar(255) DEFAULT NULL,
  `permanent_zip` varchar(255) DEFAULT NULL,
  `permanent_house_no` varchar(255) DEFAULT NULL,
  `permanent_street` varchar(255) DEFAULT NULL,
  `permanent_subd` varchar(255) DEFAULT NULL,
  `permanent_brgy` varchar(255) DEFAULT NULL,
  `permanent_city` varchar(255) DEFAULT NULL,
  `permanent_prov` varchar(255) DEFAULT NULL,
  `father_fname` varchar(255) DEFAULT NULL,
  `father_mname` varchar(255) DEFAULT NULL,
  `father_lname` varchar(255) DEFAULT NULL,
  `father_number` varchar(255) DEFAULT NULL,
  `mother_fname` varchar(255) DEFAULT NULL,
  `mother_mname` varchar(255) DEFAULT NULL,
  `mother_lname` varchar(255) DEFAULT NULL,
  `mother_number` varchar(255) DEFAULT NULL,
  `guardian_fname` varchar(255) DEFAULT NULL,
  `guardian_mname` varchar(255) DEFAULT NULL,
  `guardian_lname` varchar(255) DEFAULT NULL,
  `guardian_number` varchar(255) DEFAULT NULL,
  `last_grade_completed` varchar(255) DEFAULT NULL,
  `last_year_completed` varchar(255) DEFAULT NULL,
  `last_school_attended` varchar(255) DEFAULT NULL,
  `last_school_ID` varchar(255) DEFAULT NULL,
  `statusEnrolled` tinyint NOT NULL DEFAULT '0',
  `isFilipino` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `disability` tinyint NOT NULL DEFAULT '0',
  `disability_desc` varchar(255) DEFAULT NULL,
  `grade_level` varchar(255) DEFAULT NULL,
  `track` varchar(255) DEFAULT NULL,
  `semester` varchar(255) DEFAULT NULL,
  `strand` varchar(255) DEFAULT NULL,
  `school_yearId` int NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `goodMoral` varchar(255) DEFAULT NULL,
  `birthPSA` varchar(255) DEFAULT NULL,
  `schoolCard` varchar(255) DEFAULT NULL,
  `mobile_no` varchar(255) DEFAULT NULL,
  `height` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `LRN` varchar(255) DEFAULT NULL,
  `CODE` varchar(255) DEFAULT NULL,
  `isSubmitted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enroll_student`
--

LOCK TABLES `enroll_student` WRITE;
/*!40000 ALTER TABLE `enroll_student` DISABLE KEYS */;
INSERT INTO `enroll_student` VALUES (36,'Rafael','Armonio','Flores','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-05 13:18:20.195899','2026-03-10 22:11:48.615892',0,'','Grade 7',NULL,NULL,NULL,2,'default1772687900183-331039298.pdf','632660032_1427073445458601_5188699746546550615_n1772687900161-828859265.jpeg','632660032_1427073445458601_5188699746546550615_n1772687900177-154184747.jpeg','632660032_1427073445458601_5188699746546550615_n1772687900173-580458657.jpeg','','','','128709170005','XQM7Xxfp0B4',1),(37,'Jefferson','Asparyan','Sarsona','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-05 13:20:41.864636','2026-03-10 22:11:48.624182',0,'','Grade 7',NULL,NULL,NULL,2,'default1772688041855-825458696.pdf','632660032_1427073445458601_5188699746546550615_n1772688041847-337194290.jpeg','632660032_1427073445458601_5188699746546550615_n1772688041852-311376087.jpeg','632660032_1427073445458601_5188699746546550615_n1772688041849-966409239.jpeg','','','','136618170177','CKWe3cHNdCi',1),(38,'Leigh Ann','Armonio','Socorro','','','1997-12-02','TEST','Female','Single','Junior High',0,0,'',0,'','','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'2026-03-05 13:22:32.681728','2026-03-10 15:17:48.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1772713665767-723275922.pdf','632660032_1427073445458601_5188699746546550615_n1772713665737-669540706.jpeg','632660032_1427073445458601_5188699746546550615_n1772713665761-877456323.jpeg','632660032_1427073445458601_5188699746546550615_n1772713665749-413135058.jpeg','','','','128709170020','EOxfyiYWQXE',1),(39,'Angel','Caparida','Viajedor','','','1997-12-02','TEST','Female','Single','Junior High',0,0,'',0,'','','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-05 20:25:45.166549','2026-03-05 20:28:13.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1772713545139-693457116.pdf','632660032_1427073445458601_5188699746546550615_n1772713545111-349601741.jpeg','632660032_1427073445458601_5188699746546550615_n1772713545126-401253820.jpeg','632660032_1427073445458601_5188699746546550615_n1772713545119-248841952.jpeg','','','','128709170038','IOqdDb1HTRy',1),(41,'ASHLEY GREN','LOMOCSO','','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'2026-03-10 08:20:56.795508','2026-03-10 22:11:48.624788',0,'','Grade 7',NULL,NULL,NULL,2,'default1773102094536-494084056.pdf','643906883_1939449376949305_3764993700700779045_n1773125651149-815797577.jpeg','643906883_1939449376949305_3764993700700779045_n1773125651149-815797577.jpeg','643906883_1939449376949305_3764993700700779045_n1773125651149-815797577.jpeg','','','','128709170041','pQV0MUpmY5n',1),(43,'LORD FEN ETHAN','BOLONIA','INOCELLAS','','','1997-12-02','TRIAL','Male','Single','Junior High',0,0,'',0,'','','8101','TRIAL','TRIAL','TRIAL','TRIAL','TRIAL','TRIAL','8101','TRIAL','TRIAL','TRIAL','TRIAL','TRIAL','TRIAL',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:26:00.413546','2026-03-10 15:38:31.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1773127560386-161942378.pdf','default1773127560376-593716027.pdf','643906883_1939449376949305_3764993700700779045_n1773127560382-739432170.jpeg','643906883_1939449376949305_3764993700700779045_n1773127560377-703311050.jpeg','','','','128709170008','RfSTg0zNP4r',1),(44,'JOHN LAURENZ','BUDIONGAN','','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:27:18.313955','2026-03-10 15:38:32.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1773127638299-484587590.pdf','default1773127638292-733029112.pdf','643906883_1939449376949305_3764993700700779045_n1773127638296-845294066.jpeg','643906883_1939449376949305_3764993700700779045_n1773127638293-949058768.jpeg','','','','131797170002','WA8k45pTav1',1),(45,'RENZO BOY','DANO','YBAÑEZ','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','8105','TEST','TEST','TEST','TEST','TEST','TEST','8105','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:29:54.781143','2026-03-10 15:38:33.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1773127794770-441868487.pdf','643906883_1939449376949305_3764993700700779045_n1773127794756-875541806.jpeg','643906883_1939449376949305_3764993700700779045_n1773127794768-734118473.jpeg','643906883_1939449376949305_3764993700700779045_n1773127794765-299722605.jpeg','','','','128725170002','GxRAeE7obAu',1),(46,'JOHN GABRIEL','DUQUE','PAYOT','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','8101','TEST','TEST','TEST','TEST','TEST','TEST','8101','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:31:08.266017','2026-03-10 15:39:55.582250',0,'','Grade 7',NULL,NULL,NULL,2,'default1773127868255-717912250.pdf','default1773127868251-947272205.pdf','643906883_1939449376949305_3764993700700779045_n1773127868252-270686294.jpeg','643906883_1939449376949305_3764993700700779045_n1773127868251-508734786.jpeg','','','','464525170011','3VYXxHqUeAE',1),(47,'FRYNZ AIEN','LAPASA','BENLOT','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','8101','TEST','TEST','TEST','TEST','TEST','TEST','8101','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:32:18.072526','2026-03-10 15:38:35.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1773127938056-707347104.pdf','default1773127938052-18013965.pdf','643906883_1939449376949305_3764993700700779045_n1773127938054-365643766.jpeg','643906883_1939449376949305_3764993700700779045_n1773127938053-946349014.jpeg','','','','128724170011','eGj9Msw5mG8',1),(48,'ALJUR','LUCEÑO','','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','8101','TEST','TEST','TEST','TEST','TEST','TEST','8101','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:33:21.480145','2026-03-10 15:38:37.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1773128001470-315074804.pdf','default1773128001460-189343432.pdf','643906883_1939449376949305_3764993700700779045_n1773128001467-171060491.jpeg','643906883_1939449376949305_3764993700700779045_n1773128001460-489221061.jpeg','','','','129652170121','hTn4alAxr0W',1),(49,'MARK JAZIN','NUÑEZ','OTOS','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','8101','TEST','TEST','TEST','TEST','TEST','TEST','8101','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:34:32.231691','2026-03-10 15:38:38.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1773128072222-782052403.pdf','default1773128072219-136637290.pdf','643906883_1939449376949305_3764993700700779045_n1773128072221-332902181.jpeg','643906883_1939449376949305_3764993700700779045_n1773128072219-566837421.jpeg','','','','128707170005','KEczc28K7G0',1),(50,'RICH','PORAZO','MANTIZA','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','8101','TEST','TEST','TEST','TEST','TEST','TEST','8101','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:35:45.137799','2026-03-10 15:38:39.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1773128145127-325054669.pdf','default1773128145116-779097322.pdf','643906883_1939449376949305_3764993700700779045_n1773128145118-327221471.jpeg','643906883_1939449376949305_3764993700700779045_n1773128145116-197871825.jpeg','','','','128709170049','kN7JkSP4XyE',1),(51,'JIAN CLARK','QUIJAS','','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','8101','TEST','TEST','TEST','TEST','TEST','TEST','8101','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:36:50.687960','2026-03-10 15:38:41.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1773128210672-723416395.pdf','default1773128210669-95070573.pdf','643906883_1939449376949305_3764993700700779045_n1773128210670-791311882.jpeg','643906883_1939449376949305_3764993700700779045_n1773128210669-986579175.jpeg','','','','128596170017','dWFvbJWtzdv',1),(52,'LEAVEN','RACHO','GASCO','','','1997-12-02','TEST','Male','Single','Junior High',0,0,'',0,'','','8101','TEST','TEST','TEST','TEST','TEST','TEST','8101','TEST','TEST','TEST','TEST','TEST','TEST',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'Filipino','2026-03-10 15:37:56.613596','2026-03-10 22:17:09.000000',0,'','Grade 7',NULL,NULL,NULL,2,'default1773128276600-474383091.pdf','default1773128276588-259720324.pdf','643906883_1939449376949305_3764993700700779045_n1773128276589-862564795.jpeg','643906883_1939449376949305_3764993700700779045_n1773128276588-432156314.jpeg','','','','128720170007','vRi6knUZW8R',1);
/*!40000 ALTER TABLE `enroll_student` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_student_enrollment_update` AFTER UPDATE ON `enroll_student` FOR EACH ROW BEGIN

    DECLARE v_count INT DEFAULT 0;

    -- Only run if statusEnrolled or grade_level changed
    IF (NOT (OLD.statusEnrolled <=> NEW.statusEnrolled)) 
       OR (NOT (OLD.grade_level <=> NEW.grade_level)) THEN

        -- Check if history already exists for this student + school year
        SELECT COUNT(*) INTO v_count
        FROM student_enrollment_history
        WHERE student_id = NEW.id
        AND school_yearId = NEW.school_yearId;

        -- Insert only if no duplicate exists
        IF v_count = 0 THEN

            INSERT INTO student_enrollment_history (
                student_id,
                school_yearId,
                LRN,
                grade_level,
                statusEnrolled
            )
            VALUES (
                NEW.id,
                NEW.school_yearId,
                NEW.LRN,
                NEW.grade_level,
                NEW.statusEnrolled
            );

        END IF;

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `enrollment_summary`
--

DROP TABLE IF EXISTS `enrollment_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment_summary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `school_year_id` int NOT NULL,
  `male_count` int NOT NULL DEFAULT '0',
  `female_count` int NOT NULL DEFAULT '0',
  `total_count` int NOT NULL DEFAULT '0',
  `grade_level` varchar(255) NOT NULL,
  `track` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment_summary`
--

LOCK TABLES `enrollment_summary` WRITE;
/*!40000 ALTER TABLE `enrollment_summary` DISABLE KEYS */;
/*!40000 ALTER TABLE `enrollment_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forecast_sequence`
--

DROP TABLE IF EXISTS `forecast_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forecast_sequence` (
  `seq` int NOT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecast_sequence`
--

LOCK TABLES `forecast_sequence` WRITE;
/*!40000 ALTER TABLE `forecast_sequence` DISABLE KEYS */;
INSERT INTO `forecast_sequence` VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);
/*!40000 ALTER TABLE `forecast_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade_level`
--

DROP TABLE IF EXISTS `grade_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade_level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_level`
--

LOCK TABLES `grade_level` WRITE;
/*!40000 ALTER TABLE `grade_level` DISABLE KEYS */;
INSERT INTO `grade_level` VALUES (1,'Grade 1'),(2,'Grade 2'),(3,'Grade 3'),(4,'Grade 4'),(5,'Grade 5'),(6,'Grade 6'),(7,'Grade 7'),(8,'Grade 8'),(9,'Grade 9'),(10,'Grade 10'),(11,'Grade 11'),(12,'Grade 12');
/*!40000 ALTER TABLE `grade_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `report_forcasteddata_by_gradelevel`
--

DROP TABLE IF EXISTS `report_forcasteddata_by_gradelevel`;
/*!50001 DROP VIEW IF EXISTS `report_forcasteddata_by_gradelevel`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `report_forcasteddata_by_gradelevel` AS SELECT 
 1 AS `allYear`,
 1 AS `gradeyr_level`,
 1 AS `actual_students`,
 1 AS `forecasted_students`,
 1 AS `teacher_count`,
 1 AS `teachers_needed`,
 1 AS `room_count`,
 1 AS `classrooms_needed`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `room_population`
--

DROP TABLE IF EXISTS `room_population`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_population` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year_start` int DEFAULT NULL,
  `academic_year` varchar(15) DEFAULT NULL,
  `gradeyr_level` int DEFAULT NULL,
  `room_count` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_population`
--

LOCK TABLES `room_population` WRITE;
/*!40000 ALTER TABLE `room_population` DISABLE KEYS */;
INSERT INTO `room_population` VALUES (1,2025,'2025-2026',7,4),(2,2025,'2025-2026',8,4),(3,2025,'2025-2026',9,4),(4,2025,'2025-2026',10,4),(5,2025,'2025-2026',11,4),(6,2025,'2025-2026',12,4),(7,2024,'2024-2025',7,4),(8,2024,'2024-2025',8,4),(9,2024,'2024-2025',9,4),(10,2024,'2024-2025',10,4),(11,2024,'2024-2025',11,4),(12,2024,'2024-2025',12,4),(13,2023,'2023-2024',7,4),(14,2023,'2023-2024',8,4),(15,2023,'2023-2024',9,4),(16,2023,'2023-2024',10,4),(17,2023,'2023-2024',11,4),(18,2023,'2023-2024',12,4),(19,2022,'2022-2023',7,4),(20,2022,'2022-2023',8,4),(21,2022,'2022-2023',9,4),(22,2022,'2022-2023',10,4),(23,2022,'2022-2023',11,4),(24,2022,'2022-2023',12,4),(25,2021,'2021-2022',7,4),(26,2021,'2021-2022',8,4),(27,2021,'2021-2022',9,4),(28,2021,'2021-2022',10,4),(29,2021,'2021-2022',11,4),(30,2021,'2021-2022',12,4),(31,2020,'2020-2021',7,4),(32,2020,'2020-2021',8,4),(33,2020,'2020-2021',9,4),(34,2020,'2020-2021',10,4),(35,2020,'2020-2021',11,4),(36,2020,'2020-2021',12,4),(37,2019,'2019-2020',7,4),(38,2019,'2019-2020',8,4),(39,2019,'2019-2020',9,4),(40,2019,'2019-2020',10,4),(41,2019,'2019-2020',11,4),(42,2019,'2019-2020',12,4),(43,2018,'2018-2019',7,4),(44,2018,'2018-2019',8,4),(45,2018,'2018-2019',9,4),(46,2018,'2018-2019',10,4),(47,2018,'2018-2019',11,4),(48,2018,'2018-2019',12,4);
/*!40000 ALTER TABLE `room_population` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms_section`
--

DROP TABLE IF EXISTS `rooms_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_section` varchar(255) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `strandId` int DEFAULT NULL,
  `teacherId` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms_section`
--

LOCK TABLES `rooms_section` WRITE;
/*!40000 ALTER TABLE `rooms_section` DISABLE KEYS */;
INSERT INTO `rooms_section` VALUES (1,'Sampaguita','Grade 7',NULL,17,'2025-10-11 07:00:25.847512','2026-03-05 22:29:11.248529'),(2,'Bonifacio','Grade 8',6,25,'2025-10-11 07:00:47.464004','2026-03-05 22:29:11.248966'),(3,'Sampalok','Grade 1',NULL,NULL,'2025-10-11 07:25:20.359393','2025-10-14 11:04:47.000000'),(4,'Mangga','Kinder 1',NULL,NULL,'2025-10-14 08:27:27.760700','2025-10-21 20:25:45.588157'),(5,'Sampaguita','Kinder 2',NULL,NULL,'2025-10-14 08:27:36.660993','2025-10-14 08:27:36.660993'),(6,'Waling Waling','Grade 9',NULL,NULL,'2025-10-14 14:28:01.930564','2025-10-14 14:28:01.930564'),(7,'Lawaan','Grade 7',NULL,NULL,'2025-10-18 10:53:31.456120','2025-10-22 13:23:23.000000'),(8,'Mercury','Grade 10',NULL,NULL,'2025-10-21 16:37:36.282142','2025-10-21 16:37:36.282142'),(9,'Mount Apo','Grade 11',3,NULL,'2025-10-21 16:38:02.026046','2025-10-21 16:38:02.026046'),(10,'Newton','Grade 11',5,25,'2025-10-21 16:38:28.889855','2026-02-27 21:24:05.795420'),(11,'Waling','Grade 5',NULL,NULL,'2025-10-21 17:05:59.875168','2025-10-21 17:05:59.875168'),(19,'Mahugani','Grade 7',NULL,NULL,'2025-10-21 21:01:17.797146','2025-10-21 21:01:17.797146'),(20,'Bayabas','Kinder 1',NULL,NULL,'2025-10-21 21:07:23.497609','2025-10-21 21:07:32.000000'),(21,'FOOTBALL','Grade 12',5,11,'2026-02-27 14:44:26.133009','2026-02-27 22:08:37.735012'),(22,'ALIPOYO','Grade 6',NULL,21,'2026-03-03 15:09:03.089330','2026-03-03 15:10:11.000000');
/*!40000 ALTER TABLE `rooms_section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_year`
--

DROP TABLE IF EXISTS `school_year`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_year` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `school_year_from` varchar(255) NOT NULL,
  `school_year_to` varchar(255) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_year`
--

LOCK TABLES `school_year` WRITE;
/*!40000 ALTER TABLE `school_year` DISABLE KEYS */;
INSERT INTO `school_year` VALUES (1,'2024-12-04 13:22:49.982239','2026-03-04 10:14:54.978425','2024','2025',0),(2,'2024-12-04 14:13:12.548614','2026-03-04 10:14:54.000000','2025','2026',1),(4,'2026-02-27 15:54:29.168854','2026-03-04 10:13:38.732605','2026','2027',0);
/*!40000 ALTER TABLE `school_year` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_attendance`
--

DROP TABLE IF EXISTS `student_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomID` int NOT NULL,
  `school_yearID` int NOT NULL,
  `teacherID` int NOT NULL,
  `attendance` int NOT NULL DEFAULT '0',
  `studentID` int NOT NULL,
  `subjectID` int NOT NULL,
  `attendanceDate` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_attendance`
--

LOCK TABLES `student_attendance` WRITE;
/*!40000 ALTER TABLE `student_attendance` DISABLE KEYS */;
INSERT INTO `student_attendance` VALUES (70,1,1,17,0,37,14,'2026-03-10','2026-03-10 08:32:50.913924','2026-03-10 08:32:50.913924'),(71,1,1,17,0,36,14,'2026-03-10','2026-03-10 08:32:50.926660','2026-03-10 08:32:50.926660'),(72,1,1,17,0,38,14,'2026-03-10','2026-03-10 08:32:50.930502','2026-03-10 08:32:50.930502'),(73,1,1,17,0,41,14,'2026-03-10','2026-03-10 08:32:50.932776','2026-03-10 08:32:50.932776');
/*!40000 ALTER TABLE `student_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `student_cesmodel`
--

DROP TABLE IF EXISTS `student_cesmodel`;
/*!50001 DROP VIEW IF EXISTS `student_cesmodel`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_cesmodel` AS SELECT 
 1 AS `allYear`,
 1 AS `gradeyr_level`,
 1 AS `actual_students`,
 1 AS `forecasted_students`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `student_combinedforecasts`
--

DROP TABLE IF EXISTS `student_combinedforecasts`;
/*!50001 DROP VIEW IF EXISTS `student_combinedforecasts`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_combinedforecasts` AS SELECT 
 1 AS `allYear`,
 1 AS `gradeyr_level`,
 1 AS `actual_students`,
 1 AS `linear_regression`,
 1 AS `polynomial_regression`,
 1 AS `exponential_smoothing`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `student_enrollment_history`
--

DROP TABLE IF EXISTS `student_enrollment_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_enrollment_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `school_yearId` int DEFAULT NULL,
  `LRN` varchar(50) DEFAULT NULL,
  `grade_level` varchar(50) DEFAULT NULL,
  `statusEnrolled` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_enrollment_history`
--

LOCK TABLES `student_enrollment_history` WRITE;
/*!40000 ALTER TABLE `student_enrollment_history` DISABLE KEYS */;
INSERT INTO `student_enrollment_history` VALUES (2,34,1,'128709170005','Grade 7',1,'2026-03-05 12:25:58.390311'),(3,35,1,'128709170005','Grade 7',1,'2026-03-05 12:32:52.542432'),(4,35,2,'128709170005','Grade 7',0,'2026-03-05 12:35:09.098634'),(5,38,2,'128709170020','Grade 7',0,'2026-03-05 13:23:22.829540'),(6,36,2,'128709170005','Grade 7',1,'2026-03-05 13:40:24.108852'),(7,37,2,'136618170177','Grade 7',1,'2026-03-05 13:40:29.645170'),(8,39,2,'128709170038','Grade 7',1,'2026-03-05 20:28:13.630747'),(9,40,2,'312313123123','Grade 7',1,'2026-03-05 22:01:27.754397'),(10,41,2,'128709170041','Grade 7',1,'2026-03-10 08:22:19.744864'),(11,43,2,'128709170008','Grade 7',1,'2026-03-10 15:38:31.090730'),(12,44,2,'131797170002','Grade 7',1,'2026-03-10 15:38:32.316024'),(13,45,2,'128725170002','Grade 7',1,'2026-03-10 15:38:33.426638'),(14,46,2,'464525170011','Grade 7',1,'2026-03-10 15:38:34.499245'),(15,47,2,'128724170011','Grade 7',1,'2026-03-10 15:38:35.811686'),(16,48,2,'129652170121','Grade 7',1,'2026-03-10 15:38:37.594936'),(17,49,2,'128707170005','Grade 7',1,'2026-03-10 15:38:38.754744'),(18,50,2,'128709170049','Grade 7',1,'2026-03-10 15:38:39.883069'),(19,51,2,'128596170017','Grade 7',1,'2026-03-10 15:38:41.013360'),(20,52,2,'128720170007','Grade 7',1,'2026-03-10 15:38:42.083182'),(21,53,2,'121212121212','Grade 2',1,'2026-03-10 22:07:13.155557');
/*!40000 ALTER TABLE `student_enrollment_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `student_linearregression`
--

DROP TABLE IF EXISTS `student_linearregression`;
/*!50001 DROP VIEW IF EXISTS `student_linearregression`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_linearregression` AS SELECT 
 1 AS `forecast_year`,
 1 AS `gradeyr_level`,
 1 AS `forecasted_students`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `student_list`
--

DROP TABLE IF EXISTS `student_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `roomId` int NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `school_yearId` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `strandId` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `remarks` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=284 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_list`
--

LOCK TABLES `student_list` WRITE;
/*!40000 ALTER TABLE `student_list` DISABLE KEYS */;
INSERT INTO `student_list` VALUES (240,37,1,'Grade 7',1,'2026-03-05 13:41:06.066040','2026-03-10 15:07:40.000000',NULL,2,'sample'),(241,36,1,'Grade 7',1,'2026-03-05 20:28:45.810227','2026-03-05 20:29:20.570399',NULL,NULL,NULL),(249,38,1,'Grade 7',1,'2026-03-05 22:18:20.835102','2026-03-05 22:18:36.658061',NULL,NULL,NULL),(256,41,1,'Grade 7',1,'2026-03-10 08:23:10.240832','2026-03-10 08:23:44.510485',NULL,NULL,NULL),(272,38,1,'Grade 7',1,'2026-03-10 15:38:59.029993','2026-03-10 15:39:10.922745',NULL,NULL,NULL),(273,39,1,'Grade 7',1,'2026-03-10 15:38:59.038608','2026-03-10 15:39:10.923400',NULL,NULL,NULL),(274,43,1,'Grade 7',1,'2026-03-10 15:38:59.042544','2026-03-10 15:39:10.923752',NULL,NULL,NULL),(275,44,1,'Grade 7',1,'2026-03-10 15:38:59.046964','2026-03-10 15:39:10.924005',NULL,NULL,NULL),(276,45,1,'Grade 7',1,'2026-03-10 15:38:59.049933','2026-03-10 15:39:10.924224',NULL,NULL,NULL),(277,46,1,'Grade 7',1,'2026-03-10 15:38:59.054158','2026-03-10 15:39:10.924459',NULL,NULL,NULL),(278,47,1,'Grade 7',1,'2026-03-10 15:38:59.057554','2026-03-10 15:39:10.924694',NULL,NULL,NULL),(279,48,1,'Grade 7',1,'2026-03-10 15:38:59.061503','2026-03-10 15:39:10.924964',NULL,NULL,NULL),(280,49,1,'Grade 7',1,'2026-03-10 15:38:59.064125','2026-03-10 15:41:16.000000',NULL,2,'dropped'),(281,50,1,'Grade 7',1,'2026-03-10 15:38:59.066479','2026-03-10 15:39:10.925695',NULL,NULL,NULL),(282,51,1,'Grade 7',1,'2026-03-10 15:38:59.070461','2026-03-10 15:39:10.926518',NULL,NULL,NULL),(283,52,1,'Grade 7',1,'2026-03-10 15:38:59.073019','2026-03-10 15:39:10.926751',NULL,NULL,NULL);
/*!40000 ALTER TABLE `student_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `student_lrmodel`
--

DROP TABLE IF EXISTS `student_lrmodel`;
/*!50001 DROP VIEW IF EXISTS `student_lrmodel`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_lrmodel` AS SELECT 
 1 AS `allYear`,
 1 AS `gradeyr_level`,
 1 AS `actual_students`,
 1 AS `forecasted_students`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `student_polynomialmodel`
--

DROP TABLE IF EXISTS `student_polynomialmodel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_polynomialmodel` (
  `gradeyr_level` int DEFAULT NULL,
  `a` double DEFAULT NULL,
  `b` double DEFAULT NULL,
  `c` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_polynomialmodel`
--

LOCK TABLES `student_polynomialmodel` WRITE;
/*!40000 ALTER TABLE `student_polynomialmodel` DISABLE KEYS */;
INSERT INTO `student_polynomialmodel` VALUES (7,265.7142857142857,-55.166666666666664,5.9523809523809526),(8,218.73214285714286,-28.291666666666668,2.517857142857143),(9,168.5,-4.976190476190476,0.30952380952380953),(10,90.92857142857143,25.738095238095237,-2.6666666666666665),(11,56.80357142857143,18.50595238095238,-1.3511904761904763),(12,27.357142857142858,29.011904761904763,-2.369047619047619);
/*!40000 ALTER TABLE `student_polynomialmodel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `student_polynomialregression`
--

DROP TABLE IF EXISTS `student_polynomialregression`;
/*!50001 DROP VIEW IF EXISTS `student_polynomialregression`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_polynomialregression` AS SELECT 
 1 AS `gradeyr_level`,
 1 AS `forecast_year`,
 1 AS `forecasted_students`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `student_population`
--

DROP TABLE IF EXISTS `student_population`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_population` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year_start` int DEFAULT NULL,
  `academic_year` varchar(15) DEFAULT NULL,
  `gradeyr_level` int DEFAULT NULL,
  `student_count` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_population`
--

LOCK TABLES `student_population` WRITE;
/*!40000 ALTER TABLE `student_population` DISABLE KEYS */;
INSERT INTO `student_population` VALUES (1,2025,'2025-2026',7,201),(2,2025,'2025-2026',8,147),(3,2025,'2025-2026',9,147),(4,2025,'2025-2026',10,110),(5,2025,'2025-2026',11,134),(6,2025,'2025-2026',12,107),(7,2024,'2024-2025',7,180),(8,2024,'2024-2025',8,170),(9,2024,'2024-2025',9,175),(10,2024,'2024-2025',10,180),(11,2024,'2024-2025',11,100),(12,2024,'2024-2025',12,112),(13,2023,'2023-2024',7,137),(14,2023,'2023-2024',8,105),(15,2023,'2023-2024',9,106),(16,2023,'2023-2024',10,119),(17,2023,'2023-2024',11,83),(18,2023,'2023-2024',12,106),(19,2022,'2022-2023',7,151),(20,2022,'2022-2023',8,157),(21,2022,'2022-2023',9,160),(22,2022,'2022-2023',10,152),(23,2022,'2022-2023',11,174),(24,2022,'2022-2023',12,138),(25,2021,'2021-2022',7,150),(26,2021,'2021-2022',8,152),(27,2021,'2021-2022',9,160),(28,2021,'2021-2022',10,180),(29,2021,'2021-2022',11,110),(30,2021,'2021-2022',12,115),(31,2020,'2020-2021',7,130),(32,2020,'2020-2021',8,132),(33,2020,'2020-2021',9,162),(34,2020,'2020-2021',10,113),(35,2020,'2020-2021',11,83),(36,2020,'2020-2021',12,70),(37,2019,'2019-2020',7,186),(38,2019,'2019-2020',8,199),(39,2019,'2019-2020',9,167),(40,2019,'2019-2020',10,139),(41,2019,'2019-2020',11,79),(42,2019,'2019-2020',12,65),(43,2018,'2018-2019',7,219),(44,2018,'2018-2019',8,183),(45,2018,'2018-2019',9,155),(46,2018,'2018-2019',10,117),(47,2018,'2018-2019',11,82),(48,2018,'2018-2019',12,67);
/*!40000 ALTER TABLE `student_population` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `student_prmodel`
--

DROP TABLE IF EXISTS `student_prmodel`;
/*!50001 DROP VIEW IF EXISTS `student_prmodel`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_prmodel` AS SELECT 
 1 AS `allYear`,
 1 AS `gradeyr_level`,
 1 AS `actual_students`,
 1 AS `forecasted_students`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_title` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (13,'English 7','2025-09-18 10:02:53.439825','2025-10-10 08:57:28.634067',2),(14,'Science 7','2025-09-18 10:03:00.595339','2025-10-10 08:57:28.635420',2),(15,'Filipino 7','2025-10-09 22:33:04.344922','2025-10-09 22:34:48.000000',2),(16,'English 1','2025-10-10 09:24:43.278919','2025-10-10 09:24:43.278919',1),(19,'Math 7','2025-10-22 10:03:16.967679','2025-10-22 10:03:16.967679',2);
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_module`
--

DROP TABLE IF EXISTS `sys_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `route` varchar(255) DEFAULT NULL,
  `isParent` tinyint NOT NULL DEFAULT '0',
  `parentID` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_a2691c23f13e01cdce3e4d5775` (`title`,`parentID`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_module`
--

LOCK TABLES `sys_module` WRITE;
/*!40000 ALTER TABLE `sys_module` DISABLE KEYS */;
INSERT INTO `sys_module` VALUES (13,'Dashboard','mdi-monitor-dashboard','/dashboard',0,NULL,'2023-05-19 15:09:26.311827','2024-11-28 08:51:26.000000'),(14,'Accounts','mdi-account-multiple-check','/acc_verify',0,NULL,'2023-05-19 15:09:26.314742','2024-11-28 09:02:53.000000'),(19,'My Account','mdi-account',NULL,1,NULL,'2023-05-19 15:17:14.381372','2023-05-22 11:58:24.296314'),(28,'Utilities','mdi-format-list-bulleted',NULL,1,NULL,'2023-05-19 15:17:14.382697','2023-05-22 12:00:28.764484'),(35,'User Modules','mdi-animation-outline','/user-modules',0,NULL,'2023-05-19 15:17:14.384815','2023-05-22 12:00:28.765818'),(36,'Settings','mdi-cog-outline',NULL,1,NULL,'2023-05-19 15:17:14.385117','2023-05-22 12:00:28.765974'),(37,'Profile','mdi-account-circle-outline','/profile',0,NULL,'2023-05-19 15:17:14.385462','2023-09-18 09:23:00.755516'),(41,'Modules','mdi-account-group-outline',NULL,1,NULL,'2023-05-22 10:24:21.248736','2024-11-26 13:46:36.000000'),(100,'Faculty','mdi-account-supervisor',NULL,1,NULL,'2024-11-26 13:49:30.799107','2024-11-26 13:49:30.799107'),(101,'Enroll Student','mdi-email-fast','/enroll-student',0,'41','2024-11-29 10:25:49.119496','2024-11-29 10:25:49.119496'),(102,'Verify Student','mdi-account-reactivate','/student_verify',0,'41','2024-11-29 10:27:05.567342','2024-11-29 10:27:05.567342'),(103,'Subjects','mdi-file-multiple','/create-subject',0,'28','2024-11-29 15:17:28.067806','2025-10-14 11:58:08.000000'),(104,'Rooms','mdi-google-classroom','/high-school-rooms',0,'28','2024-11-29 23:07:14.841414','2025-10-14 12:01:04.000000'),(105,'Tracks','mdi-file','/add-tracks',0,'28','2024-11-30 10:37:31.058863','2024-11-30 10:37:31.058863'),(106,'Strand','mdi-file','/add-strands',0,'28','2024-11-30 13:33:44.978682','2024-11-30 13:33:44.978682'),(107,'Program','mdi-file-arrow-up-down','/classroom-programm',0,'28','2024-12-03 08:17:03.997912','2025-10-14 12:01:27.000000'),(108,'Faculty Schedule','mdi-list-status','/faculty-schedule',0,'25','2024-12-04 10:34:16.467151','2024-12-04 10:34:16.467151'),(109,'My Schedule','mdi-microsoft-excel','/my-scheduled-program',0,'25','2024-12-04 11:03:22.365765','2024-12-04 11:03:22.365765'),(110,'Room','mdi-google-classroom','/elementary-rooms',0,'28','2024-12-06 22:25:38.889383','2025-10-14 12:02:48.000000'),(111,'Program','mdi-newspaper-variant-multiple-outline',NULL,1,NULL,'2024-12-06 22:30:48.498773','2024-12-06 22:32:43.000000'),(112,'Programs','mdi-file-arrow-up-down','/elementary-programm',0,'111','2024-12-06 22:44:34.340933','2025-10-14 12:03:29.000000'),(113,'School Year','mdi-calendar-check','/add-school-year',0,'28','2024-12-11 15:56:44.587130','2024-12-11 15:56:44.587130'),(114,'My Subjects','mdi-file','/my-student-record',0,'41','2025-09-18 17:36:04.280009','2026-02-27 22:53:30.000000');
/*!40000 ALTER TABLE `sys_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_grade_level`
--

DROP TABLE IF EXISTS `teacher_grade_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_grade_level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grade_level` varchar(255) NOT NULL,
  `teachersId` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_grade_level`
--

LOCK TABLES `teacher_grade_level` WRITE;
/*!40000 ALTER TABLE `teacher_grade_level` DISABLE KEYS */;
INSERT INTO `teacher_grade_level` VALUES (6,'7','17','2025-09-18 09:56:20.351770','2025-09-18 09:56:20.351770'),(7,'8','17','2025-09-18 09:56:20.362174','2025-09-18 09:56:20.362174'),(9,'1','21','2025-09-18 10:08:02.102533','2025-09-18 10:08:02.102533'),(18,'7','25','2025-10-18 10:49:52.367581','2025-10-18 10:49:52.367581'),(19,'8','25','2025-10-18 10:49:52.383768','2025-10-18 10:49:52.383768');
/*!40000 ALTER TABLE `teacher_grade_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_population`
--

DROP TABLE IF EXISTS `teacher_population`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_population` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year_start` int DEFAULT NULL,
  `academic_year` varchar(15) DEFAULT NULL,
  `gradeyr_level` int DEFAULT NULL,
  `teacher_count` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_population`
--

LOCK TABLES `teacher_population` WRITE;
/*!40000 ALTER TABLE `teacher_population` DISABLE KEYS */;
INSERT INTO `teacher_population` VALUES (1,2025,'2025-2026',7,8),(2,2025,'2025-2026',8,8),(3,2025,'2025-2026',9,8),(4,2025,'2025-2026',10,8),(5,2025,'2025-2026',11,7),(6,2025,'2025-2026',12,6),(7,2024,'2024-2025',7,9),(8,2024,'2024-2025',8,8),(9,2024,'2024-2025',9,8),(10,2024,'2024-2025',10,8),(11,2024,'2024-2025',11,7),(12,2024,'2024-2025',12,6),(13,2023,'2023-2024',7,9),(14,2023,'2023-2024',8,8),(15,2023,'2023-2024',9,10),(16,2023,'2023-2024',10,8),(17,2023,'2023-2024',11,7),(18,2023,'2023-2024',12,6),(19,2022,'2022-2023',7,9),(20,2022,'2022-2023',8,8),(21,2022,'2022-2023',9,9),(22,2022,'2022-2023',10,8),(23,2022,'2022-2023',11,5),(24,2022,'2022-2023',12,4),(25,2021,'2021-2022',7,9),(26,2021,'2021-2022',8,8),(27,2021,'2021-2022',9,9),(28,2021,'2021-2022',10,8),(29,2021,'2021-2022',11,4),(30,2021,'2021-2022',12,4),(31,2020,'2020-2021',7,9),(32,2020,'2020-2021',8,8),(33,2020,'2020-2021',9,9),(34,2020,'2020-2021',10,8),(35,2020,'2020-2021',11,4),(36,2020,'2020-2021',12,4),(37,2019,'2019-2020',7,9),(38,2019,'2019-2020',8,8),(39,2019,'2019-2020',9,9),(40,2019,'2019-2020',10,8),(41,2019,'2019-2020',11,4),(42,2019,'2019-2020',12,4),(43,2018,'2018-2019',7,8),(44,2018,'2018-2019',8,7),(45,2018,'2018-2019',9,6),(46,2018,'2018-2019',10,6),(47,2018,'2018-2019',11,4),(48,2018,'2018-2019',12,4),(49,2017,'2017-2018',7,8),(50,2017,'2017-2018',8,7),(51,2017,'2017-2018',9,6),(52,2017,'2017-2018',10,6),(53,2017,'2017-2018',11,4),(54,2017,'2017-2018',12,4),(55,2016,'2016-2017',7,8),(56,2016,'2016-2017',8,7),(57,2016,'2016-2017',9,6),(58,2016,'2016-2017',10,6),(59,2016,'2016-2017',11,4),(60,2016,'2016-2017',12,4);
/*!40000 ALTER TABLE `teacher_population` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_subject`
--

DROP TABLE IF EXISTS `teacher_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subjectId` varchar(255) NOT NULL,
  `teachersId` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_subject`
--

LOCK TABLES `teacher_subject` WRITE;
/*!40000 ALTER TABLE `teacher_subject` DISABLE KEYS */;
INSERT INTO `teacher_subject` VALUES (6,'13','17','2025-09-18 10:04:23.924382','2025-09-18 10:04:23.924382'),(7,'14','17','2025-09-18 10:04:23.935770','2025-09-18 10:04:23.935770'),(8,'13','21','2025-09-18 10:05:56.534907','2025-09-18 10:05:56.534907'),(9,'14','21','2025-09-19 13:50:53.201900','2025-09-19 13:50:53.201900'),(10,'13','25','2025-10-18 10:49:19.312156','2025-10-18 10:49:19.312156'),(11,'15','25','2025-10-18 10:49:19.320560','2025-10-18 10:49:19.320560'),(12,'14','25','2025-10-18 10:49:19.325685','2025-10-18 10:49:19.325685'),(13,'19','17','2025-10-22 10:08:02.943740','2025-10-22 10:08:02.943740');
/*!40000 ALTER TABLE `teacher_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_detail`
--

DROP TABLE IF EXISTS `user_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fname` varchar(50) NOT NULL,
  `mname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) NOT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `bdate` varchar(10) DEFAULT NULL,
  `birth_place` varchar(255) DEFAULT NULL,
  `sex` varchar(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `civil_status` varchar(50) DEFAULT NULL,
  `civil_status_others` varchar(50) DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `weight` varchar(10) DEFAULT NULL,
  `blood_type` varchar(10) DEFAULT NULL,
  `GSIS` varchar(255) DEFAULT NULL,
  `PHILHEALTH` varchar(255) DEFAULT NULL,
  `PAGIBIG` varchar(255) DEFAULT NULL,
  `SSS` varchar(255) DEFAULT NULL,
  `TIN` varchar(100) DEFAULT NULL,
  `agency_employee_num` varchar(255) DEFAULT NULL,
  `is_dual_citizen` tinyint NOT NULL DEFAULT '0',
  `citizenship` varchar(100) DEFAULT NULL,
  `citizenship_type` int DEFAULT NULL,
  `country` int DEFAULT NULL,
  `tel_no` varchar(100) DEFAULT NULL,
  `mobile_no` varchar(13) DEFAULT NULL,
  `residential_zip` varchar(255) DEFAULT NULL,
  `residential_house_no` varchar(255) DEFAULT NULL,
  `residential_street` varchar(255) DEFAULT NULL,
  `residential_subd` varchar(255) DEFAULT NULL,
  `residential_brgy` varchar(255) DEFAULT NULL,
  `residential_city` varchar(255) DEFAULT NULL,
  `residential_prov` varchar(255) DEFAULT NULL,
  `permanent_zip` varchar(255) DEFAULT NULL,
  `permanent_house_no` varchar(255) DEFAULT NULL,
  `permanent_street` varchar(255) DEFAULT NULL,
  `permanent_subd` varchar(255) DEFAULT NULL,
  `permanent_brgy` varchar(255) DEFAULT NULL,
  `permanent_city` varchar(255) DEFAULT NULL,
  `permanent_prov` varchar(255) DEFAULT NULL,
  `isApproved` tinyint DEFAULT '0',
  `status` int NOT NULL DEFAULT '1',
  `isSameAddress` tinyint DEFAULT NULL,
  `date_approved` datetime DEFAULT NULL,
  `userID` int DEFAULT NULL,
  `profile_img` varchar(150) DEFAULT NULL,
  `allowedPDSUpdateID` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `hired` varchar(10) DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `cs_eligibility` varchar(255) DEFAULT NULL,
  `grade_experience` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_detail`
--

LOCK TABLES `user_detail` WRITE;
/*!40000 ALTER TABLE `user_detail` DISABLE KEYS */;
INSERT INTO `user_detail` VALUES (3,'admin','admin','admin','',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'09070804101',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2024-11-25 20:50:36',3,'Asuncion National High Scholl1732615871725-979202079.png',NULL,'2024-11-25 20:50:36.460980','2025-09-19 14:34:00.053395',NULL,NULL,NULL,NULL,NULL,NULL),(6,'super','admin','superadmin','',NULL,NULL,'Female',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'09070804101',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2024-11-25 20:50:36',34,NULL,NULL,'2024-11-25 21:08:03.715788','2025-09-19 11:52:02.403604',NULL,NULL,NULL,NULL,NULL,NULL),(17,'teacher','','teacher','',NULL,NULL,'Female',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'09090909099',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,NULL,NULL,45,NULL,NULL,'2024-11-28 08:12:45.250612','2026-02-27 11:59:21.000000','2018-02-28',NULL,NULL,NULL,NULL,NULL),(18,'Head','','Teacher','',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,NULL,NULL,46,NULL,NULL,'2024-11-28 09:56:38.068963','2025-10-29 10:23:53.000000','2022-08-23','Masters Degree','CS PASSER','2','STEM','Techer II'),(21,'elementary','','elementary','',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,NULL,NULL,49,NULL,NULL,'2025-09-15 14:47:18.404612','2026-03-04 21:25:47.787212',NULL,NULL,NULL,NULL,NULL,NULL),(23,'teacher2','','Teacher2','',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,NULL,NULL,51,NULL,NULL,'2025-10-09 22:27:25.790885','2026-03-04 21:25:57.966422',NULL,NULL,NULL,NULL,NULL,NULL),(24,'Elementary','','Head','',NULL,NULL,'Female',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,NULL,NULL,52,'openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761703447619-940867541.png',NULL,'2025-10-10 08:49:39.454104','2026-03-04 21:25:47.795748',NULL,NULL,NULL,NULL,NULL,NULL),(25,'Teressa Grania ','','Jumawan','',NULL,NULL,'Female',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'09300640033',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,NULL,NULL,53,NULL,NULL,'2025-10-18 10:42:35.458185','2025-10-18 10:48:57.000000','2016-05-11','Masters ',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,'Non-Teaching'),(2,'Teaching');
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_type` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_5921d39f238500cd132fcf2b3a` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES (1,'Admin'),(2,'Teacher');
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `usertypeID` int DEFAULT NULL,
  `user_roleID` int DEFAULT NULL,
  `assignedModuleID` int DEFAULT '2',
  `otp` text,
  `isValidated` tinyint NOT NULL DEFAULT '1',
  `isAdminApproved` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'admin@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',1,1,1,'$2b$10$p1N5VM.MTk9svXucVFn/m.NI80Y00pyfagUDOSVUuEeuV9JOPRAwK',1,1,'2024-11-25 20:50:36.455566','2024-11-28 08:46:56.000000'),(34,'superadmin@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',1,1,4,NULL,1,1,'2024-11-25 21:08:03.709020','2025-09-11 12:43:41.142179'),(45,'teacher@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',2,2,2,'$2b$10$KEVnaBzeK177VGdiWr3PauSjXk4QFP3IJxlTjzNZDHWT1gBdaiAGq',1,1,'2024-11-28 08:12:45.244260','2026-02-27 11:59:21.000000'),(46,'headhighschool@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',1,1,3,'$2b$10$zSyrkBw5lbU8Vpnb65b8CelETm7QOPqsiMHgnvqoOYcyhB8u35buu',1,1,'2024-11-28 09:56:38.065496','2025-10-13 08:55:59.801053'),(49,'elementary@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',2,2,2,'$2b$10$YukunTWxeLl82.ANdeOhi.QVngJu8oppAAZopzLRlAGoOzyFDHe7a',1,1,'2025-09-15 14:47:18.400997','2025-10-18 12:29:50.000000'),(51,'teacher2@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',2,2,2,'$2b$10$0vwaPAACZ0ftUeHbtBpU.OERKTAdtX8VwNRC2qDySeEMJDgQCqQ1K',1,1,'2025-10-09 22:27:25.786626','2025-10-13 08:54:58.252212'),(52,'headelementary@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',1,1,21,'$2b$10$uTi.V1OhSsb/eIUaY5lmJ.czqtuNuUe5FAcBAVQ5qEDjyqOdNaIqS',1,1,'2025-10-10 08:49:39.450824','2025-10-13 08:54:58.252873'),(53,'teressagrania.jumawan@yahoo.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',2,2,2,'$2b$10$labRhHkRdqY5E7o8dUg88eZ7xpyY1SDYQxHexwt6eaaadYEciZFuS',1,1,'2025-10-18 10:42:35.443703','2026-03-10 15:04:10.456173');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'school_management'
--

--
-- Dumping routines for database 'school_management'
--
/*!50003 DROP PROCEDURE IF EXISTS `GenerateEnrollmentSummary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerateEnrollmentSummary`()
BEGIN
    DECLARE active_sy INT;

    -- Get active school year
    SELECT id INTO active_sy
    FROM school_year
    WHERE status = 1
    LIMIT 1;

    -- Delete previous summary for that SY
    DELETE FROM enrollment_summary
    WHERE school_year_id = active_sy;

    /* ==============================
       JUNIOR HIGH (Grade 7–10)
       ============================== */
    INSERT INTO enrollment_summary (
        school_year_id,
        grade_level,
        track,
        male_count,
        female_count,
        total_count
    )
    SELECT
        active_sy,
        grade_level,
        NULL,
        SUM(CASE WHEN sex = 'Male' THEN 1 ELSE 0 END) AS male_count,
        SUM(CASE WHEN sex = 'Female' THEN 1 ELSE 0 END) AS female_count,
        COUNT(*) AS total_count
    FROM enroll_student
    WHERE school_yearId = active_sy
      AND grade_level IN ('Grade 7','Grade 8','Grade 9','Grade 10')
      AND statusEnrolled = 1
    GROUP BY grade_level;

    /* ==============================
       SENIOR HIGH (Grade 11–12 by Track)
       ============================== */
    INSERT INTO enrollment_summary (
        school_year_id,
        grade_level,
        track,
        male_count,
        female_count,
        total_count
    )
    SELECT
        active_sy,
        grade_level,
        track,
        SUM(CASE WHEN sex = 'Male' THEN 1 ELSE 0 END),
        SUM(CASE WHEN sex = 'Female' THEN 1 ELSE 0 END),
        COUNT(*)
    FROM enroll_student
    WHERE school_yearId = active_sy
      AND grade_level IN ('Grade 11','Grade 12')
      AND statusEnrolled = 1
    GROUP BY grade_level, track;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `report_forcasteddata_by_gradelevel`
--

/*!50001 DROP VIEW IF EXISTS `report_forcasteddata_by_gradelevel`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `report_forcasteddata_by_gradelevel` AS select `a`.`allYear` AS `allYear`,`a`.`gradeyr_level` AS `gradeyr_level`,`a`.`actual_students` AS `actual_students`,`a`.`exponential_smoothing` AS `forecasted_students`,`b`.`teacher_count` AS `teacher_count`,ceiling((`a`.`exponential_smoothing` / 30)) AS `teachers_needed`,`c`.`room_count` AS `room_count`,ceiling((`a`.`exponential_smoothing` / 40)) AS `classrooms_needed` from ((`student_combinedforecasts` `a` left join `teacher_population` `b` on(((`a`.`allYear` = `b`.`year_start`) and (`a`.`gradeyr_level` = `b`.`gradeyr_level`)))) left join `room_population` `c` on(((`a`.`allYear` = `c`.`year_start`) and (`a`.`gradeyr_level` = `c`.`gradeyr_level`)))) order by `a`.`gradeyr_level`,`a`.`allYear` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `student_cesmodel`
--

/*!50001 DROP VIEW IF EXISTS `student_cesmodel`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_cesmodel` AS with recursive `exp_model` as (select `student_population`.`year_start` AS `allYear`,`student_population`.`gradeyr_level` AS `gradeyr_level`,`student_population`.`student_count` AS `actual_students`,`student_population`.`student_count` AS `level`,0 AS `trend`,`student_population`.`student_count` AS `forecast` from `student_population` where (`student_population`.`year_start` = (select min(`student_population`.`year_start`) from `student_population`)) union all select (`e`.`allYear` + 1) AS `allYear`,`e`.`gradeyr_level` AS `gradeyr_level`,`h`.`student_count` AS `actual_students`,(case when (`h`.`student_count` is not null) then ((0.3 * `h`.`student_count`) + (0.7 * (`e`.`level` + `e`.`trend`))) else (`e`.`level` + `e`.`trend`) end) AS `level`,(case when (`h`.`student_count` is not null) then ((0.2 * (((0.3 * `h`.`student_count`) + (0.7 * (`e`.`level` + `e`.`trend`))) - `e`.`level`)) + (0.8 * `e`.`trend`)) else `e`.`trend` end) AS `trend`,(`e`.`level` + `e`.`trend`) AS `forecast` from (`exp_model` `e` left join `student_population` `h` on(((`h`.`year_start` = (`e`.`allYear` + 1)) and (`h`.`gradeyr_level` = `e`.`gradeyr_level`)))) where (`e`.`allYear` < 2032)) select `exp_model`.`allYear` AS `allYear`,`exp_model`.`gradeyr_level` AS `gradeyr_level`,`exp_model`.`actual_students` AS `actual_students`,round(`exp_model`.`forecast`,0) AS `forecasted_students` from `exp_model` order by `exp_model`.`gradeyr_level`,`exp_model`.`allYear` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `student_combinedforecasts`
--

/*!50001 DROP VIEW IF EXISTS `student_combinedforecasts`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_combinedforecasts` AS select `l`.`allYear` AS `allYear`,`l`.`gradeyr_level` AS `gradeyr_level`,`l`.`actual_students` AS `actual_students`,`l`.`forecasted_students` AS `linear_regression`,`p`.`forecasted_students` AS `polynomial_regression`,`e`.`forecasted_students` AS `exponential_smoothing` from ((`student_lrmodel` `l` left join `student_prmodel` `p` on(((`l`.`allYear` = `p`.`allYear`) and (`l`.`gradeyr_level` = `p`.`gradeyr_level`)))) left join `student_cesmodel` `e` on(((`l`.`allYear` = `e`.`allYear`) and (`l`.`gradeyr_level` = `e`.`gradeyr_level`)))) order by `l`.`gradeyr_level`,`l`.`allYear` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `student_linearregression`
--

/*!50001 DROP VIEW IF EXISTS `student_linearregression`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_linearregression` AS select ((select (min(`student_population`.`year_start`) + 4) from `student_population`) + `s`.`seq`) AS `forecast_year`,`m`.`gradeyr_level` AS `gradeyr_level`,round((`m`.`intercept` + (`m`.`slope` * (`m`.`n` + `s`.`seq`))),0) AS `forecasted_students` from ((select `student_lrcomponents`.`gradeyr_level` AS `gradeyr_level`,(((`student_lrcomponents`.`n` * `student_lrcomponents`.`sum_xy`) - (`student_lrcomponents`.`sum_x` * `student_lrcomponents`.`sum_y`)) / ((`student_lrcomponents`.`n` * `student_lrcomponents`.`sum_x2`) - (`student_lrcomponents`.`sum_x` * `student_lrcomponents`.`sum_x`))) AS `slope`,((`student_lrcomponents`.`sum_y` - ((((`student_lrcomponents`.`n` * `student_lrcomponents`.`sum_xy`) - (`student_lrcomponents`.`sum_x` * `student_lrcomponents`.`sum_y`)) / ((`student_lrcomponents`.`n` * `student_lrcomponents`.`sum_x2`) - (`student_lrcomponents`.`sum_x` * `student_lrcomponents`.`sum_x`))) * `student_lrcomponents`.`sum_x`)) / `student_lrcomponents`.`n`) AS `intercept`,`student_lrcomponents`.`n` AS `n` from (select `student_index`.`gradeyr_level` AS `gradeyr_level`,count(0) AS `n`,sum(`student_index`.`year_index`) AS `sum_x`,sum(`student_index`.`student_count`) AS `sum_y`,sum((`student_index`.`year_index` * `student_index`.`student_count`)) AS `sum_xy`,sum((`student_index`.`year_index` * `student_index`.`year_index`)) AS `sum_x2` from (select row_number() OVER (PARTITION BY `student_population`.`gradeyr_level` ORDER BY `student_population`.`year_start` )  AS `year_index`,`student_population`.`year_start` AS `year_start`,`student_population`.`gradeyr_level` AS `gradeyr_level`,`student_population`.`student_count` AS `student_count` from `student_population`) `student_index` group by `student_index`.`gradeyr_level`) `student_lrcomponents`) `m` join `forecast_sequence` `s`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `student_lrmodel`
--

/*!50001 DROP VIEW IF EXISTS `student_lrmodel`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_lrmodel` AS select `y`.`allYear` AS `allYear`,`g`.`gradeyr_level` AS `gradeyr_level`,`sp`.`student_count` AS `actual_students`,`fsp`.`forecasted_students` AS `forecasted_students` from ((((select `student_population`.`year_start` AS `allYear` from `student_population` union select `student_linearregression`.`forecast_year` AS `allYear` from `student_linearregression`) `y` join (select distinct `student_population`.`gradeyr_level` AS `gradeyr_level` from `student_population` union select distinct `student_linearregression`.`gradeyr_level` AS `gradeyr_level` from `student_linearregression`) `g`) left join `student_population` `sp` on(((`sp`.`year_start` = `y`.`allYear`) and (`sp`.`gradeyr_level` = `g`.`gradeyr_level`)))) left join `student_linearregression` `fsp` on(((`fsp`.`forecast_year` = `y`.`allYear`) and (`fsp`.`gradeyr_level` = `g`.`gradeyr_level`)))) order by `g`.`gradeyr_level`,`y`.`allYear` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `student_polynomialregression`
--

/*!50001 DROP VIEW IF EXISTS `student_polynomialregression`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_polynomialregression` AS select `p`.`gradeyr_level` AS `gradeyr_level`,((select (min(`student_population`.`year_start`) + 4) from `student_population`) + `s`.`seq`) AS `forecast_year`,round(((`p`.`a` + (`p`.`b` * (`c`.`n` + `s`.`seq`))) + (`p`.`c` * pow((`c`.`n` + `s`.`seq`),2))),0) AS `forecasted_students` from ((`student_polynomialmodel` `p` join (select `student_indexed`.`gradeyr_level` AS `gradeyr_level`,count(0) AS `n`,sum(`student_indexed`.`year_index`) AS `sum_x`,sum(pow(`student_indexed`.`year_index`,2)) AS `sum_x2`,sum(pow(`student_indexed`.`year_index`,3)) AS `sum_x3`,sum(pow(`student_indexed`.`year_index`,4)) AS `sum_x4`,sum(`student_indexed`.`student_count`) AS `sum_y`,sum((`student_indexed`.`year_index` * `student_indexed`.`student_count`)) AS `sum_xy`,sum((pow(`student_indexed`.`year_index`,2) * `student_indexed`.`student_count`)) AS `sum_x2y` from (select `student_population`.`year_start` AS `year_start`,`student_population`.`gradeyr_level` AS `gradeyr_level`,`student_population`.`student_count` AS `student_count`,row_number() OVER (PARTITION BY `student_population`.`gradeyr_level` ORDER BY `student_population`.`year_start` )  AS `year_index` from `student_population`) `student_indexed` group by `student_indexed`.`gradeyr_level`) `c` on((`p`.`gradeyr_level` = `c`.`gradeyr_level`))) join `forecast_sequence` `s`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `student_prmodel`
--

/*!50001 DROP VIEW IF EXISTS `student_prmodel`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_prmodel` AS select `y`.`allYear` AS `allYear`,`g`.`gradeyr_level` AS `gradeyr_level`,coalesce(`sp`.`student_count`,0) AS `actual_students`,coalesce(`pr`.`forecasted_students`,0) AS `forecasted_students` from ((((select `student_population`.`year_start` AS `allYear` from `student_population` union select `student_polynomialregression`.`forecast_year` AS `allYear` from `student_polynomialregression`) `y` join (select distinct `student_population`.`gradeyr_level` AS `gradeyr_level` from `student_population` union select distinct `student_polynomialregression`.`gradeyr_level` AS `gradeyr_level` from `student_polynomialregression`) `g`) left join `student_population` `sp` on(((`sp`.`year_start` = `y`.`allYear`) and (`sp`.`gradeyr_level` = `g`.`gradeyr_level`)))) left join `student_polynomialregression` `pr` on(((`pr`.`forecast_year` = `y`.`allYear`) and (`pr`.`gradeyr_level` = `g`.`gradeyr_level`)))) order by `g`.`gradeyr_level`,`y`.`allYear` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-10 22:21:44
