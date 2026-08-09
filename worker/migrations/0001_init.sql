-- MED-PRO Clinic OS — Cloudflare D1 (SQLite) schema.
-- Enums are stored as TEXT; arrays/JSON as TEXT (JSON); money as REAL.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'FRONT_DESK',
  branch        TEXT NOT NULL DEFAULT 'Main',
  status        TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
  id          TEXT PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  age         INTEGER,
  gender      TEXT,
  phone       TEXT,
  email       TEXT,
  blood_group TEXT,
  allergies   TEXT NOT NULL DEFAULT '[]',
  tags        TEXT NOT NULL DEFAULT '[]',
  doctor_id   TEXT,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);

CREATE TABLE IF NOT EXISTS appointments (
  id           TEXT PRIMARY KEY,
  patient_id   TEXT NOT NULL,
  doctor_id    TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'CONSULTATION',
  status       TEXT NOT NULL DEFAULT 'BOOKED',
  scheduled_at TEXT NOT NULL,
  room         TEXT,
  notes        TEXT,
  created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_appt_scheduled ON appointments(scheduled_at);

CREATE TABLE IF NOT EXISTS queue_tokens (
  id             TEXT PRIMARY KEY,
  number         INTEGER NOT NULL,
  patient_id     TEXT NOT NULL,
  appointment_id TEXT,
  doctor_name    TEXT,
  type           TEXT,
  room           TEXT,
  status         TEXT NOT NULL DEFAULT 'WAITING',
  enqueued_at    TEXT NOT NULL,
  called_at      TEXT
);

CREATE TABLE IF NOT EXISTS consultations (
  id             TEXT PRIMARY KEY,
  patient_id     TEXT NOT NULL,
  doctor_id      TEXT NOT NULL,
  appointment_id TEXT,
  complaint      TEXT,
  hpi            TEXT,
  diagnosis      TEXT,
  advice         TEXT,
  vitals         TEXT,
  signed_at      TEXT,
  created_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id              TEXT PRIMARY KEY,
  patient_id      TEXT NOT NULL,
  consultation_id TEXT,
  doctor_name     TEXT,
  date            TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prescription_items (
  id              TEXT PRIMARY KEY,
  prescription_id TEXT NOT NULL,
  drug            TEXT NOT NULL,
  dosage          TEXT,
  frequency       TEXT,
  duration        TEXT,
  notes           TEXT
);

CREATE TABLE IF NOT EXISTS lab_orders (
  id         TEXT PRIMARY KEY,
  code       TEXT NOT NULL UNIQUE,
  patient_id TEXT NOT NULL,
  tests      TEXT NOT NULL,
  sample     TEXT,
  ordered_by TEXT,
  status     TEXT NOT NULL DEFAULT 'ORDERED',
  ordered_at TEXT NOT NULL,
  result_at  TEXT,
  result     TEXT
);

CREATE TABLE IF NOT EXISTS invoices (
  id         TEXT PRIMARY KEY,
  number     TEXT NOT NULL UNIQUE,
  patient_id TEXT NOT NULL,
  lines      TEXT NOT NULL,
  subtotal   REAL NOT NULL,
  tax        REAL NOT NULL DEFAULT 0,
  discount   REAL NOT NULL DEFAULT 0,
  total      REAL NOT NULL,
  status     TEXT NOT NULL DEFAULT 'UNPAID',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id         TEXT PRIMARY KEY,
  reference  TEXT NOT NULL UNIQUE,
  invoice_id TEXT,
  patient_id TEXT NOT NULL,
  method     TEXT NOT NULL,
  amount     REAL NOT NULL,
  status     TEXT NOT NULL DEFAULT 'PAID',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT,
  batch         TEXT NOT NULL UNIQUE,
  stock         INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 0,
  expiry        TEXT,
  supplier      TEXT,
  unit_rate     REAL NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
