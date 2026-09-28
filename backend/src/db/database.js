const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'deploymind.db');
const db = new Database(dbPath);

// Enable foreign key enforcement
db.pragma('foreign_keys = ON');

// Initialize database tables
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      repository TEXT,
      environment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS deployments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER NOT NULL,
      version TEXT NOT NULL,
      commit_hash TEXT,
      environment TEXT NOT NULL,
      status TEXT NOT NULL,
      duration INTEGER,
      changes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services(id)
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deployment_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      error TEXT,
      root_cause TEXT,
      resolution TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (deployment_id) REFERENCES deployments(id)
    );

    CREATE TABLE IF NOT EXISTS infrastructure_changes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deployment_id INTEGER NOT NULL,
      component TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (deployment_id) REFERENCES deployments(id)
    );

    CREATE TABLE IF NOT EXISTS deployment_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deployment_id INTEGER NOT NULL,
      outcome TEXT NOT NULL,
      feedback TEXT,
      actual_issue TEXT,
      actual_root_cause TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (deployment_id) REFERENCES deployments(id)
    );
  `);
  
  try {
    db.prepare('ALTER TABLE deployments ADD COLUMN risk_analysis TEXT').run();
  } catch (e) {}
  console.log('Database initialized successfully with all required tables.');
}

module.exports = {
  db,
  initializeDatabase
};
