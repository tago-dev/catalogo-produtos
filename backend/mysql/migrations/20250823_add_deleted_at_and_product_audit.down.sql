DROP TABLE IF EXISTS `product_audit`;

ALTER TABLE `products` DROP COLUMN IF EXISTS `deleted_at`;