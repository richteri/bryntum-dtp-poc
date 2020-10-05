SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `calendar_intervals`;
DROP TABLE IF EXISTS `assignments`;
DROP TABLE IF EXISTS `resources`;
DROP TABLE IF EXISTS `dependencies`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `calendars`;
DROP TABLE IF EXISTS `time_ranges`;
DROP TABLE IF EXISTS `options`;

CREATE TABLE `calendars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentId` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `daysPerMonth` int(11) DEFAULT NULL,
  `daysPerWeek` int(11) DEFAULT NULL,
  `hoursPerDay` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX (`parentId`),
  CONSTRAINT `fk_calendars_calendars` FOREIGN KEY (`parentId`) REFERENCES `calendars`(`id`)
) ENGINE=INNODB AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `calendar_intervals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `calendar` int(11) NOT NULL,
  `recurrentStartDate` varchar(255) DEFAULT NULL,
  `recurrentEndDate` varchar(255) DEFAULT NULL,
  `isWorking` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX (`calendar`),
  CONSTRAINT `fk_calendar_intervals_calendars` FOREIGN KEY (`calendar`) REFERENCES `calendars`(`id`)
) ENGINE=INNODB AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentId` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `effort` float(11, 2) DEFAULT NULL,
  `effortUnit` varchar(255) DEFAULT 'hour',
  `duration` float(11, 2) unsigned DEFAULT NULL,
  `durationUnit` varchar(255) DEFAULT 'day',
  `percentDone` float(11, 2) unsigned DEFAULT 0,
  `schedulingMode` varchar(255) DEFAULT NULL,
  `note` text,
  `constraintType` varchar(255) DEFAULT NULL,
  `constraintDate` datetime DEFAULT NULL,
  `manuallyScheduled` tinyint DEFAULT 0,
  `effortDriven` tinyint DEFAULT 0,
  `cls` varchar(255) DEFAULT NULL,
  `iconCls` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `parentIndex` INT(11) DEFAULT 0,
  `expanded` tinyint DEFAULT 0,
  `calendar` int(11) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX (`parentId`),
  CONSTRAINT `fk_tasks_tasks` FOREIGN KEY (`parentId`) REFERENCES `tasks`(`id`),
  INDEX (`calendar`),
  CONSTRAINT `fk_tasks_calendars` FOREIGN KEY (`calendar`) REFERENCES `calendars`(`id`)
) ENGINE=INNODB AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `dependencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromEvent` int(11) DEFAULT NULL,
  `toEvent` int(11) DEFAULT NULL,
  `typ` int(11) DEFAULT 2,
  `cls` varchar(255) DEFAULT NULL,
  `lag` float(11, 2) DEFAULT 0,
  `lagUnit` varchar(255) DEFAULT 'day',
  PRIMARY KEY (`id`),
  INDEX (`fromEvent`),
  CONSTRAINT `fk_dependencies_tasks` FOREIGN KEY (`fromEvent`) REFERENCES `tasks`(`id`),
  INDEX (`toEvent`),
  CONSTRAINT `fk_dependencies_tasks1` FOREIGN KEY (`toEvent`) REFERENCES `tasks`(`id`)
) ENGINE=INNODB AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `calendar` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX (`calendar`),
  CONSTRAINT `fk_resources_calendars` FOREIGN KEY (`calendar`) REFERENCES `calendars`(`id`)
) ENGINE=INNODB AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event` int(11) NOT NULL,
  `resource` int(11) NOT NULL,
  `units` int(11) DEFAULT 100,
  PRIMARY KEY (`id`),
  INDEX (`event`),
  CONSTRAINT `fk_assignments_tasks` FOREIGN KEY (`event`) REFERENCES `tasks`(`id`),
  INDEX (`resource`),
  CONSTRAINT `fk_assignments_resources` FOREIGN KEY (`resource`) REFERENCES `resources`(`id`)
) ENGINE=INNODB AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `time_ranges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `cls` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `options` (
  `name` varchar(45) NOT NULL,
  `value` varchar(45) DEFAULT NULL,
  `dt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


-- region=data

SET FOREIGN_KEY_CHECKS=0;

TRUNCATE TABLE `dependencies`;
TRUNCATE TABLE `calendar_intervals`;
TRUNCATE TABLE `assignments`;
TRUNCATE TABLE `resources`;
TRUNCATE TABLE `calendars`;
TRUNCATE TABLE `tasks`;
TRUNCATE TABLE `options`;
TRUNCATE TABLE `time_ranges`;

-- region=insertions

INSERT INTO `dependencies` (`id`, `fromEvent`, `toEvent`, `lag`) VALUES
(1,11,15,2),
(2,12,15,0),
(3,13,15,0),
(4,14,15,0),
(5,15,21,0),
(7,21,22,0),
(8,22,23,0),
(9,23,24,0),
(10,24,25,0),
(11,31,33,0),
(12,400,401,0),
(13,401,402,0),
(15,3,4,0),
(16,41,45,0),
(17,42,45,0),
(18,43,45,0),
(19,44,45,0),
(20,4034,4035,0);

INSERT INTO `calendar_intervals` (`calendar`,`recurrentStartDate`,`recurrentEndDate`,`isWorking`) VALUES
(1, 'on Sat at 0:00', 'on Mon at 0:00', 0),
(2, 'every weekday at 12:00', 'every weekday at 13:00', 0),
(2, 'every weekday at 17:00', 'every weekday at 08:00', 0),
(3, 'every weekday at 6:00', 'every weekday at 22:00', 0);

INSERT INTO `assignments` (`event`, `resource`) VALUES
(11, 1),
(12, 1),
(12, 9),
(13, 2),
(13, 3),
(13, 6),
(13, 7),
(13, 8),
(21, 5),
(21, 9),
(22, 8),
(25, 3);

INSERT INTO `resources` (`id`, `name`, `city`, `calendar`) VALUES
(1, 'Celia', 'Barcelona', null),
(2, 'Lee', 'London', null),
(3, 'Macy', 'New York', null),
(4, 'Madison', 'Barcelona', null),
(5, 'Rob', 'Rome', null),
(6, 'Dave', 'Barcelona', null),
(7, 'Dan', 'London', null),
(8, 'George', 'New York', null),
(9, 'Gloria', 'Rome', null),
(10, 'Henrik', 'London', 2);

INSERT INTO `calendars` (`id`, `parentId`,`name`,`daysPerMonth`,`daysPerWeek`,`hoursPerDay`) VALUES
(1, null, 'General', 20, 5, 24),
(2, null, 'Business', 20, 5, 8),
(3, null, 'Night shift', 20, 5, 8);

INSERT INTO `tasks` (`id`, `name`, `expanded`, `iconCls`, `percentDone`, `startDate`, `endDate`, `parentId`, `effort`, `duration`, `parentIndex`) VALUES
(1000, 'Launch SaaS Product', 1, '', 34.248366013071895, '2019-01-14 00:00:00', '2019-03-16 00:00:00', NULL, 153.00, 45.00, 0),
(1, 'Setup web server', 1, '', 42.30769230769231, '2019-01-14 00:00:00', '2019-01-19 00:00:00', 1000, 13.00, 5.00, 0),
(11, 'Install Apache', 0, '', 50.00, '2019-01-14 00:00:00', '2019-01-17 00:00:00', 1, 3.00, 3.00, 0),
(12, 'Configure firewall', 0, '', 50.00, '2019-01-14 00:00:00', '2019-01-17 00:00:00', 1, 3.00, 3.00, 1),
(13, 'Setup load balancer', 0, '', 50.00, '2019-01-14 00:00:00', '2019-01-17 00:00:00', 1, 3.00, 3.00, 2),
(14, 'Configure ports', 0, '', 50.00, '2019-01-14 00:00:00', '2019-01-16 00:00:00', 1, 2.00, 2.00, 3),
(15, 'Run tests', 0, '', 0.00, '2019-01-21 00:00:00', '2019-01-23 00:00:00', 1, 2.00, 2.00, 4),
(2, 'Website Design', 1, '', 34.00, '2019-01-21 00:00:00', '2019-02-09 00:00:00', 1000, 15.00, 15.00, 1),
(21, 'Contact designers', 0, '', 70.00, '2019-01-21 00:00:00', '2019-01-26 00:00:00', 2, 5.00, 5.00, 0),
(22, 'Create shortlist of three designers', 0, '', 60.00, '2019-01-28 00:00:00', '2019-01-29 00:00:00', 2, 1.00, 1.00, 1),
(23, 'Select & review final design', 0, '', 50.00, '2019-01-29 00:00:00', '2019-01-31 00:00:00', 2, 2.00, 2.00, 2),
(24, 'Inform management about decision', 0, '', 100.00, '2019-01-31 00:00:00', '2019-01-31 00:00:00', 2, 0.00, 0.00, 3),
(25, 'Apply design to web site', 0, '', 0.00, '2019-01-31 00:00:00', '2019-02-09 00:00:00', 2, 7.00, 7.00, 4),
(3, 'Setup Test Strategy', 1, '', 14.516129032258064, '2019-01-14 00:00:00', '2019-02-02 00:00:00', 1000, 31.00, 15.00, 2),
(31, 'Hire QA staff', 0, '', 40.00, '2019-01-14 00:00:00', '2019-01-19 00:00:00', 3, 5.00, 5.00, 0),
(33, 'Write test specs', 1, '', 9.615384615384615, '2019-01-21 00:00:00', '2019-02-02 00:00:00', 3, 26.00, 10.00, 1),
(331, 'Unit tests', 0, '', 20.00, '2019-01-21 00:00:00', '2019-02-02 00:00:00', 33, 10.00, 10.00, 0),
(332, 'UI unit tests / individual screens', 0, '', 10.00, '2019-01-21 00:00:00', '2019-01-26 00:00:00', 33, 5.00, 5.00, 1),
(333, 'Application tests', 0, '', 0.00, '2019-01-21 00:00:00', '2019-02-02 00:00:00', 33, 10.00, 10.00, 2),
(334, 'Monkey tests', 0, '', 0.00, '2019-01-21 00:00:00', '2019-01-22 00:00:00', 33, 1.00, 1.00, 3),
(4, 'Application Implementation', 1, '', 39.680851063829785, '2019-02-04 00:00:00', '2019-03-16 00:00:00', 1000, 94.00, 30.00, 3),
(400, 'Phase #1', 1, '', 53.333333333333336, '2019-02-04 00:00:00', '2019-02-09 00:00:00', 4, 15.00, 5.00, 0),
(41, 'Authentication module', 0, '', 100.00, '2019-02-04 00:00:00', '2019-02-09 00:00:00', 400, 5.00, 5.00, 0),
(42, 'Single sign on', 0, '', 100.00, '2019-02-04 00:00:00', '2019-02-07 00:00:00', 400, 3.00, 3.00, 1),
(43, 'Implement role based access', 0, '', 0.00, '2019-02-04 00:00:00', '2019-02-08 00:00:00', 400, 4.00, 4.00, 2),
(44, 'Basic test coverage', 0, '', 0.00, '2019-02-04 00:00:00', '2019-02-07 00:00:00', 400, 3.00, 3.00, 3),
(45, 'Verify high test coverage', 0, '', 0.00, '2019-02-09 00:00:00', '2019-02-09 00:00:00', 400, 0.00, 0.00, 4),
(401, 'Phase #2', 1, '', 36.92307692307692, '2019-02-11 00:00:00', '2019-03-12 00:00:00', 4, 65.00, 21.00, 1),
(4011, 'Authentication module', 0, '', 70.00, '2019-02-11 00:00:00', '2019-03-02 00:00:00', 401, 15.00, 15.00, 0),
(4012, 'Single sign on', 0, '', 60.00, '2019-02-11 00:00:00', '2019-02-16 00:00:00', 401, 5.00, 5.00, 1),
(4013, 'Implement role based access', 0, '', 50.00, '2019-02-11 00:00:00', '2019-03-12 00:00:00', 401, 21.00, 21.00, 2),
(4014, 'Basic test coverage', 0, '', 0.00, '2019-02-11 00:00:00', '2019-03-09 00:00:00', 401, 20.00, 20.00, 3),
(4015, 'Verify high test coverage', 0, '', 0.00, '2019-02-11 00:00:00', '2019-02-15 00:00:00', 401, 4.00, 4.00, 4),
(402, 'Acceptance phase', 1, '', 37.857142857142854, '2019-03-12 00:00:00', '2019-03-16 00:00:00', 4, 14.00, 4.00, 2),
(4031, 'Company bug bash', 0, '', 70.00, '2019-03-12 00:00:00', '2019-03-15 00:00:00', 402, 3.00, 3.00, 0),
(4032, 'Test all web pages', 0, '', 60.00, '2019-03-12 00:00:00', '2019-03-14 00:00:00', 402, 2.00, 2.00, 1),
(4033, 'Verify no broken links', 0, '', 50.00, '2019-03-12 00:00:00', '2019-03-16 00:00:00', 402, 4.00, 4.00, 2),
(4034, 'Make test release', 0, '', 0.00, '2019-03-12 00:00:00', '2019-03-15 00:00:00', 402, 3.00, 3.00, 3),
(4035, 'Send invitation email', 0, '', 0.00, '2019-03-15 00:00:00', '2019-03-16 00:00:00', 402, 1.00, 1.00, 4),
(4036, 'Celebrate launch', 0, 'b-fa b-fa-glass-cheers', 0.00, '2019-03-12 00:00:00', '2019-03-13 00:00:00', 402, 1.00, 1.00, 5);

-- region=options
INSERT INTO `options` (`name`, `value`) VALUES
('revision', '1'),
('projectCalendar', '1'),
('projectStartDate', '2019-01-14');
-- endregion=options

INSERT INTO `time_ranges` (`id`, `name`, `startDate`, `endDate`, `cls`) VALUES
(1, 'Important date', '2019-01-30 00:00:00', null, 'b-fa b-fa-diamond');

-- endregion=insertions

SET FOREIGN_KEY_CHECKS=1;

-- endregion=data

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

SET FOREIGN_KEY_CHECKS=1;
