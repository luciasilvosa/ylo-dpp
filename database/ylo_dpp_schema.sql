-- ============================================================
-- Esquema SQL de la base de datos relacional ylo_dpp.db
-- Pasaporte Digital de Producto (DPP) — Caso YLÖ
-- TFG Lucía Silvosa, UIE, mayo 2025
-- ============================================================

BEGIN TRANSACTION;

-- ------------------------------------------------------------
-- Tablas independientes (sin claves foráneas)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Operador (
    issuerAddress  TEXT PRIMARY KEY,
    legalName      TEXT NOT NULL,
    country        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Modelo (
    modelId           TEXT PRIMARY KEY,
    productName       TEXT NOT NULL,
    category          TEXT NOT NULL,
    materials         TEXT NOT NULL,
    careInstructions  TEXT NOT NULL,
    endOfLife         TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS CentroProduccion (
    facilityId  TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    country     TEXT NOT NULL,
    city        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Proveedor (
    supplierId              INTEGER PRIMARY KEY AUTOINCREMENT,
    name                    TEXT NOT NULL,
    country                 TEXT NOT NULL,
    city                    TEXT NOT NULL,
    certifications          TEXT,
    certificationsVerified  INTEGER NOT NULL DEFAULT 0,
    UNIQUE (name, city)
);

-- ------------------------------------------------------------
-- Tabla central: Lote
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Lote (
    batchId                     TEXT PRIMARY KEY,
    modelId                     TEXT NOT NULL,
    facilityId                  TEXT NOT NULL,
    productionDate              TEXT NOT NULL,
    volume                      INTEGER NOT NULL,
    productionMethod            TEXT NOT NULL,
    carbonFootprintValue        REAL,
    carbonFootprintUnit         TEXT,
    carbonFootprintMethodology  TEXT,
    carbonFootprintScope        TEXT,
    carbonFootprintCertified    INTEGER NOT NULL DEFAULT 0,
    certifications              TEXT,
    FOREIGN KEY (modelId)    REFERENCES Modelo(modelId),
    FOREIGN KEY (facilityId) REFERENCES CentroProduccion(facilityId)
);

-- ------------------------------------------------------------
-- Tabla asociativa N:M entre Lote y Proveedor
-- El rol (Fibra, Hilatura, Tejeduría, Tintura y acabado,
-- Confección) es atributo de la relación, no de las entidades
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS LoteProveedor (
    batchId     TEXT NOT NULL,
    supplierId  INTEGER NOT NULL,
    role        TEXT NOT NULL,
    PRIMARY KEY (batchId, supplierId, role),
    FOREIGN KEY (batchId)    REFERENCES Lote(batchId),
    FOREIGN KEY (supplierId) REFERENCES Proveedor(supplierId)
);

-- ------------------------------------------------------------
-- Tabla DPP: persistencia del pasaporte y su versionado
-- La clave primaria compuesta (batchId, version) permite que
-- un mismo lote tenga múltiples versiones del pasaporte
-- registradas como filas independientes, cada una con su
-- dataHash y su metadataURI propios
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS DPP (
    batchId        TEXT NOT NULL,
    version        INTEGER NOT NULL DEFAULT 1,
    tokenId        INTEGER,
    issuerAddress  TEXT NOT NULL,
    dataHash       TEXT,
    metadataURI    TEXT,
    lastUpdate     TEXT,
    schemaURI      TEXT NOT NULL,
    language       TEXT NOT NULL DEFAULT 'es',
    PRIMARY KEY (batchId, version),
    FOREIGN KEY (batchId)       REFERENCES Lote(batchId),
    FOREIGN KEY (issuerAddress) REFERENCES Operador(issuerAddress)
);

COMMIT;