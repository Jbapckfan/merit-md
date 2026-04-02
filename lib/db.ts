import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "merit-md.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      firm_name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      client_name TEXT,
      case_summary TEXT NOT NULL,
      incident_date TEXT,
      status TEXT NOT NULL DEFAULT 'processing',
      score INTEGER,
      report_json TEXT,
      share_token TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      extracted_text TEXT,
      size_bytes INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS case_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (case_id) REFERENCES cases(id)
    );

    CREATE INDEX IF NOT EXISTS idx_cases_user ON cases(user_id);
    CREATE INDEX IF NOT EXISTS idx_cases_share ON cases(share_token);
    CREATE INDEX IF NOT EXISTS idx_uploads_case ON uploads(case_id);
    CREATE INDEX IF NOT EXISTS idx_case_messages_case ON case_messages(case_id);

    CREATE TABLE IF NOT EXISTS patient_cases (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      description TEXT NOT NULL,
      incident_date TEXT,
      facility TEXT,
      outcome_type TEXT,
      tier TEXT NOT NULL DEFAULT 'quick',
      status TEXT NOT NULL DEFAULT 'processing',
      analysis TEXT,
      score INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_patient_cases_email ON patient_cases(email);
  `);
}

// ── User operations ──

export interface User {
  id: string;
  email: string;
  password_hash: string;
  firm_name: string | null;
  created_at: string;
}

export function createUser(id: string, email: string, passwordHash: string, firmName?: string): User {
  const db = getDb();
  db.prepare(
    "INSERT INTO users (id, email, password_hash, firm_name) VALUES (?, ?, ?, ?)"
  ).run(id, email, passwordHash, firmName || null);
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User;
}

export function getUserByEmail(email: string): User | undefined {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

// ── Case operations ──

export interface Case {
  id: string;
  user_id: string;
  client_name: string | null;
  case_summary: string;
  incident_date: string | null;
  status: string;
  score: number | null;
  report_json: string | null;
  share_token: string | null;
  created_at: string;
  updated_at: string;
}

export function createCase(
  id: string,
  userId: string,
  caseSummary: string,
  clientName?: string,
  incidentDate?: string
): Case {
  const db = getDb();
  db.prepare(
    "INSERT INTO cases (id, user_id, client_name, case_summary, incident_date) VALUES (?, ?, ?, ?, ?)"
  ).run(id, userId, clientName || null, caseSummary, incidentDate || null);
  return db.prepare("SELECT * FROM cases WHERE id = ?").get(id) as Case;
}

export function getCaseById(id: string): Case | undefined {
  return getDb().prepare("SELECT * FROM cases WHERE id = ?").get(id) as Case | undefined;
}

export function getCaseByShareToken(token: string): Case | undefined {
  return getDb().prepare("SELECT * FROM cases WHERE share_token = ?").get(token) as Case | undefined;
}

export function getCasesByUser(userId: string): Case[] {
  return getDb()
    .prepare("SELECT * FROM cases WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as Case[];
}

export function updateCaseReport(
  caseId: string,
  status: string,
  score: number | null,
  reportJson: string | null,
  shareToken: string | null
) {
  getDb()
    .prepare(
      "UPDATE cases SET status = ?, score = ?, report_json = ?, share_token = ?, updated_at = datetime('now') WHERE id = ?"
    )
    .run(status, score, reportJson, shareToken, caseId);
}

// ── Upload operations ──

export interface Upload {
  id: string;
  case_id: string;
  filename: string;
  mime_type: string;
  extracted_text: string | null;
  size_bytes: number;
  created_at: string;
}

export function createUpload(
  id: string,
  caseId: string,
  filename: string,
  mimeType: string,
  sizeBytes: number,
  extractedText?: string
): Upload {
  const db = getDb();
  db.prepare(
    "INSERT INTO uploads (id, case_id, filename, mime_type, size_bytes, extracted_text) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, caseId, filename, mimeType, sizeBytes, extractedText || null);
  return db.prepare("SELECT * FROM uploads WHERE id = ?").get(id) as Upload;
}

export function getUploadsByCase(caseId: string): Upload[] {
  return getDb()
    .prepare("SELECT * FROM uploads WHERE case_id = ? ORDER BY created_at")
    .all(caseId) as Upload[];
}

// ── Case message operations ──

export interface CaseMessage {
  id: number;
  case_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function createCaseMessage(
  caseId: string,
  role: "user" | "assistant",
  content: string
): CaseMessage {
  const db = getDb();
  const result = db.prepare(
    "INSERT INTO case_messages (case_id, role, content) VALUES (?, ?, ?)"
  ).run(caseId, role, content);
  return db.prepare("SELECT * FROM case_messages WHERE id = ?").get(result.lastInsertRowid) as CaseMessage;
}

export function getMessagesByCase(caseId: string): CaseMessage[] {
  return getDb()
    .prepare("SELECT * FROM case_messages WHERE case_id = ? ORDER BY created_at ASC")
    .all(caseId) as CaseMessage[];
}

// ── Patient case operations ──

export interface PatientCase {
  id: string;
  email: string;
  description: string;
  incident_date: string | null;
  facility: string | null;
  outcome_type: string | null;
  tier: string;
  status: string;
  analysis: string | null;
  score: number | null;
  created_at: string;
}

export function createPatientCase(
  id: string,
  email: string,
  description: string,
  incidentDate?: string,
  facility?: string,
  outcomeType?: string,
  tier?: string
): PatientCase {
  const db = getDb();
  db.prepare(
    "INSERT INTO patient_cases (id, email, description, incident_date, facility, outcome_type, tier) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id, email, description, incidentDate || null, facility || null, outcomeType || null, tier || "quick");
  return db.prepare("SELECT * FROM patient_cases WHERE id = ?").get(id) as PatientCase;
}

export function getPatientCaseById(id: string): PatientCase | undefined {
  return getDb().prepare("SELECT * FROM patient_cases WHERE id = ?").get(id) as PatientCase | undefined;
}

export function updatePatientCaseReport(
  id: string,
  status: string,
  score: number | null,
  analysis: string | null
) {
  getDb()
    .prepare("UPDATE patient_cases SET status = ?, score = ?, analysis = ? WHERE id = ?")
    .run(status, score, analysis, id);
}
