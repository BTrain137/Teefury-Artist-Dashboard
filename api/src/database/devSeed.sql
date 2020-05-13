USE `artist_dashboard`;

-- Test Data

-- Insert Many 
-- INSERT INTO `artist_profile` (`artist_name`, `first_name`, `last_name`, `username_contact_email`, `paypal_email`, `phone`, `social_facebook`, `social_instagram`, `social_twitter`, `international`) 
-- VALUES ("locoMotive", "Tom", "Thomas", "tom@email.com", "tom@email.com", "", "", "", "",  true),
-- ("babyUprising", "John", "Johnson", "john@email.com", "john@email.com", "", "", "", "",  false),
-- ("jacksonFive", "Jack", "Jackson", "jack@email.com", "jack@email.com", "", "", "", "",  true),
-- ("B-train", "Bryan", "Tran", "btran@teefury.com", "btran@teefury.com", "", "", "", "",  false);

-- Comissions payout
INSERT INTO `payouts` (`product_type`, `commissions_payout`)
VALUES ("Tee", 2.00),
 ("Sweatshirt", 2.00),
 ("Tank", 2.00),
 ("Blanket", 2.00),
 ("Towel", 2.00),
 ("Leggings", 2.00),
 ("Gallery", 2.00),
 ("Pin", 0.50),
 ("ODAD-Tee", 1.00),
 ("ODAD-Sweatshirt", 1.00),
 ("ODAD-Tank", 1.00),
 ("Weekly-Tee", 1.00),
 ("Weekly-Sweatshirt", 1.00),
 ("Weekly-Tank", 1.00);
 ("Grab Bag", 0.00),
 ("none", 0.00);

 
-- 
SELECT `orders`.`order`, `orders`.`order_id`, `orders`.`order_created_at`, `orders`.`product_title`, 
`orders`.`vendor`, `orders`.`variant_sku`, `orders`.`quantity`, `orders`.`product_type`, 
`payouts`.`commissions_payout`, `orders`.`commissions_paid` 
FROM `orders` INNER JOIN  `payouts` 
ON `orders`.`product_type`=`payouts`.`product_type`
ORDER BY `order_created_at` ASC;


-- Update One
-- UPDATE `artist_profile` SET `first_name`="Henry", `last_name`="Loco" WHERE `artist_name`="locoMotive";

-- Create localhost user
-- CREATE USER 'btran'@'localhost' IDENTIFIED BY 'b^8@Hc89UgVu';
-- GRANT ALL PRIVILEGES ON artist_dashboard.* TO 'btran'@'localhost';
-- FLUSH PRIVILEGES;

-- Check User
-- SHOW GRANTS FOR 'btran'@'localhost';
-- mysql -u btran -p

-- Seed Schema
-- mysql -u btran -p < ./api/src/database/seed.sql
-- mysql -u btran -p < ./api/src/database/schema.sql
