import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://dushyant.bansal:@localhost:5432/munshi'
});

export default pool;