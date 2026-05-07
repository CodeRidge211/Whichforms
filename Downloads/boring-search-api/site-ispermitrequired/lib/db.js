// IsPermitRequired — Database Connection
// Sovereign Ridge Partners LLC

const { Pool } = require('pg');

// Database configuration from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Permit requirement data cache
let permitCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 3600000; // 1 hour

// Initialize database schema
async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS permit_requirements (
        id SERIAL PRIMARY KEY,
        location VARCHAR(255) NOT NULL,
        location_type VARCHAR(50) NOT NULL,
        project_type VARCHAR(255) NOT NULL,
        requires_permit BOOLEAN NOT NULL,
        requirements TEXT,
        exceptions TEXT,
        estimated_cost_range VARCHAR(100),
        processing_time VARCHAR(100),
        application_url VARCHAR(500),
        source VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(location, project_type)
      );
      
      CREATE INDEX IF NOT EXISTS idx_permit_location ON permit_requirements(location);
      CREATE INDEX IF NOT EXISTS idx_permit_project ON permit_requirements(project_type);
    `);
    console.log('Database initialized successfully');
  } finally {
    client.release();
  }
}

// Get permit requirements
async function getPermitRequirements(location, projectType) {
  // Try cache first
  if (permitCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return permitCache.filter(p => 
      p.location.toLowerCase().includes(location.toLowerCase()) &&
      p.project_type.toLowerCase().includes(projectType.toLowerCase())
    );
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM permit_requirements 
       WHERE LOWER(location) LIKE LOWER($1) 
       AND LOWER(project_type) LIKE LOWER($2)
       ORDER BY location`,
      [`%${location}%`, `%${projectType}%`]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Get all locations
async function getLocations() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT DISTINCT location FROM permit_requirements ORDER BY location`
    );
    return result.rows.map(r => r.location);
  } finally {
    client.release();
  }
}

// Search permits
async function searchPermits(query) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM permit_requirements 
       WHERE LOWER(location) LIKE LOWER($1) 
       OR LOWER(project_type) LIKE LOWER($1)
       OR LOWER(requirements) LIKE LOWER($1)
       ORDER BY location, project_type
       LIMIT 50`,
      [`%${query}%`]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  initDb,
  getPermitRequirements,
  getLocations,
  searchPermits
};