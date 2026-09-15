CREATE DATABASE IF NOT EXISTS zentrio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'zentrio'@'localhost' IDENTIFIED BY 'zentrio';
GRANT ALL PRIVILEGES ON zentrio.* TO 'zentrio'@'localhost';
FLUSH PRIVILEGES;

-- New users are created as level 1. An admin can be created by the SQL query below.
-- UPDATE zentrio.user SET role = 'admin' WHERE username = 'your_username';
