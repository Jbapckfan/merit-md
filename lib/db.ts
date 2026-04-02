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

    CREATE TABLE IF NOT EXISTS intake_submissions (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      state TEXT NOT NULL,
      incident_date TEXT,
      concern_type TEXT NOT NULL,
      description TEXT NOT NULL,
      submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'closed'))
    );

    CREATE INDEX IF NOT EXISTS idx_intake_submissions_email ON intake_submissions(email);
    CREATE INDEX IF NOT EXISTS idx_intake_submissions_status ON intake_submissions(status);

    CREATE TABLE IF NOT EXISTS chart_reviews (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      chief_complaint TEXT,
      facility_type TEXT,
      chart_text TEXT NOT NULL,
      review_result TEXT,
      overall_grade TEXT,
      risk_flags_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_chart_reviews_user ON chart_reviews(user_id);
    CREATE INDEX IF NOT EXISTS idx_chart_reviews_created ON chart_reviews(created_at);
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

// ── Intake submission operations ──

export interface IntakeSubmission {
  id: string;
  first_name: string;
  email: string;
  phone: string | null;
  state: string;
  incident_date: string | null;
  concern_type: string;
  description: string;
  submitted_at: string;
  status: "new" | "contacted" | "closed";
}

export function createIntakeSubmission(
  id: string,
  firstName: string,
  email: string,
  phone: string | null,
  state: string,
  incidentDate: string | null,
  concernType: string,
  description: string
): IntakeSubmission {
  const db = getDb();
  db.prepare(
    "INSERT INTO intake_submissions (id, first_name, email, phone, state, incident_date, concern_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(id, firstName, email, phone, state, incidentDate, concernType, description);
  return db.prepare("SELECT * FROM intake_submissions WHERE id = ?").get(id) as IntakeSubmission;
}

export function getIntakeSubmissionById(id: string): IntakeSubmission | undefined {
  return getDb().prepare("SELECT * FROM intake_submissions WHERE id = ?").get(id) as IntakeSubmission | undefined;
}

export function updateIntakeSubmissionStatus(id: string, status: "new" | "contacted" | "closed") {
  getDb()
    .prepare("UPDATE intake_submissions SET status = ? WHERE id = ?")
    .run(status, id);
}
