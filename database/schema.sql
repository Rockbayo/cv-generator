CREATE DATABASE cv_generator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cv_generator;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    resumen TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE experiencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    empresa VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    descripcion TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE educacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    institucion VARCHAR(100) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE habilidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nombre VARCHAR(50) NOT NULL,
    nivel ENUM('Básico', 'Intermedio', 'Avanzado', 'Experto'),
    tipo ENUM('Técnica', 'Blanda'),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);