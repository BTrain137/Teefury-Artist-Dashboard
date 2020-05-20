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



INSERT INTO `artist_profile` (`artist_name`, `first_name`, `last_name`, `username_contact_email`, `paypal_email`, `phone`, `social_facebook`, `social_instagram`, `social_twitter`, `is_international`) 
VALUES ("locoMotive", "Tom", "Thomas", "bryan89tran@yahoo.com", "bryan89tran@yahoo.com", "", "", "", "",  true);


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username_contact_email` VARCHAR(191) UNIQUE,
  `password` BINARY(60),
  `is_admin` BOOLEAN NOT NULL DEFAULT 0,
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` BIGINT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
);


INSERT INTO `users` (`username_contact_email`)
VALUES ("bryan89tran@yahoo.com");
