-- Fix inflated prices for budget/mass-market/drugstore brands (fils→JOD correction: ÷100)
UPDATE products SET price = ROUND((price / 100.0)::numeric, 2)
WHERE price > 100
AND (
  brand ILIKE ANY(ARRAY[
    'Junior','Sebamed','Topface','Topface Fix','Petal','Neverti','AMK','AMK Lady',
    'Flormar','Loreal','Loreal Paris','Bod Man','Hask','Cantu','Cantu Care','Cantu Shea',
    'Pierrot','Pierrot Kids','Real','Palmer''s','Palmers','Note','Body Fantasies',
    'St Ives','My Rose','Gabrini','Gabrini Thick','EveryDay','Simple','Pampers',
    'Gillette','Gillette Venus','Mavala','Vito+','Zinko','Veet Silky','Skala','Sorento',
    'Avene','Carroten','Huggies','Kin','Eveline Wonder','M-Free',
    'CeraVe','Footness Rough','Isdin','Nana','Shea','Olaplex','Sally',
    'Secret Unscented','Secret Completely','SVR','Golden Rose','Bioten','ACM',
    'Urban','Septona','Flamingos','Chiocco','Depend','Beurer Ear',
    'Forever52 Flawless','Forever52 Perfect','Forever52 Ultrablend','Forever52 Brush'
  ])
);