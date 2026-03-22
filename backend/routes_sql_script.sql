-- This SQL script will work on the PostgreSQL database from the Radxa server.
-- The table for travel routes is filled up with mock-data which with time relative to the present will become outdated.
    -- this script should clear and recreate the table with start: script execution day
-- -- can only be ran physically on the server as superadmin

-- 1. Has to wipe out the outdated entries, so a clean table for routes
TRUNCATE TABLE routes RESTART IDENTITY CASCADE;

-- Later editing this script to add complexity and widen the route entries
-- The frontend is experiencing a visual storage of entry matches, reason for upgrading the field of connections

-- 2. Static definitions
-- TravelLink route generation script v3
-- Run as superuser: sudo -u postgres psql -d travellink -f script.sql
-- Clears all routes and regenerates from today for 84 days

TRUNCATE TABLE routes RESTART IDENTITY CASCADE;

WITH base_catalog (origin, destination, type, base_price, dep_hour) AS (VALUES

-- ══════════════════════════════════════════════════════════════
-- PLANE ROUTES
-- Only Swedish airport cities → other Swedish/international cities
-- Swedish airports: Stockholm, Göteborg, Malmö, Umeå, Luleå,
--   Visby, Kiruna, Västerås, Örebro, Sundsvall, Östersund,
--   Kalmar, Norrköping, Halmstad, Karlstad, Trollhättan
-- International: London, Paris, Berlin, Helsinki, Oslo, Copenhagen
-- ══════════════════════════════════════════════════════════════

-- Stockholm → everywhere
('Stockholm', 'London',       'plane', 1000.00,  6),
('Stockholm', 'London',       'plane', 1000.00, 13),
('Stockholm', 'London',       'plane', 1000.00, 18),
('Stockholm', 'Paris',        'plane',  950.00,  7),
('Stockholm', 'Paris',        'plane',  950.00, 15),
('Stockholm', 'Berlin',       'plane',  800.00,  8),
('Stockholm', 'Berlin',       'plane',  800.00, 16),
('Stockholm', 'Helsinki',     'plane',  700.00,  7),
('Stockholm', 'Helsinki',     'plane',  700.00, 14),
('Stockholm', 'Oslo',         'plane',  500.00,  8),
('Stockholm', 'Oslo',         'plane',  500.00, 15),
('Stockholm', 'Copenhagen',   'plane',  600.00,  6),
('Stockholm', 'Copenhagen',   'plane',  600.00, 12),
('Stockholm', 'Copenhagen',   'plane',  600.00, 18),
('Stockholm', 'Göteborg',     'plane',  450.00,  7),
('Stockholm', 'Göteborg',     'plane',  450.00, 13),
('Stockholm', 'Malmö',        'plane',  500.00,  8),
('Stockholm', 'Malmö',        'plane',  500.00, 16),
('Stockholm', 'Umeå',         'plane',  550.00,  7),
('Stockholm', 'Umeå',         'plane',  550.00, 15),
('Stockholm', 'Luleå',        'plane',  700.00,  6),
('Stockholm', 'Luleå',        'plane',  700.00, 14),
('Stockholm', 'Kiruna',       'plane',  800.00,  7),
('Stockholm', 'Visby',        'plane',  400.00,  8),
('Stockholm', 'Visby',        'plane',  400.00, 14),
('Stockholm', 'Sundsvall',    'plane',  500.00,  8),
('Stockholm', 'Östersund',    'plane',  550.00,  9),
('Stockholm', 'Kalmar',       'plane',  450.00,  9),
('Stockholm', 'Norrköping',   'plane',  350.00,  8),

-- Göteborg → everywhere
('Göteborg',  'London',       'plane',  900.00,  7),
('Göteborg',  'London',       'plane',  900.00, 15),
('Göteborg',  'Paris',        'plane',  850.00,  8),
('Göteborg',  'Paris',        'plane',  850.00, 16),
('Göteborg',  'Berlin',       'plane',  750.00,  9),
('Göteborg',  'Copenhagen',   'plane',  550.00,  7),
('Göteborg',  'Copenhagen',   'plane',  550.00, 14),
('Göteborg',  'Oslo',         'plane',  480.00,  8),
('Göteborg',  'Helsinki',     'plane',  750.00, 10),
('Göteborg',  'Stockholm',    'plane',  450.00,  8),
('Göteborg',  'Stockholm',    'plane',  450.00, 14),
('Göteborg',  'Malmö',        'plane',  380.00,  9),
('Göteborg',  'Umeå',         'plane',  650.00,  8),
('Göteborg',  'Luleå',        'plane',  800.00,  7),
('Göteborg',  'Kiruna',       'plane',  900.00,  8),
('Göteborg',  'Visby',        'plane',  500.00,  9),
('Göteborg',  'Sundsvall',    'plane',  600.00,  9),

-- Malmö → everywhere
('Malmö',     'London',       'plane',  880.00,  7),
('Malmö',     'London',       'plane',  880.00, 15),
('Malmö',     'Paris',        'plane',  820.00,  8),
('Malmö',     'Berlin',       'plane',  720.00,  9),
('Malmö',     'Copenhagen',   'plane',  300.00,  6),
('Malmö',     'Copenhagen',   'plane',  300.00, 11),
('Malmö',     'Copenhagen',   'plane',  300.00, 17),
('Malmö',     'Oslo',         'plane',  600.00,  9),
('Malmö',     'Helsinki',     'plane',  750.00, 10),
('Malmö',     'Stockholm',    'plane',  500.00,  7),
('Malmö',     'Stockholm',    'plane',  500.00, 15),
('Malmö',     'Göteborg',     'plane',  380.00,  8),
('Malmö',     'Umeå',         'plane',  700.00,  8),
('Malmö',     'Luleå',        'plane',  850.00,  7),

-- Umeå → connections
('Umeå',      'Stockholm',    'plane',  550.00,  7),
('Umeå',      'Stockholm',    'plane',  550.00, 15),
('Umeå',      'Göteborg',     'plane',  650.00,  8),
('Umeå',      'Malmö',        'plane',  700.00,  9),
('Umeå',      'Copenhagen',   'plane',  800.00,  9),
('Umeå',      'Oslo',         'plane',  700.00,  8),
('Umeå',      'Helsinki',     'plane',  600.00,  9),
('Umeå',      'Luleå',        'plane',  300.00,  8),

-- Luleå → connections
('Luleå',     'Stockholm',    'plane',  700.00,  6),
('Luleå',     'Stockholm',    'plane',  700.00, 14),
('Luleå',     'Göteborg',     'plane',  800.00,  7),
('Luleå',     'Malmö',        'plane',  850.00,  8),
('Luleå',     'Umeå',         'plane',  300.00,  9),
('Luleå',     'Helsinki',     'plane',  650.00,  9),

-- Kiruna → connections
('Kiruna',    'Stockholm',    'plane',  800.00,  7),
('Kiruna',    'Stockholm',    'plane',  800.00, 15),
('Kiruna',    'Göteborg',     'plane',  900.00,  8),
('Kiruna',    'Luleå',        'plane',  350.00,  9),
('Kiruna',    'Umeå',         'plane',  400.00, 10),

-- Visby → connections
('Visby',     'Stockholm',    'plane',  400.00,  8),
('Visby',     'Stockholm',    'plane',  400.00, 14),
('Visby',     'Göteborg',     'plane',  500.00,  9),
('Visby',     'Malmö',        'plane',  480.00,  9),

-- Sundsvall → connections
('Sundsvall', 'Stockholm',    'plane',  500.00,  7),
('Sundsvall', 'Stockholm',    'plane',  500.00, 15),
('Sundsvall', 'Göteborg',     'plane',  600.00,  8),
('Sundsvall', 'Malmö',        'plane',  650.00,  9),
('Sundsvall', 'Oslo',         'plane',  600.00,  9),

-- Östersund → connections
('Östersund', 'Stockholm',    'plane',  550.00,  7),
('Östersund', 'Stockholm',    'plane',  550.00, 15),
('Östersund', 'Göteborg',     'plane',  650.00,  8),
('Östersund', 'Oslo',         'plane',  550.00,  9),

-- Kalmar → connections
('Kalmar',    'Stockholm',    'plane',  450.00,  8),
('Kalmar',    'Stockholm',    'plane',  450.00, 15),
('Kalmar',    'Göteborg',     'plane',  500.00,  9),
('Kalmar',    'Malmö',        'plane',  380.00,  9),

-- Norrköping → connections
('Norrköping','Stockholm',    'plane',  350.00,  8),
('Norrköping','Göteborg',     'plane',  420.00,  9),
('Norrköping','Malmö',        'plane',  400.00,  9),

-- Halmstad → connections
('Halmstad',  'Stockholm',    'plane',  500.00,  8),
('Halmstad',  'Copenhagen',   'plane',  400.00,  9),

-- Karlstad → connections
('Karlstad',  'Stockholm',    'plane',  450.00,  8),
('Karlstad',  'Göteborg',     'plane',  400.00,  9),
('Karlstad',  'Oslo',         'plane',  450.00,  9),

-- Trollhättan → connections
('Trollhättan','Stockholm',   'plane',  480.00,  8),
('Trollhättan','Malmö',       'plane',  420.00,  9),
('Trollhättan','Copenhagen',  'plane',  500.00,  9),

-- Västerås → connections
('Västerås',  'Stockholm',    'plane',  300.00,  8),
('Västerås',  'Göteborg',     'plane',  420.00,  9),
('Västerås',  'Copenhagen',   'plane',  550.00,  9),

-- Örebro → connections
('Örebro',    'Stockholm',    'plane',  380.00,  8),
('Örebro',    'Göteborg',     'plane',  400.00,  9),
('Örebro',    'Copenhagen',   'plane',  550.00,  9),

-- International → Swedish airport cities (return legs)
('London',     'Stockholm',   'plane', 1000.00,  9),
('London',     'Stockholm',   'plane', 1000.00, 15),
('London',     'Stockholm',   'plane', 1000.00, 19),
('London',     'Göteborg',    'plane',  900.00,  8),
('London',     'Göteborg',    'plane',  900.00, 16),
('London',     'Malmö',       'plane',  880.00, 10),
('London',     'Umeå',        'plane',  950.00,  9),
('London',     'Luleå',       'plane', 1050.00,  9),
('Paris',      'Stockholm',   'plane',  950.00,  9),
('Paris',      'Stockholm',   'plane',  950.00, 17),
('Paris',      'Göteborg',    'plane',  850.00,  9),
('Paris',      'Malmö',       'plane',  820.00, 10),
('Berlin',     'Stockholm',   'plane',  800.00,  9),
('Berlin',     'Göteborg',    'plane',  750.00, 10),
('Berlin',     'Malmö',       'plane',  720.00,  9),
('Helsinki',   'Stockholm',   'plane',  700.00,  9),
('Helsinki',   'Göteborg',    'plane',  750.00, 10),
('Helsinki',   'Umeå',        'plane',  600.00,  9),
('Helsinki',   'Luleå',       'plane',  650.00,  9),
('Oslo',       'Stockholm',   'plane',  500.00,  8),
('Oslo',       'Stockholm',   'plane',  500.00, 16),
('Oslo',       'Göteborg',    'plane',  480.00,  9),
('Oslo',       'Malmö',       'plane',  600.00,  9),
('Oslo',       'Sundsvall',   'plane',  600.00, 10),
('Oslo',       'Östersund',   'plane',  550.00, 10),
('Oslo',       'Karlstad',    'plane',  450.00, 10),
('Copenhagen', 'Stockholm',   'plane',  600.00,  8),
('Copenhagen', 'Stockholm',   'plane',  600.00, 14),
('Copenhagen', 'Göteborg',    'plane',  550.00,  9),
('Copenhagen', 'Malmö',       'plane',  300.00,  7),
('Copenhagen', 'Malmö',       'plane',  300.00, 12),
('Copenhagen', 'Malmö',       'plane',  300.00, 18),
('Copenhagen', 'Umeå',        'plane',  800.00,  9),
('Copenhagen', 'Västerås',    'plane',  550.00, 10),
('Copenhagen', 'Trollhättan', 'plane',  500.00, 10),
('Copenhagen', 'Halmstad',    'plane',  400.00,  9),

-- ══════════════════════════════════════════════════════════════
-- TRAIN ROUTES
-- Following Swedish rail corridors
-- Western main line: Stockholm - Göteborg
-- Southern main line: Stockholm - Malmö via Norrköping/Linköping
-- Coast-to-coast: Göteborg - Borås - Växjö - Kalmar/Karlskrona
-- Northern line: Stockholm - Uppsala - Gävle - Sundsvall
-- Western line: Göteborg - Trollhättan - Karlstad
-- Ore line: Luleå - Kiruna
-- ══════════════════════════════════════════════════════════════

-- Western main line (Stockholm ↔ Göteborg)
('Stockholm',  'Göteborg',    'train',  500.00,  6),
('Stockholm',  'Göteborg',    'train',  500.00, 10),
('Stockholm',  'Göteborg',    'train',  500.00, 14),
('Stockholm',  'Göteborg',    'train',  500.00, 18),
('Göteborg',   'Stockholm',   'train',  500.00,  7),
('Göteborg',   'Stockholm',   'train',  500.00, 11),
('Göteborg',   'Stockholm',   'train',  500.00, 15),
('Göteborg',   'Stockholm',   'train',  500.00, 19),

('Stockholm',  'Skövde',      'train',  280.00,  7),
('Stockholm',  'Skövde',      'train',  280.00, 14),
('Skövde',     'Stockholm',   'train',  280.00,  8),
('Skövde',     'Stockholm',   'train',  280.00, 15),
('Göteborg',   'Skövde',      'train',  220.00,  8),
('Skövde',     'Göteborg',    'train',  220.00,  9),

-- Southern main line (Stockholm ↔ Malmö)
('Stockholm',  'Malmö',       'train',  600.00,  6),
('Stockholm',  'Malmö',       'train',  600.00, 12),
('Stockholm',  'Malmö',       'train',  600.00, 18),
('Malmö',      'Stockholm',   'train',  600.00,  7),
('Malmö',      'Stockholm',   'train',  600.00, 13),
('Malmö',      'Stockholm',   'train',  600.00, 19),

('Stockholm',  'Norrköping',  'train',  250.00,  7),
('Stockholm',  'Norrköping',  'train',  250.00, 12),
('Stockholm',  'Norrköping',  'train',  250.00, 17),
('Norrköping', 'Stockholm',   'train',  250.00,  8),
('Norrköping', 'Stockholm',   'train',  250.00, 13),
('Norrköping', 'Stockholm',   'train',  250.00, 18),

('Stockholm',  'Linköping',   'train',  290.00,  7),
('Stockholm',  'Linköping',   'train',  290.00, 13),
('Linköping',  'Stockholm',   'train',  290.00,  8),
('Linköping',  'Stockholm',   'train',  290.00, 14),

('Norrköping', 'Malmö',       'train',  380.00,  8),
('Malmö',      'Norrköping',  'train',  380.00,  9),
('Linköping',  'Malmö',       'train',  340.00,  8),
('Malmö',      'Linköping',   'train',  340.00,  9),

('Malmö',      'Göteborg',    'train',  350.00,  7),
('Malmö',      'Göteborg',    'train',  350.00, 13),
('Malmö',      'Göteborg',    'train',  350.00, 19),
('Göteborg',   'Malmö',       'train',  350.00,  8),
('Göteborg',   'Malmö',       'train',  350.00, 14),
('Göteborg',   'Malmö',       'train',  350.00, 20),

-- Malmö ↔ Lund ↔ Copenhagen (Öresund line)
('Malmö',      'Lund',        'train',   80.00,  7),
('Malmö',      'Lund',        'train',   80.00, 12),
('Malmö',      'Lund',        'train',   80.00, 17),
('Lund',       'Malmö',       'train',   80.00,  8),
('Lund',       'Malmö',       'train',   80.00, 13),
('Lund',       'Malmö',       'train',   80.00, 18),
('Malmö',      'Copenhagen',  'train',  180.00,  6),
('Malmö',      'Copenhagen',  'train',  180.00, 10),
('Malmö',      'Copenhagen',  'train',  180.00, 14),
('Malmö',      'Copenhagen',  'train',  180.00, 18),
('Copenhagen', 'Malmö',       'train',  180.00,  7),
('Copenhagen', 'Malmö',       'train',  180.00, 11),
('Copenhagen', 'Malmö',       'train',  180.00, 15),
('Copenhagen', 'Malmö',       'train',  180.00, 19),
('Lund',       'Copenhagen',  'train',  160.00,  7),
('Copenhagen', 'Lund',        'train',  160.00,  8),

-- Kristianstad & Karlskrona southern connections
('Malmö',      'Kristianstad','train',  150.00,  8),
('Malmö',      'Kristianstad','train',  150.00, 15),
('Kristianstad','Malmö',      'train',  150.00,  9),
('Kristianstad','Malmö',      'train',  150.00, 16),
('Malmö',      'Karlskrona',  'train',  220.00,  8),
('Karlskrona', 'Malmö',       'train',  220.00,  9),
('Kristianstad','Karlskrona', 'train',  120.00,  9),
('Karlskrona', 'Kristianstad','train',  120.00, 10),

-- Coast-to-coast line (Göteborg ↔ Kalmar/Karlskrona via Borås/Växjö)
('Göteborg',   'Borås',       'train',  150.00,  7),
('Göteborg',   'Borås',       'train',  150.00, 13),
('Göteborg',   'Borås',       'train',  150.00, 18),
('Borås',      'Göteborg',    'train',  150.00,  8),
('Borås',      'Göteborg',    'train',  150.00, 14),
('Borås',      'Göteborg',    'train',  150.00, 19),
('Borås',      'Alvesta',     'train',  180.00,  9),
('Alvesta',    'Borås',       'train',  180.00, 10),
('Alvesta',    'Växjö',       'train',   50.00,  8),
('Växjö',      'Alvesta',     'train',   50.00,  9),
('Alvesta',    'Kalmar',      'train',  160.00,  9),
('Kalmar',     'Alvesta',     'train',  160.00, 10),
('Alvesta',    'Karlskrona',  'train',  180.00,  9),
('Karlskrona', 'Alvesta',     'train',  180.00, 10),
('Växjö',      'Karlskrona',  'train',  140.00,  9),
('Karlskrona', 'Växjö',       'train',  140.00, 10),
('Göteborg',   'Kalmar',      'train',  400.00,  8),
('Kalmar',     'Göteborg',    'train',  400.00,  9),

-- Northern main line (Stockholm ↔ Uppsala ↔ Gävle ↔ Sundsvall)
('Stockholm',  'Uppsala',     'train',  120.00,  7),
('Stockholm',  'Uppsala',     'train',  120.00, 11),
('Stockholm',  'Uppsala',     'train',  120.00, 15),
('Stockholm',  'Uppsala',     'train',  120.00, 19),
('Uppsala',    'Stockholm',   'train',  120.00,  8),
('Uppsala',    'Stockholm',   'train',  120.00, 12),
('Uppsala',    'Stockholm',   'train',  120.00, 16),
('Uppsala',    'Stockholm',   'train',  120.00, 20),
('Uppsala',    'Gävle',       'train',  140.00,  8),
('Uppsala',    'Gävle',       'train',  140.00, 14),
('Gävle',      'Uppsala',     'train',  140.00,  9),
('Gävle',      'Uppsala',     'train',  140.00, 15),
('Stockholm',  'Gävle',       'train',  220.00,  7),
('Stockholm',  'Gävle',       'train',  220.00, 14),
('Gävle',      'Stockholm',   'train',  220.00,  8),
('Gävle',      'Stockholm',   'train',  220.00, 15),
('Gävle',      'Sundsvall',   'train',  200.00,  9),
('Gävle',      'Sundsvall',   'train',  200.00, 15),
('Sundsvall',  'Gävle',       'train',  200.00, 10),
('Sundsvall',  'Gävle',       'train',  200.00, 16),
('Stockholm',  'Sundsvall',   'train',  400.00,  7),
('Stockholm',  'Sundsvall',   'train',  400.00, 15),
('Sundsvall',  'Stockholm',   'train',  400.00,  8),
('Sundsvall',  'Stockholm',   'train',  400.00, 16),

-- Sundsvall ↔ Östersund (inland)
('Sundsvall',  'Östersund',   'train',  170.00,  9),
('Sundsvall',  'Östersund',   'train',  170.00, 15),
('Östersund',  'Sundsvall',   'train',  170.00, 10),
('Östersund',  'Sundsvall',   'train',  170.00, 16),

-- Falun connections
('Stockholm',  'Falun',       'train',  280.00,  8),
('Stockholm',  'Falun',       'train',  280.00, 15),
('Falun',      'Stockholm',   'train',  280.00,  9),
('Falun',      'Stockholm',   'train',  280.00, 16),
('Falun',      'Gävle',       'train',  130.00,  9),
('Gävle',      'Falun',       'train',  130.00, 10),
('Falun',      'Mora',        'train',  110.00,  9),
('Mora',       'Falun',       'train',  110.00, 10),

-- Örebro / Västerås / Eskilstuna / Stockholm
('Stockholm',  'Örebro',      'train',  220.00,  8),
('Stockholm',  'Örebro',      'train',  220.00, 14),
('Örebro',     'Stockholm',   'train',  220.00,  9),
('Örebro',     'Stockholm',   'train',  220.00, 15),
('Stockholm',  'Västerås',    'train',  160.00,  8),
('Stockholm',  'Västerås',    'train',  160.00, 14),
('Västerås',   'Stockholm',   'train',  160.00,  9),
('Västerås',   'Stockholm',   'train',  160.00, 15),
('Stockholm',  'Eskilstuna',  'train',  180.00,  8),
('Stockholm',  'Eskilstuna',  'train',  180.00, 14),
('Eskilstuna', 'Stockholm',   'train',  180.00,  9),
('Eskilstuna', 'Stockholm',   'train',  180.00, 15),
('Västerås',   'Örebro',      'train',  100.00,  9),
('Västerås',   'Örebro',      'train',  100.00, 15),
('Örebro',     'Västerås',    'train',  100.00, 10),
('Örebro',     'Västerås',    'train',  100.00, 16),
('Örebro',     'Göteborg',    'train',  320.00,  8),
('Örebro',     'Göteborg',    'train',  320.00, 15),
('Göteborg',   'Örebro',      'train',  320.00,  9),
('Göteborg',   'Örebro',      'train',  320.00, 16),

-- Western line (Göteborg ↔ Trollhättan ↔ Karlstad ↔ Oslo)
('Göteborg',   'Trollhättan', 'train',  120.00,  7),
('Göteborg',   'Trollhättan', 'train',  120.00, 13),
('Göteborg',   'Trollhättan', 'train',  120.00, 18),
('Trollhättan','Göteborg',    'train',  120.00,  8),
('Trollhättan','Göteborg',    'train',  120.00, 14),
('Trollhättan','Göteborg',    'train',  120.00, 19),
('Trollhättan','Karlstad',    'train',  200.00,  9),
('Karlstad',   'Trollhättan', 'train',  200.00, 10),
('Karlstad',   'Göteborg',    'train',  300.00,  8),
('Karlstad',   'Göteborg',    'train',  300.00, 14),
('Göteborg',   'Karlstad',    'train',  300.00,  9),
('Göteborg',   'Karlstad',    'train',  300.00, 15),
('Karlstad',   'Oslo',        'train',  400.00,  9),
('Karlstad',   'Oslo',        'train',  400.00, 15),
('Oslo',       'Karlstad',    'train',  400.00, 10),
('Oslo',       'Karlstad',    'train',  400.00, 16),
('Göteborg',   'Oslo',        'train',  500.00,  8),
('Göteborg',   'Oslo',        'train',  500.00, 15),
('Oslo',       'Göteborg',    'train',  500.00,  9),
('Oslo',       'Göteborg',    'train',  500.00, 16),

-- Halmstad connections
('Göteborg',   'Halmstad',    'train',  180.00,  8),
('Göteborg',   'Halmstad',    'train',  180.00, 15),
('Halmstad',   'Göteborg',    'train',  180.00,  9),
('Halmstad',   'Göteborg',    'train',  180.00, 16),
('Halmstad',   'Malmö',       'train',  200.00,  9),
('Malmö',      'Halmstad',    'train',  200.00, 10),
('Halmstad',   'Stockholm',   'train',  500.00,  7),
('Stockholm',  'Halmstad',    'train',  500.00,  8),

-- Uddevalla connections
('Göteborg',   'Uddevalla',   'train',  130.00,  8),
('Göteborg',   'Uddevalla',   'train',  130.00, 14),
('Uddevalla',  'Göteborg',    'train',  130.00,  9),
('Uddevalla',  'Göteborg',    'train',  130.00, 15),
('Uddevalla',  'Trollhättan', 'train',   80.00,  9),
('Trollhättan','Uddevalla',   'train',   80.00, 10),

-- Ore line (Luleå ↔ Kiruna)
('Luleå',      'Kiruna',      'train',  350.00,  7),
('Luleå',      'Kiruna',      'train',  350.00, 15),
('Kiruna',     'Luleå',       'train',  350.00,  8),
('Kiruna',     'Luleå',       'train',  350.00, 16),
('Umeå',       'Luleå',       'train',  280.00,  8),
('Luleå',      'Umeå',        'train',  280.00,  9),
('Umeå',       'Sundsvall',   'train',  300.00,  9),
('Sundsvall',  'Umeå',        'train',  300.00, 10),

-- ══════════════════════════════════════════════════════════════
-- BUS ROUTES
-- Regional connections, cities without direct train, cross-border
-- ══════════════════════════════════════════════════════════════

-- Stockholm region buses
('Stockholm',  'Uppsala',     'bus',     90.00,  7),
('Stockholm',  'Uppsala',     'bus',     90.00, 13),
('Uppsala',    'Stockholm',   'bus',     90.00,  8),
('Uppsala',    'Stockholm',   'bus',     90.00, 14),
('Stockholm',  'Västerås',    'bus',    120.00,  8),
('Stockholm',  'Västerås',    'bus',    120.00, 14),
('Västerås',   'Stockholm',   'bus',    120.00,  9),
('Västerås',   'Stockholm',   'bus',    120.00, 15),
('Stockholm',  'Örebro',      'bus',    150.00,  8),
('Stockholm',  'Örebro',      'bus',    150.00, 15),
('Örebro',     'Stockholm',   'bus',    150.00,  9),
('Örebro',     'Stockholm',   'bus',    150.00, 16),
('Stockholm',  'Eskilstuna',  'bus',    130.00,  8),
('Eskilstuna', 'Stockholm',   'bus',    130.00,  9),
('Stockholm',  'Norrköping',  'bus',    180.00,  8),
('Stockholm',  'Norrköping',  'bus',    180.00, 15),
('Norrköping', 'Stockholm',   'bus',    180.00,  9),
('Norrköping', 'Stockholm',   'bus',    180.00, 16),
('Stockholm',  'Linköping',   'bus',    200.00,  8),
('Linköping',  'Stockholm',   'bus',    200.00,  9),
('Stockholm',  'Sundsvall',   'bus',    320.00,  7),
('Sundsvall',  'Stockholm',   'bus',    320.00,  8),
('Stockholm',  'Falun',       'bus',    240.00,  8),
('Falun',      'Stockholm',   'bus',    240.00,  9),
('Stockholm',  'Göteborg',    'bus',    300.00,  7),
('Stockholm',  'Göteborg',    'bus',    300.00, 15),
('Göteborg',   'Stockholm',   'bus',    300.00,  8),
('Göteborg',   'Stockholm',   'bus',    300.00, 16),
('Stockholm',  'Malmö',       'bus',    280.00,  7),
('Stockholm',  'Malmö',       'bus',    280.00, 15),
('Malmö',      'Stockholm',   'bus',    280.00,  8),
('Malmö',      'Stockholm',   'bus',    280.00, 16),

-- Göteborg region buses
('Göteborg',   'Trollhättan', 'bus',    100.00,  7),
('Göteborg',   'Trollhättan', 'bus',    100.00, 14),
('Trollhättan','Göteborg',    'bus',    100.00,  8),
('Trollhättan','Göteborg',    'bus',    100.00, 15),
('Göteborg',   'Uddevalla',   'bus',    110.00,  8),
('Göteborg',   'Uddevalla',   'bus',    110.00, 14),
('Uddevalla',  'Göteborg',    'bus',    110.00,  9),
('Uddevalla',  'Göteborg',    'bus',    110.00, 15),
('Göteborg',   'Borås',       'bus',    100.00,  8),
('Göteborg',   'Borås',       'bus',    100.00, 14),
('Borås',      'Göteborg',    'bus',    100.00,  9),
('Borås',      'Göteborg',    'bus',    100.00, 15),
('Göteborg',   'Halmstad',    'bus',    150.00,  8),
('Göteborg',   'Halmstad',    'bus',    150.00, 15),
('Halmstad',   'Göteborg',    'bus',    150.00,  9),
('Halmstad',   'Göteborg',    'bus',    150.00, 16),
('Göteborg',   'Karlstad',    'bus',    220.00,  8),
('Göteborg',   'Karlstad',    'bus',    220.00, 15),
('Karlstad',   'Göteborg',    'bus',    220.00,  9),
('Karlstad',   'Göteborg',    'bus',    220.00, 16),
('Göteborg',   'Skövde',      'bus',    180.00,  8),
('Skövde',     'Göteborg',    'bus',    180.00,  9),
('Göteborg',   'Malmö',       'bus',    200.00,  8),
('Göteborg',   'Malmö',       'bus',    200.00, 15),
('Malmö',      'Göteborg',    'bus',    200.00,  9),
('Malmö',      'Göteborg',    'bus',    200.00, 16),

-- Cross-border buses
('Göteborg',   'Oslo',        'bus',    280.00,  8),
('Göteborg',   'Oslo',        'bus',    280.00, 15),
('Oslo',       'Göteborg',    'bus',    280.00,  9),
('Oslo',       'Göteborg',    'bus',    280.00, 16),
('Karlstad',   'Oslo',        'bus',    220.00,  9),
('Oslo',       'Karlstad',    'bus',    220.00, 10),
('Malmö',      'Copenhagen',  'bus',    120.00,  7),
('Malmö',      'Copenhagen',  'bus',    120.00, 12),
('Malmö',      'Copenhagen',  'bus',    120.00, 17),
('Copenhagen', 'Malmö',       'bus',    120.00,  8),
('Copenhagen', 'Malmö',       'bus',    120.00, 13),
('Copenhagen', 'Malmö',       'bus',    120.00, 18),
('Halmstad',   'Copenhagen',  'bus',    250.00,  9),
('Copenhagen', 'Halmstad',    'bus',    250.00, 10),
('Lund',       'Copenhagen',  'bus',    130.00,  8),
('Copenhagen', 'Lund',        'bus',    130.00,  9),

-- Malmö region buses
('Malmö',      'Lund',        'bus',     60.00,  7),
('Malmö',      'Lund',        'bus',     60.00, 13),
('Lund',       'Malmö',       'bus',     60.00,  8),
('Lund',       'Malmö',       'bus',     60.00, 14),
('Malmö',      'Halmstad',    'bus',    150.00,  9),
('Halmstad',   'Malmö',       'bus',    150.00, 10),
('Malmö',      'Kristianstad','bus',    130.00,  8),
('Malmö',      'Kristianstad','bus',    130.00, 15),
('Kristianstad','Malmö',      'bus',    130.00,  9),
('Kristianstad','Malmö',      'bus',    130.00, 16),
('Malmö',      'Karlskrona',  'bus',    180.00,  9),
('Karlskrona', 'Malmö',       'bus',    180.00, 10),

-- Central Sweden buses
('Örebro',     'Västerås',    'bus',     80.00,  8),
('Örebro',     'Västerås',    'bus',     80.00, 14),
('Västerås',   'Örebro',      'bus',     80.00,  9),
('Västerås',   'Örebro',      'bus',     80.00, 15),
('Örebro',     'Karlstad',    'bus',    150.00,  9),
('Karlstad',   'Örebro',      'bus',    150.00, 10),
('Örebro',     'Skövde',      'bus',    130.00,  9),
('Skövde',     'Örebro',      'bus',    130.00, 10),
('Eskilstuna', 'Västerås',    'bus',     70.00,  9),
('Västerås',   'Eskilstuna',  'bus',     70.00, 10),
('Falun',      'Gävle',       'bus',    100.00,  9),
('Gävle',      'Falun',       'bus',    100.00, 10),
('Falun',      'Mora',        'bus',     90.00,  9),
('Mora',       'Falun',       'bus',     90.00, 10),
('Falun',      'Örebro',      'bus',    200.00,  9),
('Örebro',     'Falun',       'bus',    200.00, 10),

-- Northern Sweden buses
('Sundsvall',  'Östersund',   'bus',    180.00,  9),
('Östersund',  'Sundsvall',   'bus',    180.00, 10),
('Sundsvall',  'Umeå',        'bus',    260.00,  8),
('Umeå',       'Sundsvall',   'bus',    260.00,  9),
('Umeå',       'Luleå',       'bus',    300.00,  8),
('Luleå',      'Umeå',        'bus',    300.00,  9),
('Luleå',      'Kiruna',      'bus',    380.00,  7),
('Kiruna',     'Luleå',       'bus',    380.00,  8),
('Östersund',  'Mora',        'bus',    220.00,  9),
('Mora',       'Östersund',   'bus',    220.00, 10),
('Östersund',  'Falun',       'bus',    280.00,  9),
('Falun',      'Östersund',   'bus',    280.00, 10),

-- East Sweden buses
('Norrköping', 'Linköping',   'bus',     50.00,  8),
('Norrköping', 'Linköping',   'bus',     50.00, 14),
('Linköping',  'Norrköping',  'bus',     50.00,  9),
('Linköping',  'Norrköping',  'bus',     50.00, 15),
('Linköping',  'Kalmar',      'bus',    220.00,  9),
('Kalmar',     'Linköping',   'bus',    220.00, 10),
('Linköping',  'Växjö',       'bus',    200.00,  9),
('Växjö',      'Linköping',   'bus',    200.00, 10),
('Kalmar',     'Växjö',       'bus',     80.00,  9),
('Kalmar',     'Växjö',       'bus',     80.00, 15),
('Växjö',      'Kalmar',      'bus',     80.00, 10),
('Växjö',      'Kalmar',      'bus',     80.00, 16),
('Kalmar',     'Karlskrona',  'bus',    120.00,  9),
('Karlskrona', 'Kalmar',      'bus',    120.00, 10),
('Borås',      'Jönköping',   'bus',     90.00,  9),
('Jönköping',  'Borås',       'bus',     90.00, 10),
('Skövde',     'Jönköping',   'bus',    100.00,  9),
('Jönköping',  'Skövde',      'bus',    100.00, 10),
('Jönköping',  'Linköping',   'bus',    130.00,  9),
('Linköping',  'Jönköping',   'bus',    130.00, 10),
('Jönköping',  'Göteborg',    'bus',    220.00,  8),
('Göteborg',   'Jönköping',   'bus',    220.00,  9),
('Jönköping',  'Malmö',       'bus',    230.00,  8),
('Malmö',      'Jönköping',   'bus',    230.00,  9),
('Jönköping',  'Stockholm',   'bus',    280.00,  7),
('Stockholm',  'Jönköping',   'bus',    280.00,  8),

-- Uddevalla extended
('Uddevalla',  'Oslo',        'bus',    280.00,  8),
('Oslo',       'Uddevalla',   'bus',    280.00,  9)

),

    -- generate every day from the day of script run up to 3 months ahead
days AS (
    SELECT generate_series(0, 83) AS d
)

INSERT INTO routes (origin, destination, transport_type, base_price, departure_date, departure_time, available_seats)
SELECT
    bc.origin,
    bc.destination,
    bc.type,
    bc.base_price,
    (CURRENT_DATE + (days.d || ' days')::interval)::date,
    (bc.dep_hour || ' hours')::interval::time,
    CASE bc.type
        -- Plane and train: 4 columns A B C D, 2+2 either side of aisle, 12 rows = 48 seats
        WHEN 'plane' THEN ARRAY[
            '1A','1B','1C','1D','2A','2B','2C','2D','3A','3B','3C','3D',
            '4A','4B','4C','4D','5A','5B','5C','5D','6A','6B','6C','6D',
            '7A','7B','7C','7D','8A','8B','8C','8D','9A','9B','9C','9D',
            '10A','10B','10C','10D','11A','11B','11C','11D','12A','12B','12C','12D']
        WHEN 'train' THEN ARRAY[
            '1A','1B','1C','1D','2A','2B','2C','2D','3A','3B','3C','3D',
            '4A','4B','4C','4D','5A','5B','5C','5D','6A','6B','6C','6D',
            '7A','7B','7C','7D','8A','8B','8C','8D','9A','9B','9C','9D',
            '10A','10B','10C','10D','11A','11B','11C','11D','12A','12B','12C','12D']
        -- Bus: 3 columns A B C, 2+1 either side of aisle, 12 rows = 36 seats
        ELSE ARRAY[
            '1A','1B','1C','2A','2B','2C','3A','3B','3C','4A','4B','4C',
            '5A','5B','5C','6A','6B','6C','7A','7B','7C','8A','8B','8C',
            '9A','9B','9C','10A','10B','10C','11A','11B','11C','12A','12B','12C']
    END
FROM base_catalog bc
CROSS JOIN days;