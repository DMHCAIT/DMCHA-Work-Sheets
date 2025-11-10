const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║   DMHCA WORKSHEETS - SYSTEM STATUS CHECK                ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

async function checkSystem() {
  let allGood = true;

  // 1. Check Environment Variables
  console.log('📋 CHECKING CONFIGURATION...\n');
  
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
  ];

  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}`);
    } else {
      console.log(`   ❌ ${varName} - MISSING`);
      allGood = false;
    }
  });

  console.log(`\n📡 TESTING SUPABASE CONNECTION...\n`);
  
  // 2. Test Supabase Connection
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    console.log(`   ✅ Supabase client initialized`);
    console.log(`   📍 URL: ${process.env.SUPABASE_URL}`);

    // 3. Check if tables exist
    console.log(`\n📊 CHECKING DATABASE TABLES...\n`);

    const expectedTables = [
      'roles',
      'departments', 
      'users',
      'worksheets',
      'worksheet_assignments',
      'worksheet_attachments',
      'reports',
      'report_attachments',
      'audit_logs'
    ];

    let tablesExist = 0;
    const missingTables = [];

    for (const table of expectedTables) {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        if (error.message.includes('Could not find')) {
          console.log(`   ❌ ${table} - NOT FOUND`);
          missingTables.push(table);
          allGood = false;
        } else {
          console.log(`   ⚠️  ${table} - ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${table}`);
        tablesExist++;
      }
    }

    // 4. Check users table specifically
    if (tablesExist > 0) {
      console.log(`\n👥 CHECKING USERS...\n`);
      
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, username, first_name, last_name')
        .limit(5);

      if (!usersError && users && users.length > 0) {
        console.log(`   ✅ Found ${users.length} users (showing first 5):`);
        users.forEach(user => {
          console.log(`      • ${user.username} (${user.first_name} ${user.last_name})`);
        });
      } else {
        console.log(`   ⚠️  No users found or error: ${usersError?.message}`);
      }
    }

    // 5. Final Status
    console.log('\n' + '═'.repeat(60));
    
    if (allGood && tablesExist === expectedTables.length) {
      console.log('\n✅ SYSTEM STATUS: READY TO USE!\n');
      console.log('🎉 Everything is configured correctly!');
      console.log('\n🚀 NEXT STEPS:');
      console.log('   1. Start backend: cd backend && npm start');
      console.log('   2. Start frontend: cd frontend && npm run dev');
      console.log('   3. Open browser: http://localhost:3000');
      console.log('\n🔐 LOGIN CREDENTIALS:');
      console.log('   Username: admin');
      console.log('   Password: password123');
      console.log('\n' + '═'.repeat(60));
    } else if (missingTables.length > 0) {
      console.log('\n⚠️  SYSTEM STATUS: DATABASE SETUP REQUIRED\n');
      console.log('❌ Missing tables detected!');
      console.log('\n📝 ACTION REQUIRED:');
      console.log('   1. Open Supabase SQL Editor:');
      console.log('      https://supabase.com/dashboard/project/hnymialotvmtzyeignex/sql');
      console.log('\n   2. Copy and run this file:');
      console.log('      D:\\Users\\Admin\\Desktop\\DMHCA Work Sheets\\SUPABASE_COMPLETE_SETUP.sql');
      console.log('\n   3. Wait for completion (you should see success messages)');
      console.log('\n   4. Run this check again: node check-system.js');
      console.log('\n' + '═'.repeat(60));
    } else {
      console.log('\n❌ SYSTEM STATUS: CONFIGURATION ERROR\n');
      console.log('Please check the .env file configuration');
      console.log('\n' + '═'.repeat(60));
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n' + '═'.repeat(60));
  }
}

checkSystem();
