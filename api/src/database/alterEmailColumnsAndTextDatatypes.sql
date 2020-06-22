USE artist_dashboard;

ALTER TABLE users
MODIFY COLUMN username_contact_email VARCHAR(255) UNIQUE;

ALTER TABLE artist_profile
MODIFY COLUMN social_facebook VARCHAR(100),
MODIFY COLUMN social_instagram VARCHAR(100),
MODIFY COLUMN social_twitter VARCHAR(100),
MODIFY COLUMN social_tumblr VARCHAR(100);

ALTER TABLE submissions
ADD COLUMN email_status VARCHAR(50) NOT NULL DEFAULT "Not emailed",
ADD COLUMN email_content VARCHAR(3000);

ALTER TABLE orders
MODIFY COLUMN product_title VARCHAR(255),
MODIFY COLUMN variant_sku VARCHAR(255);
