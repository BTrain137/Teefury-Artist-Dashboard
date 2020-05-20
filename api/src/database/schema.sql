-- mysql -u username -p < schema.sql 

-- Database
CREATE DATABASE IF NOT EXISTS `artist_dashboard`;
USE `artist_dashboard`;

-- Tables
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username_contact_email` VARCHAR(255) UNIQUE,
  `password` BINARY(60),
  `is_admin` BOOLEAN NOT NULL DEFAULT 0,
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` BIGINT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `artist_profile`;
CREATE TABLE `artist_profile` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `artist_name` VARCHAR(30) NOT NULL UNIQUE,
  `first_name` VARCHAR(30) NOT NULL,
  `last_name` VARCHAR(30) NOT NULL,
  `username_contact_email` VARCHAR(180) UNIQUE,
  `paypal_email` VARCHAR(255),
  `phone` VARCHAR(20),
  `social_facebook` TEXT,
  `social_instagram` TEXT,
  `social_twitter` TEXT,
  `social_tumblr` TEXT,
  `is_international` BOOLEAN,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `artist_name` VARCHAR(30) NOT NULL,
  `username_contact_email` VARCHAR(180),
  `title` VARCHAR(180),
  `description` VARCHAR(255), 
  `art_file` VARCHAR(200),
  `preview_art` VARCHAR(200),
  `status` VARCHAR(100) NOT NULL DEFAULT "Pending",
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order` VARCHAR(20),
  `order_id` BIGINT,
  `order_created_at` DATETIME,
  `product_title` TEXT,
  `variant_sku` TEXT,
  `vendor` VARCHAR(30),
  `quantity` TINYINT,
  `product_type` VARCHAR(20),
  `commissions_amount` FLOAT(4,2),
  `commissions_paid` BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `payouts`;
CREATE TABLE `payouts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_type` VARCHAR(20),
  `commissions_payout` FLOAT(4,2),
  PRIMARY KEY(`id`)
);
