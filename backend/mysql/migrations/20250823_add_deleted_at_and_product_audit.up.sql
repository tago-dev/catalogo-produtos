ALTER TABLE `products`
ADD COLUMN `deleted_at` TIMESTAMP NULL DEFAULT NULL AFTER `quantidade_em_stock`;

CREATE TABLE IF NOT EXISTS `product_audit` (
    `id` CHAR(36) NOT NULL PRIMARY KEY,
    `product_id` CHAR(36) NOT NULL,
    `action` VARCHAR(50) NOT NULL,
    `payload` JSON DEFAULT NULL,
    `performed_by` VARCHAR(255) DEFAULT NULL,
    `performed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;