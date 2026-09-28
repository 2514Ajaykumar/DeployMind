const { db } = require('../db/database');

const createService = (name, repository, environment) => {
  const stmt = db.prepare(`
    INSERT INTO services (name, repository, environment)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(name, repository || null, environment || null);
  return getServiceById(info.lastInsertRowid);
};

const getAllServices = () => {
  return db.prepare('SELECT * FROM services ORDER BY created_at DESC').all();
};

const getServiceById = (id) => {
  return db.prepare('SELECT * FROM services WHERE id = ?').get(id);
};

module.exports = {
  createService,
  getAllServices,
  getServiceById
};
