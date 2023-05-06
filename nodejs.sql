-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2023 at 06:21 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs-final`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `name` varchar(255) ,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `name`, `email`, `phone`, `password`, `created_at`) VALUES
(1, 'Huỳnh Văn Hợi', 'admin2@gmail.com', '0828983419', '$2b$10$j58EbIJFwNA1SaxrA4WQWuEyZ4cAkXmDyYvyXLNcV49a5uzFyLr8q', '2023-05-06 07:29:14'),
(2, 'David Văn Đệ', 'admin3@gmail.com', '0365821897', '$2b$10$vQDQIlMZjnKEDbasXUIdJOzYLGqiNL4gjLoHqwY4xgFacBi5Lj4Qa', '2023-05-06 11:05:56'),
(3, 'Huỳnh Văn Dẹo', 'admin@gmail.com', '0828983418', '$2b$10$rrfOZ3z4/qTzzazAaD4y6.rtetHrfIECOQjLDQUAj8MrUE8SpT0oa', '2023-05-06 14:49:12'),
(7, 'Huỳnh Văn Đệ Đệ', 'admin5@gmail.com', '1234567894', '$2b$10$LnBBUnUNl/zhReXBEa0jfez6A6gcvhmyGLJcXahYvGfhqtwI2K2i.', '2023-05-06 15:06:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
