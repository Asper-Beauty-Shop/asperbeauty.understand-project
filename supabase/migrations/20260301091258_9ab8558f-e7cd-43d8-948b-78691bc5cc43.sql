
-- Fix inventory for all existing products
UPDATE products SET inventory_total = 100 WHERE inventory_total = 0;

-- Insert seed products for 5 missing concerns × 3 steps = 15 new rows
INSERT INTO products (handle, title, brand, primary_concern, regimen_step, inventory_total, is_hero, is_bestseller, bestseller_rank, price)
VALUES
-- Concern_Brightening
('vichy-ideal-white-foam', 'Vichy Ideal White Brightening Foam Cleanser', 'Vichy', 'Concern_Brightening', 'Step_1_Cleanser', 100, true, false, 999, 28.00),
('loreal-glycolic-bright-serum', 'L''Oréal Glycolic Bright Instant Glowing Serum', 'L''Oréal Paris', 'Concern_Brightening', 'Step_2_Treatment', 100, true, true, 5, 22.00),
('garnier-bright-complete-spf30', 'Garnier Bright Complete Vitamin C SPF 30', 'Garnier', 'Concern_Brightening', 'Step_3_Protection', 100, false, false, 999, 15.00),

-- Concern_SunProtection
('cerave-foaming-spf-cleanser', 'CeraVe Foaming Facial Cleanser', 'CeraVe', 'Concern_SunProtection', 'Step_1_Cleanser', 100, true, false, 999, 18.00),
('svr-sebiaclear-spf50', 'SVR Sebiaclear SPF50 Sun Cream', 'SVR', 'Concern_SunProtection', 'Step_2_Treatment', 100, false, true, 8, 32.00),
('lrp-anthelios-uvmune-spf50', 'La Roche-Posay Anthelios UVMune 400 SPF50+', 'La Roche-Posay', 'Concern_SunProtection', 'Step_3_Protection', 100, true, true, 1, 38.00),

-- Concern_DarkCircles
('cerave-hydrating-cream-to-foam', 'CeraVe Hydrating Cream-to-Foam Cleanser', 'CeraVe', 'Concern_DarkCircles', 'Step_1_Cleanser', 100, false, false, 999, 19.00),
('vichy-mineral-89-eyes', 'Vichy Minéral 89 Eyes Repairing Eye Fortifier', 'Vichy', 'Concern_DarkCircles', 'Step_2_Treatment', 100, true, true, 3, 35.00),
('avene-physiolift-eyes', 'Avène PhysioLift Eyes Wrinkles & Dark Circles', 'Avène', 'Concern_DarkCircles', 'Step_3_Protection', 100, false, false, 999, 40.00),

-- Concern_AntiAging
('lrp-toleriane-hydrating-cleanser', 'La Roche-Posay Toleriane Hydrating Gentle Cleanser', 'La Roche-Posay', 'Concern_AntiAging', 'Step_1_Cleanser', 100, true, false, 999, 22.00),
('vichy-liftactiv-retinol-ha', 'Vichy LiftActiv Retinol HA Concentrate', 'Vichy', 'Concern_AntiAging', 'Step_2_Treatment', 100, true, true, 2, 45.00),
('lrp-redermic-retinol-spf', 'La Roche-Posay Redermic R Anti-Aging SPF30', 'La Roche-Posay', 'Concern_AntiAging', 'Step_3_Protection', 100, false, true, 10, 48.00),

-- Concern_Dryness
('bioderma-atoderm-gel-moussant', 'Bioderma Atoderm Intensive Gel Moussant', 'Bioderma', 'Concern_Dryness', 'Step_1_Cleanser', 100, true, false, 999, 20.00),
('avene-hydrance-intense-serum', 'Avène Hydrance Intense Rehydrating Serum', 'Avène', 'Concern_Dryness', 'Step_2_Treatment', 100, true, true, 4, 30.00),
('lrp-cicaplast-baume-b5-spf50', 'La Roche-Posay Cicaplast Baume B5 SPF50', 'La Roche-Posay', 'Concern_Dryness', 'Step_3_Protection', 100, false, false, 999, 25.00)
ON CONFLICT (handle) DO UPDATE SET
  inventory_total = EXCLUDED.inventory_total,
  primary_concern = EXCLUDED.primary_concern,
  regimen_step = EXCLUDED.regimen_step,
  title = EXCLUDED.title;
