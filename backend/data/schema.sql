-- ===================================
-- Tabla Alumnas
-- ===================================
CREATE TABLE IF NOT EXISTS alumnas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    telefono TEXT,
    email TEXT,
    fecha_nacimiento TEXT,
    fecha_inscripcion TEXT,
    observaciones TEXT,
    dni TEXT,
    nss TEXT,
    activa INTEGER DEFAULT 1
);

-- ===================================
-- Tabla Clases (nombre base / tipo)
-- ===================================
CREATE TABLE IF NOT EXISTS clases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL
);

-- Clases base (SIN repetir)
INSERT INTO clases (nombre, tipo) VALUES
('Herencia', 'Flamenco'),
('Flamenco Inicio', 'Flamenco'),
('Flamenco 2', 'Flamenco'),
('Flamenco 3', 'Flamenco'),
('Flamenco 4', 'Flamenco'),
('Sevillanas', 'Sevillanas'),
('Sevillanas Avanzadas', 'Sevillanas'),
('Sevillanas Infantil', 'Sevillanas'),
('Ballet', 'Ballet');

-- ===================================
-- Tabla horarios (cada horario real)
-- ===================================
CREATE TABLE IF NOT EXISTS horarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clase_id INTEGER NOT NULL,
    dia TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fin TEXT,
    descripcion TEXT,
    FOREIGN KEY (clase_id) REFERENCES clases(id)
);

-- ===================================
-- Tabla Inscripciones (alumna ↔ horario)
-- ===================================
CREATE TABLE IF NOT EXISTS inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumna_id INTEGER NOT NULL,
    horario_id INTEGER NOT NULL,
    fecha_inscripcion TEXT DEFAULT CURRENT_DATE,
    FOREIGN KEY (alumna_id) REFERENCES alumnas(id),
    FOREIGN KEY (horario_id) REFERENCES horarios(id)
);

-- ===================================
-- Tabla Pagos
-- ===================================
CREATE TABLE IF NOT EXISTS pagos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumna_id INTEGER NOT NULL,
    horario_id INTEGER,
    fecha TEXT NOT NULL,
    importe REAL NOT NULL,
    concepto TEXT,
    estado TEXT DEFAULT 'pendiente',
    FOREIGN KEY (alumna_id) REFERENCES alumnas(id),
    FOREIGN KEY (horario_id) REFERENCES horarios(id)
);

