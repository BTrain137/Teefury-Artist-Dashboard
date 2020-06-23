-- Insert Test Artist Account
INSERT INTO `artist_profile` (`artist_name`, `first_name`, `last_name`, `username_contact_email`, `paypal_email`, `phone`, `social_facebook`, `social_instagram`, `social_twitter`, `is_international`) 
VALUES ("locoMotive", "Tom", "Thomas", "bryan89tran@yahoo.com", "bryan89tran@yahoo.com", "", "", "", "",  true);

INSERT INTO `users` (`username_contact_email`)
VALUES ("bryan89tran@yahoo.com");

-- Insert Admin accounts
INSERT INTO `users` (`username_contact_email`, `is_admin`)
VALUES ("btran@teefury.com", true),
("lance@digmeepartners.com", true),
("chris@digmeepartners.com", true),
("ppatel@digmeepartners.com", true),
("marissa@teefury.com", true),
("psandoval@teefury.com", true),
("ithiessen@teefury.com", true),
("rminjares@teefury.com", true),
("joyce@teefury.com", true);

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
 ("Weekly-Tank", 1.00),
 ("Grab Bag", 0.00),
 ("Face Mask", 1.00),
 ("none", 0.00);
