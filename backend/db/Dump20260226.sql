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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `add_tracks`
--

LOCK TABLES `add_tracks` WRITE;
/*!40000 ALTER TABLE `add_tracks` DISABLE KEYS */;
INSERT INTO `add_tracks` VALUES (3,'TVL','2024-11-30 17:54:36.015650','2024-11-30 17:54:36.015650'),(4,'Academic','2024-11-30 17:54:44.767478','2025-10-18 11:41:16.000000');
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_module`
--

LOCK TABLES `assigned_module` WRITE;
/*!40000 ALTER TABLE `assigned_module` DISABLE KEYS */;
INSERT INTO `assigned_module` VALUES (1,'Admin Default','2023-05-23 15:53:16.339189','2025-11-12 08:52:22.000000','[13,14,36,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":36,\"title\":\"Settings\",\"icon\":\"mdi-cog-outline\",\"route\":null,\"parentID\":null,\"isParent\":1,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-05-22T04:00:28.765Z\",\"subLink\":[{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]}]'),(2,'Teacher','2023-05-22 10:38:21.180318','2025-10-13 08:50:38.000000','[13,102,109,114,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":102,\"title\":\"Verify Student\",\"icon\":\"mdi-account-reactivate\",\"route\":\"/student_verify\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2024-11-29T02:27:05.567Z\",\"updatedAt\":\"2024-11-29T02:27:05.567Z\"},{\"id\":109,\"title\":\"My Schedule\",\"icon\":\"mdi-microsoft-excel\",\"route\":\"/my-scheduled-program\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T03:03:22.365Z\",\"updatedAt\":\"2024-12-04T03:03:22.365Z\"},{\"id\":114,\"title\":\"Attendance\",\"icon\":\"mdi-qrcode\",\"route\":\"/my-student-record\",\"parentID\":\"41\",\"isParent\":0,\"createdAt\":\"2025-09-18T09:36:04.280Z\",\"updatedAt\":\"2025-09-18T09:36:04.280Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]'),(3,'High School Head','2023-05-22 10:39:26.546590','2025-10-20 16:04:10.000000','[13,14,108,105,106,104,103,107,113,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":108,\"title\":\"Faculty Schedule\",\"icon\":\"mdi-list-status\",\"route\":\"/faculty-schedule\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T02:34:16.467Z\",\"updatedAt\":\"2024-12-04T02:34:16.467Z\"},{\"id\":105,\"title\":\"Tracks\",\"icon\":\"mdi-file\",\"route\":\"/add-tracks\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-30T02:37:31.058Z\",\"updatedAt\":\"2024-11-30T02:37:31.058Z\"},{\"id\":106,\"title\":\"Strand\",\"icon\":\"mdi-file\",\"route\":\"/add-strands\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-30T05:33:44.978Z\",\"updatedAt\":\"2024-11-30T05:33:44.978Z\"},{\"id\":104,\"title\":\"Rooms\",\"icon\":\"mdi-google-classroom\",\"route\":\"/high-school-rooms\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-29T15:07:14.841Z\",\"updatedAt\":\"2025-10-14T04:01:04.000Z\"},{\"id\":103,\"title\":\"Subjects\",\"icon\":\"mdi-file-multiple\",\"route\":\"/create-subject\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-29T07:17:28.067Z\",\"updatedAt\":\"2025-10-14T03:58:08.000Z\"},{\"id\":107,\"title\":\"Program\",\"icon\":\"mdi-file-arrow-up-down\",\"route\":\"/classroom-programm\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-03T00:17:03.997Z\",\"updatedAt\":\"2025-10-14T04:01:27.000Z\"},{\"id\":113,\"title\":\"School Year\",\"icon\":\"mdi-calendar-check\",\"route\":\"/add-school-year\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-11T07:56:44.587Z\",\"updatedAt\":\"2024-12-11T07:56:44.587Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]'),(4,'Superadmin','2023-05-22 10:40:40.474410','2024-12-04 16:48:57.000000','[13,14,41,42,35,36,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":41,\"title\":\"Modules\",\"icon\":\"mdi-account-group-outline\",\"route\":null,\"parentID\":null,\"isParent\":1,\"createdAt\":\"2023-05-22T02:24:21.248Z\",\"updatedAt\":\"2023-05-22T04:00:28.768Z\",\"subLink\":[{\"id\":42,\"title\":\"List\",\"icon\":\"mdi-text-box-outline\",\"route\":\"/modules-list\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-22T02:24:21.250Z\",\"updatedAt\":\"2023-05-22T04:00:28.769Z\"},{\"id\":35,\"title\":\"User Modules\",\"icon\":\"mdi-animation-outline\",\"route\":\"/user-modules\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.384Z\",\"updatedAt\":\"2023-05-22T04:00:28.765Z\"}]},{\"id\":36,\"title\":\"Settings\",\"icon\":\"mdi-cog-outline\",\"route\":null,\"parentID\":null,\"isParent\":1,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-05-22T04:00:28.765Z\",\"subLink\":[{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-14T01:00:40.000Z\"}]}]'),(21,'Elementary Head','2025-10-10 08:42:30.100523','2025-10-14 12:03:44.000000','[13,14,108,103,110,112,113,37]','[{\"id\":13,\"title\":\"Dashboard\",\"icon\":\"mdi-monitor-dashboard\",\"route\":\"/dashboard\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.311Z\",\"updatedAt\":\"2024-11-28T00:51:26.000Z\"},{\"id\":14,\"title\":\"Accounts\",\"icon\":\"mdi-account-multiple-check\",\"route\":\"/acc_verify\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:09:26.314Z\",\"updatedAt\":\"2024-11-28T01:02:53.000Z\"},{\"id\":108,\"title\":\"Faculty Schedule\",\"icon\":\"mdi-list-status\",\"route\":\"/faculty-schedule\",\"parentID\":\"25\",\"isParent\":0,\"createdAt\":\"2024-12-04T02:34:16.467Z\",\"updatedAt\":\"2024-12-04T02:34:16.467Z\"},{\"id\":103,\"title\":\"Subjects\",\"icon\":\"mdi-file-multiple\",\"route\":\"/create-subject\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-11-29T07:17:28.067Z\",\"updatedAt\":\"2025-10-14T03:58:08.000Z\"},{\"id\":110,\"title\":\"Room\",\"icon\":\"mdi-google-classroom\",\"route\":\"/elementary-rooms\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-06T14:25:38.889Z\",\"updatedAt\":\"2025-10-14T04:02:48.000Z\"},{\"id\":112,\"title\":\"Programs\",\"icon\":\"mdi-file-arrow-up-down\",\"route\":\"/elementary-programm\",\"parentID\":\"111\",\"isParent\":0,\"createdAt\":\"2024-12-06T14:44:34.340Z\",\"updatedAt\":\"2025-10-14T04:03:29.000Z\"},{\"id\":113,\"title\":\"School Year\",\"icon\":\"mdi-calendar-check\",\"route\":\"/add-school-year\",\"parentID\":\"28\",\"isParent\":0,\"createdAt\":\"2024-12-11T07:56:44.587Z\",\"updatedAt\":\"2024-12-11T07:56:44.587Z\"},{\"id\":37,\"title\":\"Profile\",\"icon\":\"mdi-account-circle-outline\",\"route\":\"/profile\",\"parentID\":null,\"isParent\":0,\"createdAt\":\"2023-05-19T07:17:14.385Z\",\"updatedAt\":\"2023-09-18T01:23:00.755Z\"}]');
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
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability`
--

LOCK TABLES `availability` WRITE;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
INSERT INTO `availability` VALUES (17,25,'Tuesday','2025-10-21 09:31:20.712305','2025-10-21 09:31:20.712305',13,1,'07:30','08:30','Grade 7','1',2),(18,25,'Wednesday','2025-10-21 09:31:20.717857','2025-10-21 09:31:20.717857',13,1,'07:30','08:30','Grade 7','1',2),(19,25,'Thursday','2025-10-21 09:31:20.722292','2025-10-21 09:31:20.722292',13,1,'07:30','08:30','Grade 7','1',2),(20,25,'Friday','2025-10-21 09:31:20.726016','2025-10-21 09:31:20.726016',13,1,'07:30','08:30','Grade 7','1',2),(21,17,'Monday','2025-10-21 10:02:26.196892','2025-10-21 10:02:26.196892',14,1,'08:30','09:30','Grade 7','1',2),(22,17,'Tuesday','2025-10-21 10:02:26.205735','2025-10-21 10:02:26.205735',14,1,'08:30','09:30','Grade 7','1',2),(23,17,'Wednesday','2025-10-21 10:02:26.209512','2025-10-21 10:02:26.209512',14,1,'08:30','09:30','Grade 7','1',2),(24,17,'Thursday','2025-10-21 10:02:26.214744','2025-10-21 10:02:26.214744',14,1,'08:30','09:30','Grade 7','1',2),(25,17,'Friday','2025-10-21 10:02:26.218672','2025-10-21 10:02:26.218672',14,1,'08:30','09:30','Grade 7','1',2),(57,25,'Tuesday','2025-10-22 09:49:31.900027','2025-10-22 09:49:31.900027',15,1,'10:00','11:00','Grade 7','1',2),(58,25,'Wednesday','2025-10-22 09:49:31.904171','2025-10-22 09:49:31.904171',15,1,'10:00','11:00','Grade 7','1',2),(59,25,'Thursday','2025-10-22 09:49:31.909487','2025-10-22 09:49:31.909487',15,1,'10:00','11:00','Grade 7','1',2),(60,25,'Friday','2025-10-22 09:49:31.912560','2025-10-22 09:49:31.912560',15,1,'10:00','11:00','Grade 7','1',2),(62,17,'Tuesday','2025-10-22 10:08:39.944945','2025-10-24 10:50:32.000000',19,1,'13:00','14:00','Grade 7','1',2),(63,17,'Wednesday','2025-10-22 10:08:39.950229','2025-10-24 10:50:42.000000',19,1,'13:00','14:00','Grade 7','1',2),(64,17,'Thursday','2025-10-22 10:08:39.954189','2025-10-24 10:50:52.000000',19,1,'13:00','14:00','Grade 7','1',2),(65,17,'Friday','2025-10-22 10:08:39.958954','2025-10-24 10:51:02.000000',19,1,'13:00','14:00','Grade 7','1',2),(77,17,'Monday','2025-10-23 22:30:44.484617','2025-10-29 09:10:00.000000',19,1,'13:00','14:00','Grade 7','1',2),(81,25,'Monday','2025-10-28 22:30:46.946647','2025-10-28 22:31:24.000000',15,1,'10:00','11:00','Grade 7','1',2),(83,25,'Monday','2025-10-29 22:02:30.130219','2025-10-29 22:02:30.130219',13,1,'14:00','15:00','Grade 7','1',2);
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enroll_student`
--

LOCK TABLES `enroll_student` WRITE;
/*!40000 ALTER TABLE `enroll_student` DISABLE KEYS */;
INSERT INTO `enroll_student` VALUES (12,'Jhon','Doe','',NULL,NULL,'1997-12-02','Davao City','Male','Single','Junior High',0,0,NULL,0,NULL,NULL,'8101','filter','filter','filter','filter','filter','filter','8101','filter','filter','filter','filter','filter','filter','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'filter','filter','filter','09070804101',NULL,NULL,NULL,NULL,1,'Filipino','2025-09-18 10:16:12.356760','2025-10-29 15:19:17.893598',0,NULL,'Grade 7',NULL,NULL,NULL,2,'openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','0909090909',NULL,NULL),(13,'Test','Test',NULL,NULL,NULL,'2025-10-09',NULL,'Male',NULL,'Elementary',1,0,NULL,0,NULL,NULL,'8105','Test','Test','Test','Test','Test','Test','8105','Test','Test','Test','Test','Test','Test',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Test',NULL,'Test','09090909','Grade 5','Elementary','Panabo Central','30401344',0,'Filipino','2025-10-09 22:15:04.212920','2025-10-29 15:19:17.891278',0,NULL,'Grade 1',NULL,NULL,NULL,2,'openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','09090909',NULL,NULL),(14,'Trial','Trial',NULL,NULL,'','2025-10-09','Davao','Male','Single','Senior High',1,0,NULL,0,NULL,NULL,'8105','Trial','Trial','Trial','Trial','Trial','Trial','8105','Trial','Trial','Trial','Trial','Trial','Trial',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Trial',NULL,'Trial','090909090990543553','Grade 10','2024-2025','Sample','90909099090',1,'Filipino','2025-10-09 22:24:32.495641','2025-10-29 15:19:17.892086',0,NULL,'Grade 11','4','4','3',2,'openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','09090990',NULL,NULL),(15,'Ana','Dela Vega','Santos',NULL,'anaahh@yahoo.com','2009-05-05','davao','Female',NULL,'Elementary',0,0,NULL,0,NULL,'o','8114','123','panas','hhhhhhaakka','hahahahaha','new Corella','davao del norte','8114','123','panas','hhhhhhaakka','hahahahaha','new Corella','davao del norte',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'peter',NULL,'santos','09939933993',NULL,NULL,NULL,NULL,0,'Filipino','2025-10-18 10:37:46.117265','2025-10-29 15:19:17.892559',0,NULL,'Grade 1',NULL,NULL,NULL,2,'openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','09300000000','167','34'),(16,'Paolo','Dela Cueva',NULL,NULL,'paolo.delacueva@yahoo.com','2016-05-06','davao city','Male','Single','Senior High',0,0,NULL,0,NULL,'0','8114','123','Narra','Sampaguita','Poblacion','New Corella','Davao del Norte','8114','123','Narra','Sampaguita','Poblacion','New Corella','Davao del Norte','Raul',NULL,'Dela Cueva','09300540033','Ana',NULL,'Dela Cueva','09300640033','Ruel',NULL,'Dela Cueva','09300640033',NULL,NULL,NULL,NULL,1,'Filipino','2025-10-20 14:36:22.982191','2025-10-29 15:19:17.892998',0,NULL,'Grade 12','4','4','3',2,'openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','09300650033','145','55'),(17,'Love231','Love231',NULL,NULL,NULL,'1997-12-02','313','Male','Single','Junior High',0,0,NULL,0,NULL,NULL,'3131','Love231','Love231','Love231','Love231','Love231','Love231','3131','Love231','Love231','Love231','Love231','Love231','Love231','',NULL,NULL,NULL,'',NULL,NULL,NULL,'','','','',NULL,NULL,NULL,NULL,0,'Filipino','2025-10-28 17:33:33.940160','2025-10-29 15:19:17.893280',0,NULL,'Grade 8',NULL,NULL,NULL,2,'openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png','openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761722226849-116846257.png',NULL,NULL,NULL);
/*!40000 ALTER TABLE `enroll_student` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms_section`
--

LOCK TABLES `rooms_section` WRITE;
/*!40000 ALTER TABLE `rooms_section` DISABLE KEYS */;
INSERT INTO `rooms_section` VALUES (1,'Sampaguita','Grade 7',NULL,25,'2025-10-11 07:00:25.847512','2025-10-22 13:23:27.000000'),(2,'Bonifacio','Grade 8',NULL,NULL,'2025-10-11 07:00:47.464004','2025-10-11 07:00:47.464004'),(3,'Sampalok','Grade 1',NULL,NULL,'2025-10-11 07:25:20.359393','2025-10-14 11:04:47.000000'),(4,'Mangga','Kinder 1',NULL,NULL,'2025-10-14 08:27:27.760700','2025-10-21 20:25:45.588157'),(5,'Sampaguita','Kinder 2',NULL,NULL,'2025-10-14 08:27:36.660993','2025-10-14 08:27:36.660993'),(6,'Waling Waling','Grade 9',NULL,NULL,'2025-10-14 14:28:01.930564','2025-10-14 14:28:01.930564'),(7,'Lawaan','Grade 7',NULL,NULL,'2025-10-18 10:53:31.456120','2025-10-22 13:23:23.000000'),(8,'Mercury','Grade 10',NULL,NULL,'2025-10-21 16:37:36.282142','2025-10-21 16:37:36.282142'),(9,'Mount Apo','Grade 11',3,NULL,'2025-10-21 16:38:02.026046','2025-10-21 16:38:02.026046'),(10,'Newton','Grade 12',5,NULL,'2025-10-21 16:38:28.889855','2025-10-21 16:39:21.077172'),(11,'Waling','Grade 5',NULL,NULL,'2025-10-21 17:05:59.875168','2025-10-21 17:05:59.875168'),(19,'Mahugani','Grade 7',NULL,NULL,'2025-10-21 21:01:17.797146','2025-10-21 21:01:17.797146'),(20,'Bayabas','Kinder 1',NULL,NULL,'2025-10-21 21:07:23.497609','2025-10-21 21:07:32.000000');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_year`
--

LOCK TABLES `school_year` WRITE;
/*!40000 ALTER TABLE `school_year` DISABLE KEYS */;
INSERT INTO `school_year` VALUES (1,'2024-12-04 13:22:49.982239','2025-10-20 08:55:13.858109','2024','2025',0),(2,'2024-12-04 14:13:12.548614','2025-10-20 08:55:13.858501','2025','2026',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_attendance`
--

LOCK TABLES `student_attendance` WRITE;
/*!40000 ALTER TABLE `student_attendance` DISABLE KEYS */;
INSERT INTO `student_attendance` VALUES (59,1,2,17,0,12,19,'2025-10-24','2025-10-24 15:02:11.327922','2025-10-24 15:02:11.327922'),(60,1,2,17,0,12,19,'2025-10-28','2025-10-28 17:56:02.714751','2025-10-28 17:56:02.714751'),(61,1,2,17,0,12,14,'2025-10-28','2025-10-28 20:33:25.227726','2025-10-28 20:33:25.227726'),(62,1,2,17,0,12,19,'2025-10-29','2025-10-29 15:30:16.047224','2025-10-29 15:30:16.047224'),(63,1,2,17,0,12,14,'2025-10-29','2025-10-29 15:31:06.108864','2025-10-29 15:31:06.108864'),(64,1,2,17,0,12,19,'2025-11-08','2025-11-08 13:21:04.191228','2025-11-08 13:21:04.191228'),(65,1,2,17,0,12,14,'2025-11-08','2025-11-08 13:24:30.908454','2025-11-08 13:24:30.908454'),(66,1,2,17,0,12,14,'2025-11-12','2025-11-12 08:56:12.252365','2025-11-12 08:56:12.252365'),(67,1,2,17,0,12,19,'2025-11-12','2025-11-12 09:58:32.420620','2025-11-12 09:58:32.420620');
/*!40000 ALTER TABLE `student_attendance` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_list`
--

LOCK TABLES `student_list` WRITE;
/*!40000 ALTER TABLE `student_list` DISABLE KEYS */;
INSERT INTO `student_list` VALUES (159,12,1,'Grade 7',2,'2025-10-24 09:45:50.207968','2025-10-24 09:45:50.207968',NULL),(165,16,10,'Grade 12',2,'2025-11-13 11:20:37.048765','2025-11-13 11:20:37.048765',5);
/*!40000 ALTER TABLE `student_list` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `sys_module` VALUES (13,'Dashboard','mdi-monitor-dashboard','/dashboard',0,NULL,'2023-05-19 15:09:26.311827','2024-11-28 08:51:26.000000'),(14,'Accounts','mdi-account-multiple-check','/acc_verify',0,NULL,'2023-05-19 15:09:26.314742','2024-11-28 09:02:53.000000'),(19,'My Account','mdi-account',NULL,1,NULL,'2023-05-19 15:17:14.381372','2023-05-22 11:58:24.296314'),(28,'Utilities','mdi-format-list-bulleted',NULL,1,NULL,'2023-05-19 15:17:14.382697','2023-05-22 12:00:28.764484'),(35,'User Modules','mdi-animation-outline','/user-modules',0,NULL,'2023-05-19 15:17:14.384815','2023-05-22 12:00:28.765818'),(36,'Settings','mdi-cog-outline',NULL,1,NULL,'2023-05-19 15:17:14.385117','2023-05-22 12:00:28.765974'),(37,'Profile','mdi-account-circle-outline','/profile',0,NULL,'2023-05-19 15:17:14.385462','2023-09-18 09:23:00.755516'),(41,'Modules','mdi-account-group-outline',NULL,1,NULL,'2023-05-22 10:24:21.248736','2024-11-26 13:46:36.000000'),(100,'Faculty','mdi-account-supervisor',NULL,1,NULL,'2024-11-26 13:49:30.799107','2024-11-26 13:49:30.799107'),(101,'Enroll Student','mdi-email-fast','/enroll-student',0,'41','2024-11-29 10:25:49.119496','2024-11-29 10:25:49.119496'),(102,'Verify Student','mdi-account-reactivate','/student_verify',0,'41','2024-11-29 10:27:05.567342','2024-11-29 10:27:05.567342'),(103,'Subjects','mdi-file-multiple','/create-subject',0,'28','2024-11-29 15:17:28.067806','2025-10-14 11:58:08.000000'),(104,'Rooms','mdi-google-classroom','/high-school-rooms',0,'28','2024-11-29 23:07:14.841414','2025-10-14 12:01:04.000000'),(105,'Tracks','mdi-file','/add-tracks',0,'28','2024-11-30 10:37:31.058863','2024-11-30 10:37:31.058863'),(106,'Strand','mdi-file','/add-strands',0,'28','2024-11-30 13:33:44.978682','2024-11-30 13:33:44.978682'),(107,'Program','mdi-file-arrow-up-down','/classroom-programm',0,'28','2024-12-03 08:17:03.997912','2025-10-14 12:01:27.000000'),(108,'Faculty Schedule','mdi-list-status','/faculty-schedule',0,'25','2024-12-04 10:34:16.467151','2024-12-04 10:34:16.467151'),(109,'My Schedule','mdi-microsoft-excel','/my-scheduled-program',0,'25','2024-12-04 11:03:22.365765','2024-12-04 11:03:22.365765'),(110,'Room','mdi-google-classroom','/elementary-rooms',0,'28','2024-12-06 22:25:38.889383','2025-10-14 12:02:48.000000'),(111,'Program','mdi-newspaper-variant-multiple-outline',NULL,1,NULL,'2024-12-06 22:30:48.498773','2024-12-06 22:32:43.000000'),(112,'Programs','mdi-file-arrow-up-down','/elementary-programm',0,'111','2024-12-06 22:44:34.340933','2025-10-14 12:03:29.000000'),(113,'School Year','mdi-calendar-check','/add-school-year',0,'28','2024-12-11 15:56:44.587130','2024-12-11 15:56:44.587130'),(114,'Attendance','mdi-qrcode','/my-student-record',0,'41','2025-09-18 17:36:04.280009','2025-09-18 17:36:04.280009');
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
INSERT INTO `user_detail` VALUES (3,'admin','admin','admin','',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'09070804101',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2024-11-25 20:50:36',3,'Asuncion National High Scholl1732615871725-979202079.png',NULL,'2024-11-25 20:50:36.460980','2025-09-19 14:34:00.053395',NULL,NULL,NULL,NULL,NULL,NULL),(6,'super','admin','superadmin','',NULL,NULL,'Female',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'09070804101',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2024-11-25 20:50:36',34,NULL,NULL,'2024-11-25 21:08:03.715788','2025-09-19 11:52:02.403604',NULL,NULL,NULL,NULL,NULL,NULL),(17,'teacher','','teacher','',NULL,NULL,'Female',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'09090909099',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,NULL,NULL,45,NULL,NULL,'2024-11-28 08:12:45.250612','2025-09-15 15:02:17.298322','2018-02-28',NULL,NULL,NULL,NULL,NULL),(18,'Head','','Teacher','',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,NULL,NULL,46,NULL,NULL,'2024-11-28 09:56:38.068963','2025-10-29 10:23:53.000000','2022-08-23','Masters Degree','CS PASSER','2','STEM','Techer II'),(21,'elementary','','elementary','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,NULL,NULL,49,NULL,NULL,'2025-09-15 14:47:18.404612','2025-10-18 12:29:50.000000',NULL,NULL,NULL,NULL,NULL,NULL),(23,'teacher2','','Teacher2','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,NULL,NULL,51,NULL,NULL,'2025-10-09 22:27:25.790885','2025-10-09 22:28:57.000000',NULL,NULL,NULL,NULL,NULL,NULL),(24,'Elementary','','Head','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,NULL,NULL,52,'openart-c1956871-27e0-41f2-ad06-734f7c410c21-removebg-preview1761703447619-940867541.png',NULL,'2025-10-10 08:49:39.454104','2025-10-29 10:04:07.000000',NULL,NULL,NULL,NULL,NULL,NULL),(25,'Teressa Grania ','','Jumawan','',NULL,NULL,'Female',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'09300640033',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,NULL,NULL,53,NULL,NULL,'2025-10-18 10:42:35.458185','2025-10-18 10:48:57.000000','2016-05-11','Masters ',NULL,NULL,NULL,NULL);
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
INSERT INTO `users` VALUES (3,'admin@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',1,1,1,'$2b$10$p1N5VM.MTk9svXucVFn/m.NI80Y00pyfagUDOSVUuEeuV9JOPRAwK',1,1,'2024-11-25 20:50:36.455566','2024-11-28 08:46:56.000000'),(34,'superadmin@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',1,1,4,NULL,1,1,'2024-11-25 21:08:03.709020','2025-09-11 12:43:41.142179'),(45,'teacher@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',2,2,2,'$2b$10$KEVnaBzeK177VGdiWr3PauSjXk4QFP3IJxlTjzNZDHWT1gBdaiAGq',1,1,'2024-11-28 08:12:45.244260','2025-09-11 13:01:18.267910'),(46,'headhighschool@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',1,1,3,'$2b$10$zSyrkBw5lbU8Vpnb65b8CelETm7QOPqsiMHgnvqoOYcyhB8u35buu',1,1,'2024-11-28 09:56:38.065496','2025-10-13 08:55:59.801053'),(49,'elementary@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',2,2,2,'$2b$10$YukunTWxeLl82.ANdeOhi.QVngJu8oppAAZopzLRlAGoOzyFDHe7a',1,1,'2025-09-15 14:47:18.400997','2025-10-18 12:29:50.000000'),(51,'teacher2@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',2,2,2,'$2b$10$0vwaPAACZ0ftUeHbtBpU.OERKTAdtX8VwNRC2qDySeEMJDgQCqQ1K',1,1,'2025-10-09 22:27:25.786626','2025-10-13 08:54:58.252212'),(52,'headelementary@gmail.com','$2b$10$L1Bb1hK.d7Q8RubDErmM3eNwLCq5XZrZpAHhRLqYk.00n7iZOJBNG',1,1,21,'$2b$10$uTi.V1OhSsb/eIUaY5lmJ.czqtuNuUe5FAcBAVQ5qEDjyqOdNaIqS',1,1,'2025-10-10 08:49:39.450824','2025-10-13 08:54:58.252873'),(53,'teressagrania.jumawan@yahoo.com','$2b$10$6flu.WANS1nIwG294dQzGOuMT89aprNICLDYQZgFybsT5ufAc0Ky.',2,2,2,'$2b$10$labRhHkRdqY5E7o8dUg88eZ7xpyY1SDYQxHexwt6eaaadYEciZFuS',1,1,'2025-10-18 10:42:35.443703','2025-10-18 10:46:15.000000');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'school_management'
--

--
-- Dumping routines for database 'school_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-26 16:08:37
