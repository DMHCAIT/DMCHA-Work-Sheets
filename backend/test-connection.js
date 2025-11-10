const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Testing Supabase Connection...\n');

// Method 1: Using Supabase Client (recommended for Supabase)
async function testSupabaseClient() {
  console.log('--- Method 1: Supabase Client ---');
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log('✅ Supabase client initialized');
    console.log(`   URL: ${process.env.SUPABASE_URL}`);
    
    // Test query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Error querying users table:', error.message);
      console.log('   This is expected if tables don\'t exist yet.');
    } else {
      console.log('✅ Successfully queried database');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Supabase client error:', error.message);
    return false;
  }
}

// Method 2: Using PostgreSQL Connection
async function testPostgresConnection() {
  console.log('\n--- Method 2: Direct PostgreSQL Connection ---');
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });
  
  try {
    console.log('Connecting to PostgreSQL...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Port: ${process.env.DB_PORT}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   User: ${process.env.DB_USER}`);
    
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ PostgreSQL connection successful');
    console.log(`   Server time: ${result.rows[0].current_time}`);
    
    // Check tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`\n📊 Found ${tablesResult.rows.length} tables in public schema:`);
    if (tablesResult.rows.length === 0) {
      console.log('   (No tables found - you need to run schema.sql)');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      
      // Check users table
      try {
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        console.log(`\n👥 Users in database: ${userCount.rows[0].count}`);
      } catch (e) {
        console.log('\n⚠️  Could not query users table');
      }
    }
    
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    await pool.end();
    return false;
  }
}

async function main() {
  const method1 = await testSupabaseClient();
  const method2 = await testPostgresConnection();
  
  console.log('\n' + '='.repeat(50));
  if (method1 || method2) {
    console.log('✅ Connection successful!');
    if (!method1 && method2) {
      console.log('   Note: Using PostgreSQL connection (Method 2)');
    }
  } else {
    console.log('❌ Both connection methods failed');
    console.log('\nPlease verify your credentials in .env file');
  }
}

main();
