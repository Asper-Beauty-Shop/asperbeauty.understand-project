
-- Patch missing product images for Digital Tray visual integrity
-- Concern: Dryness
UPDATE products SET image_url = 'https://cdn.shopify.com/s/files/1/0980/0686/0068/files/la-roche-posay-cicaplast-baume-b5-repairing-balm-spf50-40mlla-roche-posay-cicaplast-baume-b5-repairing-balm-spf50-40mlskin-careasper-beautyasper-beauty-4081307.jpg?v=1770218826', updated_at = now() WHERE handle = 'lrp-cicaplast-baume-b5-spf50' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://www.bioderma.com.au/sites/default/files/styles/product_page_mobile/public/products/bioderma-product-atoderm-intensive-gel-moussant-1l-soothing-very-dry-skin.png', updated_at = now() WHERE handle = 'bioderma-atoderm-gel-moussant' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://static.thcdn.com/images/large/webp/productimg/1600/1600/11568827-1294911609498498.jpg', updated_at = now() WHERE handle = 'avene-hydrance-intense-serum' AND (image_url IS NULL OR image_url = '');

-- Concern: Brightening
UPDATE products SET image_url = 'https://media.nahdi.sa/catalog/product/cache/19b17bb76e0ddc2cc7d08acb5ae6a09a/1/1/1190091.jpg', updated_at = now() WHERE handle = 'vichy-ideal-white-foam' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://www.watsons.com.my/medias/BP-65282-1.jpg?context=bWFzdGVyfGltYWdlc3wxNjA2NjN8aW1hZ2UvanBlZ3xhRGRqTDJoaFlTOHhORGN4TlRBME5EZ3lNVGt5TWk5Q1VGOHhOekF3T0Y4Mk5USTRNaTB4TG1wd1p3fGU0', updated_at = now() WHERE handle = 'loreal-glycolic-bright-serum' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://www.garnier.in/-/media/project/loreal/brand-sites/garnier/apac/in/products/bright-complete/bright-complete-vitamin-c-serum-cream-uv/garnier-bright-complete-vitamin-c-serum-cream-uv-front.png', updated_at = now() WHERE handle = 'garnier-bright-complete-spf30' AND (image_url IS NULL OR image_url = '');

-- Concern: Sun Protection
UPDATE products SET image_url = 'https://static.thcdn.com/images/large/webp/productimg/1600/1600/12901350-1304911609498498.jpg', updated_at = now() WHERE handle = 'cerave-foaming-spf-cleanser' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://static.beautytocare.com/media/catalog/product/s/v/svr-sebiaclear-cream-spf50-40ml.jpg', updated_at = now() WHERE handle = 'svr-sebiaclear-spf50' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://static.beautytocare.com/media/catalog/product/l/a/la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf50-50ml_1.jpg', updated_at = now() WHERE handle = 'lrp-anthelios-uvmune-spf50' AND (image_url IS NULL OR image_url = '');

-- Concern: Dark Circles
UPDATE products SET image_url = 'https://static.thcdn.com/images/large/webp/productimg/1600/1600/13906963-1294911609498498.jpg', updated_at = now() WHERE handle = 'cerave-hydrating-cream-to-foam' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://static.beautytocare.com/media/catalog/product/v/i/vichy-mineral-89-eyes-repairing-eye-fortifier-15ml.jpg', updated_at = now() WHERE handle = 'vichy-mineral-89-eyes' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://static.beautytocare.com/media/catalog/product/a/v/avene-physiolift-eyes-wrinkles-puffiness-dark-circles-15ml.jpg', updated_at = now() WHERE handle = 'avene-physiolift-eyes' AND (image_url IS NULL OR image_url = '');

-- Concern: Anti-Aging
UPDATE products SET image_url = 'https://static.beautytocare.com/media/catalog/product/l/a/la-roche-posay-toleriane-hydrating-gentle-cleanser-400ml.jpg', updated_at = now() WHERE handle = 'lrp-toleriane-hydrating-cleanser' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://static.beautytocare.com/media/catalog/product/v/i/vichy-liftactiv-retinol-specialist-deep-wrinkles-serum-30ml.jpg', updated_at = now() WHERE handle = 'vichy-liftactiv-retinol-ha' AND (image_url IS NULL OR image_url = '');

UPDATE products SET image_url = 'https://static.beautytocare.com/media/catalog/product/l/a/la-roche-posay-redermic-r-anti-aging-dermatological-treatment-30ml.jpg', updated_at = now() WHERE handle = 'lrp-redermic-retinol-spf' AND (image_url IS NULL OR image_url = '');
