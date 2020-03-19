-- mysql -u username -p < file.sql

-- Database
CREATE DATABASE IF NOT EXISTS `artist_dashboard`;
USE `artist_dashboard`;

-- Table
DROP TABLE IF EXISTS `artist_profile`;
CREATE TABLE `artist_profile` (
  `artist_name` VARCHAR(30) NOT NULL UNIQUE,
  `first_name` VARCHAR(30) NOT NULL,
  `last_name` VARCHAR(30) NOT NULL,
  `username_contact_email` VARCHAR(255) UNIQUE,
  `paypal_email` VARCHAR(255),
  `phone` VARCHAR(20),
  `social_facebook` TEXT,
  `social_instagram` TEXT,
  `social_twitter` TEXT,
  `international` BOOLEAN,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`artist_name`)
);

-- Examples

-- Insert Many 
-- INSERT INTO `artist_profile` (`artist_name`, `first_name`, `last_name`, `username_contact_email`, `paypal_email`, `phone`, `social_facebook`, `social_instagram`, `social_twitter`, `international`) 
-- VALUES ("locoMotive", "Tom", "Thomas", "tom@email.com", "tom@email.com", "", "", "", "",  true),
-- ("babyUprising", "John", "Johnson", "john@email.com", "john@email.com", "", "", "", "",  false),
-- ("jacksonFive", "Jack", "Jackson", "jack@email.com", "jack@email.com", "", "", "", "",  true);

-- Update One
-- UPDATE `artist_profile` SET `first_name`="Henry" WHERE `artist_name`="locoMotive";
