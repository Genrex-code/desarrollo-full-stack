CREATE DATABASE thevault;
use thevault;

create table usuarios (
id INT auto_increment primary key,
nombre VARCHAR(100),
email VARCHAR(100) UNIQUE,
password_hash VARCHAR(255),
rol ENUM('admin','user') DEFAULT 'user'
);
CREATE TABLE contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE discos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150),
    artista VARCHAR(150),
    genero VARCHAR(100),
    formato ENUM('CD','Cassette','Vinyl'),
    imagen_path VARCHAR(255),
    anio INT,
    descripcion TEXT,
    top TINYINT DEFAULT 0
);
