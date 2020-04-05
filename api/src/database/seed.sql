USE `artist_dashboard`;

-- Test Data

-- Insert Many 
INSERT INTO `artist_profile` (`artist_name`, `first_name`, `last_name`, `username_contact_email`, `paypal_email`, `phone`, `social_facebook`, `social_instagram`, `social_twitter`, `international`) 
VALUES ("locoMotive", "Tom", "Thomas", "tom@email.com", "tom@email.com", "", "", "", "",  true),
("babyUprising", "John", "Johnson", "john@email.com", "john@email.com", "", "", "", "",  false),
("jacksonFive", "Jack", "Jackson", "jack@email.com", "jack@email.com", "", "", "", "",  true),
("B-train", "Bryan", "Tran", "btran@teefury.com", "btran@teefury.com", "", "", "", "",  false);

-- Update One
-- UPDATE `artist_profile` SET `first_name`="Henry", `last_name`="Loco" WHERE `artist_name`="locoMotive";