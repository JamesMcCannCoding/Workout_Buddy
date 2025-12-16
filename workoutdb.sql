-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2025 at 06:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `workoutdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

CREATE TABLE `exercises` (
  `exercise_id` int(11) NOT NULL,
  `exercise_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_custom` tinyint(1) DEFAULT 0,
  `created_by_user_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exercises`
--

INSERT INTO `exercises` (`exercise_id`, `exercise_name`, `description`, `is_custom`, `created_by_user_id`, `image_url`) VALUES
(1, 'Barbell Bench Press', NULL, 0, NULL, 'bench_press.png'),
(2, 'Barbell Squats', NULL, 0, NULL, 'barbell_squats.png'),
(3, 'Deadlifts', NULL, 0, NULL, 'deadlift.png'),
(4, 'Overhead Press', NULL, 0, NULL, 'overhead_press.png'),
(5, 'Dumbbell Rows', NULL, 0, NULL, 'dumbbell_row.png'),
(6, 'Run', NULL, 0, NULL, NULL),
(8, 'Incline Dumbbell Bench Press', NULL, 0, NULL, 'incline_dumbbell_bench_press.png'),
(9, 'Chest Dips', NULL, 0, NULL, 'chest_dips.png'),
(10, 'Cable Chest Flys', NULL, 0, NULL, 'cable_chest_fly.png'),
(12, 'Machine Chest Flys', NULL, 0, NULL, 'machine_chest_fly.png'),
(13, 'Pull-ups', NULL, 0, NULL, 'pullup.png'),
(14, 'Bent Over Row', NULL, 0, NULL, 'bentover_row.png'),
(15, 'Dumbbell Bench Press', NULL, 0, NULL, 'dumbbell_bench_press.png'),
(16, 'Dumbbell Shoulder Press', NULL, 0, NULL, 'dumbbell_shoulder_press.png'),
(17, 'Preacher Curls', NULL, 0, NULL, 'preacher_curls.png'),
(18, 'Barbell Shrugs', NULL, 0, NULL, 'barbell_shrugs.png'),
(19, 'Lat Pulldown', NULL, 0, NULL, 'lat_pulldown.png'),
(20, 'Cable Lateral Raise', NULL, 0, NULL, 'cable_lateral_raise.png'),
(21, 'Leg Press', NULL, 0, NULL, 'leg_press.png'),
(22, 'Leg Extension', NULL, 0, NULL, 'leg_extension.png'),
(23, 'Hamstring Curl', NULL, 0, NULL, 'hamstring_curl.png'),
(24, 'Seated Calf Raise', NULL, 0, NULL, 'seated_calf_raise.png'),
(25, 'Close Grip Chin-up', NULL, 0, NULL, 'close_grip_chinup.png'),
(26, 'Cable Row', NULL, 0, NULL, 'cable_row.png'),
(27, 'Lat Pushdown', NULL, 0, NULL, 'lat_pushdown.png'),
(28, 'Walking Lunges', NULL, 0, NULL, 'walking_lunges.png'),
(29, 'Ab Curl Machine', NULL, 0, NULL, 'ab_curl_machine.png'),
(30, 'Barbell Wrist Curl', NULL, 0, NULL, 'barbell_wrist_curl.png'),
(31, 'Incline Bench Press', NULL, 0, NULL, 'incline_bench_press.png'),
(32, 'Seated One Arm Row', NULL, 0, NULL, 'seated_one_arm_row.png'),
(33, 'Standing Calf Raise', NULL, 0, NULL, 'standing_calf_raise.png');

-- --------------------------------------------------------

--
-- Table structure for table `performancedata`
--

CREATE TABLE `performancedata` (
  `performance_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `workout_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `date_performed` date NOT NULL,
  `set_number` int(11) NOT NULL,
  `weight_kg` decimal(7,2) NOT NULL,
  `reps_completed` int(11) NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `performancedata`
--

INSERT INTO `performancedata` (`performance_id`, `user_id`, `workout_id`, `exercise_id`, `date_performed`, `set_number`, `weight_kg`, `reps_completed`, `is_completed`) VALUES
(5, 1, 1, 1, '2025-12-10', 1, 60.00, 12, 1),
(6, 1, 1, 1, '2025-12-10', 2, 65.00, 10, 1),
(7, 1, 1, 1, '2025-12-10', 3, 70.00, 10, 1),
(8, 1, 1, 1, '2025-12-10', 4, 75.00, 8, 1),
(9, 1, 1, 9, '2025-12-11', 1, 0.00, 10, 1),
(10, 1, 1, 9, '2025-12-11', 2, 0.00, 10, 1),
(11, 1, 1, 9, '2025-12-11', 3, 0.00, 10, 1),
(12, 1, 1, 9, '2025-12-11', 4, 0.00, 10, 1),
(13, 1, 1, 10, '2025-12-11', 1, 30.00, 12, 1),
(14, 1, 1, 10, '2025-12-11', 2, 30.00, 12, 1),
(15, 1, 1, 10, '2025-12-11', 3, 30.00, 12, 1),
(16, 1, 1, 10, '2025-12-11', 4, 30.00, 12, 1),
(19, 1, 3, 3, '2025-12-15', 1, 120.00, 10, 0),
(20, 1, 3, 3, '2025-12-15', 2, 120.00, 10, 0),
(21, 1, 3, 3, '2025-12-15', 3, 120.00, 10, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `created_at`, `password_hash`) VALUES
(1, 'testuser', 'test@example.com', '2025-12-05 05:31:52', ''),
(3, 'jmccann', 'mccjam16@gmail.com', '2025-12-12 02:47:43', '$2b$10$rGozLHePfmmNOLA3gqHLnePTqkWWI.o4utfKS948NknrEpOK347K.'),
(4, 'test', 'test@gmail.com', '2025-12-15 04:14:16', '$2b$10$5KEPfSqxrg6mNs1W9frGwuu4XbDHDs/0Cd1jWHvmw3kaAy6yub0A.');

-- --------------------------------------------------------

--
-- Table structure for table `workoutexercises`
--

CREATE TABLE `workoutexercises` (
  `workout_exercise_id` int(11) NOT NULL,
  `workout_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `exercise_order` int(11) NOT NULL,
  `default_sets` int(11) DEFAULT NULL,
  `default_reps` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workoutexercises`
--

INSERT INTO `workoutexercises` (`workout_exercise_id`, `workout_id`, `exercise_id`, `exercise_order`, `default_sets`, `default_reps`) VALUES
(19, 1, 1, 1, 4, 12),
(20, 1, 10, 2, 4, 12),
(21, 1, 9, 3, 4, 10),
(22, 3, 3, 2, 4, 10),
(23, 3, 13, 3, 4, 12),
(24, 1, 12, 4, 4, 12),
(25, 1, 30, 5, 4, 12),
(26, 1, 8, 6, 4, 12),
(27, 4, 23, 1, 4, 12),
(28, 3, 18, 4, 4, 12),
(29, 3, 14, 5, 4, 12),
(30, 3, 19, 6, 4, 12),
(31, 3, 27, 7, 4, 12),
(32, 4, 2, 2, 4, 12),
(33, 4, 24, 3, 4, 12),
(34, 3, 32, 8, 4, 12),
(35, 3, 26, 9, 4, 12),
(36, 4, 28, 4, 4, 24),
(37, 4, 22, 5, 4, 12),
(38, 4, 33, 6, 4, 12),
(39, 7, 29, 1, 4, 10),
(40, 10, 29, 1, 4, 10),
(41, 11, 1, 1, 3, 10),
(42, 12, 29, 1, 3, 10);

-- --------------------------------------------------------

--
-- Table structure for table `workoutexercisesets`
--

CREATE TABLE `workoutexercisesets` (
  `set_id` int(11) NOT NULL,
  `workout_exercise_id` int(11) NOT NULL,
  `set_number` int(11) NOT NULL,
  `target_reps` int(11) DEFAULT NULL,
  `target_weight` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workoutexercisesets`
--

INSERT INTO `workoutexercisesets` (`set_id`, `workout_exercise_id`, `set_number`, `target_reps`, `target_weight`) VALUES
(8, 19, 1, 12, 60.00),
(9, 19, 2, 10, 65.00),
(10, 19, 3, 10, 70.00),
(11, 19, 4, 8, 75.00),
(12, 20, 1, 12, 30.00),
(13, 20, 2, 12, 30.00),
(14, 20, 3, 12, 30.00),
(15, 20, 4, 12, 30.00),
(16, 21, 1, 10, 0.00),
(17, 21, 2, 10, 0.00),
(18, 21, 3, 10, 0.00),
(19, 21, 4, 10, 0.00),
(20, 22, 1, 10, 120.00),
(21, 22, 2, 10, 120.00),
(22, 22, 3, 10, 120.00),
(23, 22, 4, 10, 120.00),
(24, 23, 1, 12, 0.00),
(25, 23, 2, 10, 0.00),
(26, 23, 3, 8, 0.00),
(27, 23, 4, 6, 0.00),
(28, 24, 1, 12, 30.00),
(29, 24, 2, 10, 35.00),
(30, 24, 3, 8, 40.00),
(31, 24, 4, 10, 35.00),
(32, 25, 1, 12, 25.00),
(33, 25, 2, 12, 25.00),
(34, 25, 3, 12, 25.00),
(35, 25, 4, 12, 25.00),
(36, 26, 1, 12, 25.00),
(37, 26, 2, 12, 25.00),
(38, 26, 3, 12, 25.00),
(39, 26, 4, 12, 25.00),
(40, 27, 1, 12, 20.00),
(41, 27, 2, 12, 25.00),
(42, 27, 3, 12, 25.00),
(43, 27, 4, 12, 20.00),
(44, 28, 1, 12, 50.00),
(45, 28, 2, 12, 50.00),
(46, 28, 3, 12, 50.00),
(47, 28, 4, 12, 50.00),
(48, 29, 1, 12, 50.00),
(49, 29, 2, 12, 50.00),
(50, 29, 3, 10, 50.00),
(51, 29, 4, 10, 50.00),
(52, 30, 1, 12, 35.00),
(53, 30, 2, 12, 35.00),
(54, 30, 3, 12, 35.00),
(55, 30, 4, 12, 35.00),
(56, 31, 1, 12, 30.00),
(57, 31, 2, 12, 30.00),
(58, 31, 3, 12, 30.00),
(59, 31, 4, 12, 30.00),
(60, 32, 1, 12, 60.00),
(61, 32, 2, 10, 80.00),
(62, 32, 3, 10, 80.00),
(63, 32, 4, 8, 70.00),
(64, 33, 1, 12, 10.00),
(65, 33, 2, 12, 10.00),
(66, 33, 3, 12, 10.00),
(67, 33, 4, 12, 10.00),
(68, 34, 1, 12, 50.00),
(69, 34, 2, 12, 50.00),
(70, 34, 3, 12, 50.00),
(71, 34, 4, 12, 50.00),
(72, 35, 1, 12, 60.00),
(73, 35, 2, 12, 60.00),
(74, 35, 3, 12, 60.00),
(75, 35, 4, 12, 60.00),
(76, 36, 1, 24, 15.00),
(77, 36, 2, 24, 15.00),
(78, 36, 3, 24, 15.00),
(79, 36, 4, 24, 15.00),
(80, 37, 1, 12, 15.00),
(81, 37, 2, 12, 15.00),
(82, 37, 3, 12, 15.00),
(83, 37, 4, 12, 15.00),
(84, 38, 1, 12, 45.00),
(85, 38, 2, 12, 50.00),
(86, 38, 3, 12, 50.00),
(87, 38, 4, 12, 45.00),
(88, 39, 1, 10, 0.00),
(89, 39, 2, 10, 0.00),
(90, 39, 3, 10, 0.00),
(91, 39, 4, 10, 0.00),
(92, 40, 1, 10, 0.00),
(93, 40, 2, 10, 0.00),
(94, 40, 3, 10, 0.00),
(95, 40, 4, 10, 0.00),
(96, 41, 1, 10, 0.00),
(97, 41, 2, 10, 0.00),
(98, 41, 3, 10, 0.00),
(99, 42, 1, 10, 0.00),
(100, 42, 2, 10, 0.00),
(101, 42, 3, 10, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `workouts`
--

CREATE TABLE `workouts` (
  `workout_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `workout_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workouts`
--

INSERT INTO `workouts` (`workout_id`, `user_id`, `workout_name`, `created_at`) VALUES
(1, 1, 'Chest Day', '2025-12-05 05:36:38'),
(3, 1, 'Back Day', '2025-12-10 04:00:40'),
(4, 1, 'Leg Day', '2025-12-11 05:01:30'),
(5, 1, 'Shoulders & Abs', '2025-12-11 05:02:56'),
(6, 1, 'Tricep & Bicep Day', '2025-12-11 05:09:09'),
(7, 1, 'TEST', '2025-12-15 04:14:41'),
(10, 3, 'Test', '2025-12-16 01:59:58'),
(11, 3, 'Chest Day', '2025-12-16 02:00:56'),
(12, 4, 'Test1', '2025-12-16 02:01:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`exercise_id`),
  ADD UNIQUE KEY `exercise_name` (`exercise_name`),
  ADD KEY `created_by_user_id` (`created_by_user_id`);

--
-- Indexes for table `performancedata`
--
ALTER TABLE `performancedata`
  ADD PRIMARY KEY (`performance_id`),
  ADD UNIQUE KEY `unique_set` (`user_id`,`exercise_id`,`date_performed`,`set_number`),
  ADD KEY `workout_id` (`workout_id`),
  ADD KEY `exercise_id` (`exercise_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `workoutexercises`
--
ALTER TABLE `workoutexercises`
  ADD PRIMARY KEY (`workout_exercise_id`),
  ADD UNIQUE KEY `workout_exercise_unique` (`workout_id`,`exercise_id`),
  ADD KEY `exercise_id` (`exercise_id`);

--
-- Indexes for table `workoutexercisesets`
--
ALTER TABLE `workoutexercisesets`
  ADD PRIMARY KEY (`set_id`),
  ADD KEY `workout_exercise_id` (`workout_exercise_id`);

--
-- Indexes for table `workouts`
--
ALTER TABLE `workouts`
  ADD PRIMARY KEY (`workout_id`),
  ADD UNIQUE KEY `user_workout_name` (`user_id`,`workout_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `exercise_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `performancedata`
--
ALTER TABLE `performancedata`
  MODIFY `performance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `workoutexercises`
--
ALTER TABLE `workoutexercises`
  MODIFY `workout_exercise_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `workoutexercisesets`
--
ALTER TABLE `workoutexercisesets`
  MODIFY `set_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `workouts`
--
ALTER TABLE `workouts`
  MODIFY `workout_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exercises`
--
ALTER TABLE `exercises`
  ADD CONSTRAINT `exercises_ibfk_1` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `performancedata`
--
ALTER TABLE `performancedata`
  ADD CONSTRAINT `performancedata_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `performancedata_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`workout_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `performancedata_ibfk_3` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`exercise_id`) ON DELETE CASCADE;

--
-- Constraints for table `workoutexercises`
--
ALTER TABLE `workoutexercises`
  ADD CONSTRAINT `workoutexercises_ibfk_1` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`workout_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `workoutexercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`exercise_id`) ON DELETE CASCADE;

--
-- Constraints for table `workoutexercisesets`
--
ALTER TABLE `workoutexercisesets`
  ADD CONSTRAINT `workoutexercisesets_ibfk_1` FOREIGN KEY (`workout_exercise_id`) REFERENCES `workoutexercises` (`workout_exercise_id`);

--
-- Constraints for table `workouts`
--
ALTER TABLE `workouts`
  ADD CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
