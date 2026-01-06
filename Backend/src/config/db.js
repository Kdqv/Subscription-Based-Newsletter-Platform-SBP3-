import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// TEST CONNEXION
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection error', err.message);
  } else {
    console.log('DB connected at', res.rows[0].now);
  }
});

export default pool;
