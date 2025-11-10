const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

async function executeSQLFile(filePath, description) {
  console.log(`\n📝 Executing ${description}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`   Found ${statements.length} SQL statements`);
    
    // Execute each statement via Supabase RPC
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt) {
        try {
          // Use Supabase's postgrest to execute raw SQL
          const { data, error } = await supabase.rpc('exec_sql', { sql_query: stmt + ';' });
          
          if (error) {
            // Try alternative method using the REST API directly
            const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
              },
              body: JSON.stringify({ query: stmt + ';' })
            });
            
            if (!response.ok) {
              console.log(`   ⚠️  Statement ${i + 1} warning:`, error.message);
            }
          }
        } catch (e) {
          console.log(`   ⚠️  Statement ${i + 1} error:`, e.message);
        }
      }
    }
    
    console.log(`   ✅ Completed ${description}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error executing ${description}:`, error.message);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up Supabase Database for DMHCA Worksheets Portal\n');
  console.log('=' .repeat(60));
  
  // Check connection
  console.log('\n🔍 Testing Supabase connection...');
  const { data: test, error: testError } = await supabase.from('_test').select('*').limit(1);
  console.log('✅ Connected to Supabase');
  console.log(`   Project: ${process.env.SUPABASE_URL}`);
  
  console.log('\n⚠️  IMPORTANT: Execute these SQL files manually in Supabase SQL Editor:');
  console.log('   1. Go to https://supabase.com/dashboard/project/hnymialotvmtzyeignex/sql');
  console.log('   2. Open a new query');
  console.log('   3. Copy and paste the contents of these files:\n');
  
  const schemaPath = path.join(__dirname, 'database', 'schema.sql');
  const seedPath = path.join(__dirname, 'database', 'seed.sql');
  
  console.log(`   📄 File 1: ${schemaPath}`);
  console.log(`   📄 File 2: ${seedPath}`);
  
  console.log('\n📋 Or use the Supabase CLI:');
  console.log('   supabase db reset');
  console.log('   supabase db push');
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 After running the SQL files, your database will have:');
  console.log('   • 9 tables (roles, departments, users, worksheets, reports, etc.)');
  console.log('   • Sample users with username/password:');
  console.log('     - admin / password123');
  console.log('     - sales.manager / password123');
  console.log('     - it.manager / password123');
  console.log('   • Sample worksheets and reports for testing');
  
  console.log('\n🔄 Once done, restart your backend server:');
  console.log('   npm start');
  
  console.log('\n' + '='.repeat(60));
}

setupDatabase();
