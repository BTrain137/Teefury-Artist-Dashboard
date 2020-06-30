
-- Get old orders with product types
SELECT `orders`.`order`, `orders`.`order_id`, `orders`.`order_created_at`, `orders`.`product_title`, 
`orders`.`vendor`, `orders`.`variant_sku`, `orders`.`quantity`, `orders`.`product_type`, 
`payouts`.`commissions_payout`, `orders`.`is_commissions_paid` 
FROM `orders` INNER JOIN  `payouts` 
ON `orders`.`product_type`=`payouts`.`product_type`
ORDER BY `order_created_at` ASC;

-- Help Joyce get commissions. 
-- Certain date range
-- Add paypal email address and international 
SELECT `orders`.`order_created_at`, `orders`.`order`, `orders`.`product_title`, 
`orders`.`vendor`, `orders`.`product_type`, `orders`.`quantity`, `orders`.`commissions_amount`, `orders`.`is_commissions_paid`, 
`artist_profile`.`paypal_email`, `artist_profile`.`is_international`
FROM `orders` INNER JOIN `artist_profile`
ON `orders`.`vendor`=`artist_profile`.`artist_name`
WHERE `order_created_at` BETWEEN 
'2020-5-01 00:00:00' AND '2020-5-31 23:59:59'
ORDER BY `order_created_at` DESC;

-- Update pending to new status in submissions
UPDATE `submissions` SET `status`="NEW" WHERE `status`="PENDING"

-- Count how many new submissions there are
SELECT count(*) as NUM FROM `submissions` WHERE `status`="NEW";

--TODO: Update the weekly-face mask's commissions_amount
UPDATE `orders` SET `commissions_amount` = 1.00 WHERE `product_type` = "Weekly-Face Mask";
