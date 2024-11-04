import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',        // Replace with your PostgreSQL username
  host: 'localhost',            // Database host
  database: 'CROP_DISEASES',    // Database name
  password: 'your-password',    // Replace with your PostgreSQL password
  port: 5432,                   // Default port for PostgreSQL
});

export default pool;
