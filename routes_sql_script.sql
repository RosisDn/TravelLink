-- This SQL script will work on the PostgreSQL database from the Radxa server.
-- The table for travel routes is filled up with mock-data which with time relative to the present will become outdated.
    -- this script should clear and recreate the table with start: script execution day
-- -- can only be ran physically on the server as superadmin

-- 1. Has to wipe out the outdated entries, so a clean table for routes
TRUNCATE TABLE routes RESTART IDENTITY;

-- 2. Static definition for the 30 routes
With base_catalog (origin, destination, type, base_price, first_departure) AS (VALUES

-- planes
('Stockholm', 'London', 'plane', 1000.00, 0),
('Göteborg', 'Paris', 'plane', 800.00, 0),
('Malmö', 'Berlin', 'plane', 750.00, 1),
('Umeå', 'Helsinki', 'plane', 900.00, 3),
('Luleå', 'Oslo', 'plane', 600.00, 5),
('Visby', 'Stockholm', 'plane', 400.00, 7),
('Kiruna', 'Göteborg', 'plane', 1100.00, 10),
('Västerås', 'Copenhagen', 'plane', 850.00, 14),
('Örebro', 'Prague', 'plane', 800.00, 18),
('Trollhättan', 'Bromma', 'plane', 1200.00, 21),

-- 10 Buses
('Trollhättan', 'Göteborg', 'bus', 100.00, 0),
('Uddevalla', 'Strömstad', 'bus', 70.00, 0),
('Boras', 'Jönköping', 'bus', 90.00, 0),
('Skövde', 'Örebro', 'bus', 120.00, 1),
('Karlstad', 'Oslo', 'bus', 200.00, 1),
('Uppsala', 'Gävle', 'bus', 90.00, 4),
('Halmstad', 'Malmö', 'bus', 80.00, 8),
('Kalmar', 'Växjö', 'bus', 60.00, 12),
('Norrköping', 'Linköping', 'bus', 50.00, 16),
('Falun', 'Mora', 'bus', 110.00, 20),

-- 10 Trains
('Stockholm', 'Göteborg', 'train', 500.00, 0),
('Malmö', 'Stockholm', 'train', 450.00, 0),
('Lund', 'Copenhagen', 'train', 180.00, 1),
('Sundsvall', 'Östersund', 'train', 170.00, 3),
('Örebro', 'Västerås', 'train', 100.00, 6),
('Gävle', 'Uppsala', 'train', 140.00, 9),
('Kiruna', 'Narvik', 'train', 250.00, 12),
('Karlskrona', 'Kristianstad', 'train', 120.00, 15),
('Eskilstuna', 'Stockholm', 'train', 160.00, 19),
('Växjö', 'Alvesta', 'train', 50.00, 22)),

days AS (
SELECT generate_series(0, 83) as d
),

repeat AS (
SELECT generate_series(0, 21, 3) as h
)

INSERT INTO routes (origin, destination, transport_type, base_price, departure_date, departure_time, available_seats) 
SELECT
bc.origin,
bc.destination,
bc.type,
bc.price,
(CURRENT_DATE + (days.d || ' days')::interval)::date,
((bc.first_departure || ' hours')::interval + (repeats.h || ' hours')::interval)::time,
ARRAY['1A', '1B', '1C', '2A', '2B',  '2C', '3A', '3B', '3C', '4A', '4B', '4C', '5A', '5B', '5C', '6A', '6B', '6C', '7A', '7B', '7C', '8A', '8B', '8C']
FROM base_catalog bc
CROSS JOIN days
CROSS JOIN repeats
WHERE (bc.first_departure + repeats.h) < 24;