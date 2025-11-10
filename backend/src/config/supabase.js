const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Test connection
(async () => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error && !error.message.includes('Could not find')) {
      logger.error('Supabase connection error:', error);
    } else {
      logger.info('✅ Supabase client initialized');
    }
  } catch (e) {
    logger.error('Supabase initialization error:', e.message);
  }
})();

module.exports = {
  supabase
};
