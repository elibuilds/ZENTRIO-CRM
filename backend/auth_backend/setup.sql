CREATE DATABASE IF NOT EXISTS zentrio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'zentrio'@'localhost' IDENTIFIED BY 'zentrio';
GRANT ALL PRIVILEGES ON zentrio.* TO 'zentrio'@'localhost';
FLUSH PRIVILEGES;
