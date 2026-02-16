CREATE DATABASE login_demo;

USE login_demo;

CREATE TABLE users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 username VARCHAR(50) UNIQUE,
 password_hash VARCHAR(255),
 full_name VARCHAR(100)
);
