USE cv_generator;

DROP TABLE IF EXISTS habilidades;

CREATE TABLE habilidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nivel ENUM('Basico','Intermedio','Avanzado','Experto') NOT NULL DEFAULT 'Basico',
    tipo ENUM('Tecnica','Blanda') NOT NULL DEFAULT 'Tecnica',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_habilidades (usuario_id),
    INDEX idx_tipo_habilidades (tipo)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
