const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  console.log('🔍 Checking Supabase connection...');
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to Supabase PostgreSQL');
    
    // Check if tables exist
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'roles', 'departments', 'locations', 'projects', 'worksheets', 'reports', 'report_sections', 'activities')
    `);
    
    console.log(`\n📊 Found ${tablesCheck.rows.length} tables:`);
    tablesCheck.rows.forEach(row => console.log(`   - ${row.table_name}`));
    
    if (tablesCheck.rows.length === 0) {
      console.log('\n⚠️  No tables found. You need to run the schema.sql and seed.sql files.');
      console.log('   Run these files in your Supabase SQL Editor:');
      console.log('   1. backend/database/schema.sql');
      console.log('   2. backend/database/seed.sql');
    } else if (tablesCheck.rows.length < 9) {
      console.log('\n⚠️  Some tables are missing. Expected 9 tables.');
    } else {
      console.log('\n✅ All tables exist!');
      
      // Check if users exist
      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`\n👥 Users in database: ${userCount.rows[0].count}`);
      
      if (parseInt(userCount.rows[0].count) === 0) {
        console.log('⚠️  No users found. Run backend/database/seed.sql to populate data.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();
