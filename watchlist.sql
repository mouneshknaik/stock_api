-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 23, 2022 at 04:14 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stock`
--

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

CREATE TABLE `watchlist` (
  `SYMBOL` varchar(100) DEFAULT NULL,
  `TITLE` varchar(100) DEFAULT NULL,
  `CODE` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`SYMBOL`, `TITLE`, `CODE`) VALUES
('RAJRATAN', 'Rajratan Global Wire Ltd.', '517522'),
('ALKALI', 'Alkali Metals Ltd.', '533029'),
('', 'Golkunda Diamonds & Jewellery Ltd.', '523676'),
('ATLANTA', 'Atlanta Ltd.', '532759'),
('SHEMAROO', 'Shemaroo Entertainment Ltd.', '538685'),
('HINDCON', 'Hindcon Chemicals Ltd.', '201875'),
('VINYLINDIA', 'Vinyl Chemicals (India) Ltd.', '524129'),
('KUANTUM', 'Kuantum Papers Ltd.', '532937'),
('3PLAND', '3P Land Holdings Ltd.', '516092'),
('MHLXMIRU', 'Mahalaxmi Rubtech Ltd.', '514450'),
('SUZLON', 'Suzlon Energy Ltd.', '532667'),
('VIVIMEDLAB', 'Vivimed Labs Ltd.', '532660'),
('ADANIPORTS', 'Adani Ports and Special Economic Zone Ltd.', '532921'),
('HCC', 'Hindustan Construction Company Ltd.', '500185'),
('DATAPATTNS', 'Data Patterns (India) Ltd.', '543428'),
('ADANIPOWER', 'Adani Power Ltd.', '533096'),
('KARURVYSYA', 'Karur Vysya Bank Ltd.', '590003'),
('RAMRAT', 'Ram Ratna Wires Ltd.', '522281'),
('ADANIENT', 'Adani Enterprises Ltd.', '512599'),
('AWL', 'Adani Wilmar Ltd.', '543458'),
('TOTAL', 'Total Transport Systems Ltd.', '203634'),
('ATGL', 'Adani Total Gas Ltd.', '542066'),
('JUBLFOOD', 'Jubilant FoodWorks Ltd.', '533155'),
('NIPPOBATRY', 'Indo-National Ltd.', '504058'),
('ADANITRANS', 'Adani Transmission Ltd.', '539254'),
('WIPRO', 'Wipro Ltd.', '507685'),
('YESBANK', 'Yes Bank Ltd.', '532648'),
('FEDERALBNK', 'The Federal Bank Ltd.', '500469'),
('APOLLO', 'Apollo Micro Systems Ltd.', '540879'),
('INDIANB', 'Indian Bank', '532814'),
('CANBK', 'Canara Bank', '532483'),
('GOKULAGRO', 'Gokul Agro Resources Ltd.', '539725'),
('AXISBANK', 'Axis Bank Ltd.', '532215'),
('CIPLA', 'Cipla Ltd.', '500087');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
