-- Fix remaining fils→JOD anomalies (batch 2)
UPDATE products SET price = ROUND((price / 100.0)::numeric, 2)
WHERE price > 100
AND (
  brand ILIKE ANY(ARRAY[
    'Lancome','Uriage','Novaclear','Le','Golden','Septona Antibacterial',
    'Pasito A','Tommee','Thermos'
  ])
);