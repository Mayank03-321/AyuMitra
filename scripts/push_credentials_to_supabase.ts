import { autoSyncAllCredentialsToSupabase, DEFAULT_CREDENTIALS, getSupabaseClient } from '../src/services/supabaseService.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * CLI utility to push and synchronize all AyuMitra physician & staff login credentials to Supabase.
 */
async function main() {
  console.log('================================================================');
  console.log('  AyuMitra - Supabase Login Credentials Auto-Push Utility       ');
  console.log('================================================================\n');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️  Notice: SUPABASE_URL / SUPABASE_ANON_KEY not set in .env.');
    console.log('   The credentials will be prepared and auto-synced locally in memory/Prisma.');
    console.log('   To push to cloud Supabase directly:');
    console.log('   1. Add SUPABASE_URL & SUPABASE_ANON_KEY to your .env file.');
    console.log('   2. Run `supabase/schema.sql` in your Supabase project SQL Editor.\n');
  } else {
    console.log(`📡 Connecting to Supabase at: ${supabaseUrl}\n`);
  }

  console.log(`⏳ Pushing ${DEFAULT_CREDENTIALS.length} credentials to Supabase...\n`);

  for (const cred of DEFAULT_CREDENTIALS) {
    console.log(`  ➤ [${cred.role}] ${cred.fullName} (${cred.email})`);
  }

  const { syncedCount, results } = await autoSyncAllCredentialsToSupabase();

  console.log('\n================================================================');
  console.log(`✅ Push Completed! Synced: ${syncedCount}/${DEFAULT_CREDENTIALS.length}`);
  console.log('================================================================');

  results.forEach((r) => {
    console.log(`  ${r.success ? '✓' : '✗'} ${r.email}: ${r.success ? 'Stored successfully' : 'Failed'}`);
  });
  console.log('\n');
}

main().catch((err) => {
  console.error('Push error:', err);
  process.exit(1);
});
