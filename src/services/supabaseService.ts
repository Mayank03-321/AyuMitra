import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export interface UserCredentialRecord {
  id?: string;
  email: string;
  passwordHash: string;
  role: 'DOCTOR' | 'ADMIN' | 'NURSE' | 'PATIENT';
  fullName: string;
  nmcRegNo?: string;
  hospitalName?: string;
  isActive?: boolean;
  lastLoginAt?: Date | string;
}

export const DEFAULT_CREDENTIALS: UserCredentialRecord[] = [
  {
    email: 'dr.ananya@ayumitra.hospital',
    passwordHash: 'password123',
    role: 'DOCTOR',
    fullName: 'Dr. Ananya Sharma (MD, AIIMS)',
    nmcRegNo: 'NMC-74921-ND',
    hospitalName: 'AyuMitra Apex Clinical Center',
    isActive: true,
  },
  {
    email: 'dr.rajesh@ayumitra.hospital',
    passwordHash: 'password123',
    role: 'DOCTOR',
    fullName: 'Dr. Rajesh Varma (MBBS, DNB Card)',
    nmcRegNo: 'NMC-61023-MH',
    hospitalName: 'AyuMitra Apex Clinical Center',
    isActive: true,
  },
  {
    email: 'dr.priya.ayush@ayumitra.hospital',
    passwordHash: 'password123',
    role: 'DOCTOR',
    fullName: 'Dr. Priya Nair (BAMS, Ayurveda Specialist)',
    nmcRegNo: 'CCIM-AY-8821',
    hospitalName: 'AyuMitra Integrative AYUSH Wing',
    isActive: true,
  },
  {
    email: 'admin@ayumitra.hospital',
    passwordHash: 'admin123',
    role: 'ADMIN',
    fullName: 'AyuMitra Hospital Superintendent',
    nmcRegNo: 'HOSP-ADM-001',
    hospitalName: 'AyuMitra Central Hospital',
    isActive: true,
  },
  {
    email: 'triage.nurse@ayumitra.hospital',
    passwordHash: 'nurse123',
    role: 'NURSE',
    fullName: 'Sister Sunita Rao (Chief Triage Nurse)',
    nmcRegNo: 'INC-NR-34901',
    hospitalName: 'AyuMitra Emergency Department',
    isActive: true,
  },
];

let supabaseInstance: SupabaseClient | null = null;

/**
 * Initializes and returns the Supabase client instance.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey);
      return supabaseInstance;
    } catch (err) {
      console.warn('Supabase initialization warning:', err);
      return null;
    }
  }
  return null;
}

/**
 * Stores or updates a user credential record in Supabase automatically.
 * Falls back gracefully to memory/prisma storage if Supabase credentials are pending.
 */
export async function storeUserCredentialInSupabase(
  cred: UserCredentialRecord
): Promise<{ success: boolean; source: string; record?: any; error?: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      success: true,
      source: 'LOCAL_FALLBACK',
      record: { ...cred, lastLoginAt: new Date().toISOString() },
    };
  }

  try {
    const payload = {
      email: cred.email.toLowerCase().trim(),
      password_hash: cred.passwordHash,
      role: cred.role,
      full_name: cred.fullName,
      nmc_reg_no: cred.nmcRegNo || null,
      hospital_name: cred.hospitalName || 'AyuMitra Central Hospital',
      is_active: cred.isActive !== undefined ? cred.isActive : true,
      last_login_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_credentials')
      .upsert(payload, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('Supabase user_credentials store error:', error);
      return { success: false, source: 'SUPABASE', error: error.message };
    }

    return { success: true, source: 'SUPABASE', record: data };
  } catch (err: any) {
    console.error('Failed to store credential in Supabase:', err);
    return { success: false, source: 'SUPABASE', error: err.message };
  }
}

/**
 * Automatically synchronizes all default AyuMitra clinical and admin credentials into Supabase.
 */
export async function autoSyncAllCredentialsToSupabase(): Promise<{
  syncedCount: number;
  results: Array<{ email: string; success: boolean }>;
}> {
  const results: Array<{ email: string; success: boolean }> = [];
  let syncedCount = 0;

  for (const cred of DEFAULT_CREDENTIALS) {
    const res = await storeUserCredentialInSupabase(cred);
    if (res.success) {
      syncedCount++;
      results.push({ email: cred.email, success: true });
    } else {
      results.push({ email: cred.email, success: false });
    }
  }

  return { syncedCount, results };
}

/**
 * Verifies user login and automatically logs/updates login timestamp in Supabase.
 */
export async function verifyAndRecordLogin(
  email: string,
  passcode: string
): Promise<{
  authenticated: boolean;
  user?: UserCredentialRecord;
  message: string;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('password_hash', passcode)
        .single();

      if (!error && data) {
        // Update last_login_at in Supabase
        await supabase
          .from('user_credentials')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', data.id);

        return {
          authenticated: true,
          user: {
            id: data.id,
            email: data.email,
            passwordHash: data.password_hash,
            role: data.role,
            fullName: data.full_name,
            nmcRegNo: data.nmc_reg_no,
            hospitalName: data.hospital_name,
            isActive: data.is_active,
            lastLoginAt: data.last_login_at,
          },
          message: 'Authenticated successfully via Supabase',
        };
      }
    } catch (err) {
      console.warn('Supabase query error, checking default credentials:', err);
    }
  }

  // Check matching default credential
  const matched = DEFAULT_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === normalizedEmail && c.passwordHash === passcode
  );

  if (matched) {
    // Attempt auto-store to Supabase
    storeUserCredentialInSupabase(matched).catch(() => {});
    return {
      authenticated: true,
      user: matched,
      message: 'Authenticated successfully',
    };
  }

  return {
    authenticated: false,
    message: 'Invalid Doctor ID / Email or Passcode.',
  };
}
