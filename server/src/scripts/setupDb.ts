import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function setupDatabase() {
    try {
        // Read SQL file
        const sqlPath = path.join(__dirname, '../db/init.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Execute SQL
        await pool.query(sqlContent);
        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await pool.end();
    }
}

// Run setup if this script is executed directly
if (require.main === module) {
    setupDatabase();
}