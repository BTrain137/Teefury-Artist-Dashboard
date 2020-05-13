USE `artist_dashboard`;

-- Admin users
INSERT INTO `users` (`username_contact_email`, `password`, `is_admin`)
VALUES ("btran@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", true),
("lance@digmeepartners.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", true),
("chris@digmeepartners.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", true),
("ppatel@digmeepartners.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", true),
("marissa@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", true),
("psandoval@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", true),
("ithiessen@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", true),
("rminjares@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", true),
("joyce@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", true);

-- Artist users
INSERT INTO `users` (`username_contact_email`, `password`, `is_admin`)
VALUES ("artist-btran@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-lance@digmeepartners.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-chris@digmeepartners.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-ppatel@digmeepartners.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-marissa@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK",  false),
("artist-psandoval@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK",  false),
("artist-ithiessen@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK",  false),
("artist-rminjares@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-joyce@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false);

-- Artist accounts
INSERT INTO `artist_profile` (`artist_name`, `first_name`, `last_name`, `username_contact_email`, `paypal_email`, `phone`, `social_facebook`, `social_instagram`, `social_twitter`, `international`)
VALUES ("BryanTran", "Bryan", "Tran", "artist-btran@teefury.com", "artist-btran@teefury.com", "", "", "", "", false),
("LanceStern", "Lance", "Stern", "artist-lance@digmeepartners.com", "artist-lance@digmeepartners.com", "", "", "", "", false),
("ChrisBeason", "Chris", "Beason", "artist-chris@digmeepartners.com", "chris@digmeepartners.com", "", "", "", "", false),
("ParulPatel", "Parul", "Patel", "artist-ppatel@digmeepartners.com", "ppatel@digmeepartners.com", "", "", "", "", false),
("MarissaTucker", "Marissa", "Tucker", "artist-marissa@teefury.com", "marissa@teefury.com",  "", "", "", "", false),
("PedroSandoval", "Pedro", "Sandoval", "artist-psandoval@teefury.com", "psandoval@teefury.com",  "", "", "", "", false),
("IsabelThiessen", "Isabel", "Thiessen", "artist-ithiessen@teefury.com", "ithiessen@teefury.com",  "", "", "", "", false),
("RebeccaMinjares", "Rebecca", "Minajares", "artist-rminjares@teefury.com", "rminjares@teefury.com", "", "", "", "", false),
("JoyceArmstrong", "Joyce", "Armstrong", "artist-joyce@teefury.com", "joyce@teefury.com", "", "", "", "", false);


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
 ("none", 0.00);
