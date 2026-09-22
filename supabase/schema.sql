-- ==============================================================================
-- AyuMitra Supabase Automated User Credentials Schema & Queries
-- ==============================================================================

-- 1. Create table for storing user & physician login credentials in Supabase
CREATE TABLE IF NOT EXISTS public.user_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'DOCTOR', -- 'DOCTOR', 'ADMIN', 'NURSE', 'PATIENT'
    full_name TEXT NOT NULL,
    nmc_reg_no TEXT,
    hospital_name TEXT DEFAULT 'AyuMitra Central Hospital',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create index on email and role for fast authentication queries
CREATE INDEX IF NOT EXISTS idx_user_credentials_email ON public.user_credentials(email);
CREATE INDEX IF NOT EXISTS idx_user_credentials_role ON public.user_credentials(role);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Supabase (Allow read/write for service role & authenticated users)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_credentials' AND policyname = 'Allow public read for auth verification'
    ) THEN
        CREATE POLICY "Allow public read for auth verification" 
            ON public.user_credentials FOR SELECT 
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_credentials' AND policyname = 'Allow insert/update for credentials'
    ) THEN
        CREATE POLICY "Allow insert/update for credentials" 
            ON public.user_credentials FOR ALL 
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- 5. Trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_credentials_updated_at ON public.user_credentials;
CREATE TRIGGER trigger_user_credentials_updated_at
    BEFORE UPDATE ON public.user_credentials
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 6. Automatically Upsert All Initial & Demo Physician / Admin Credentials into Supabase
INSERT INTO public.user_credentials (email, password_hash, role, full_name, nmc_reg_no, hospital_name, is_active, last_login_at)
VALUES 
    (
        'dr.ananya@ayumitra.hospital',
        'password123',
        'DOCTOR',
        'Dr. Ananya Sharma (MD, AIIMS)',
        'NMC-74921-ND',
        'AyuMitra Apex Clinical Center',
        true,
        NOW()
    ),
    (
        'dr.rajesh@ayumitra.hospital',
        'password123',
        'DOCTOR',
        'Dr. Rajesh Varma (MBBS, DNB Card)',
        'NMC-61023-MH',
        'AyuMitra Apex Clinical Center',
        true,
        NOW()
    ),
    (
        'dr.priya.ayush@ayumitra.hospital',
        'password123',
        'DOCTOR',
        'Dr. Priya Nair (BAMS, Ayurveda Specialist)',
        'CCIM-AY-8821',
        'AyuMitra Integrative AYUSH Wing',
        true,
        NOW()
    ),
    (
        'admin@ayumitra.hospital',
        'admin123',
        'ADMIN',
        'AyuMitra Hospital Superintendent',
        'HOSP-ADM-001',
        'AyuMitra Central Hospital',
        true,
        NOW()
    ),
    (
        'triage.nurse@ayumitra.hospital',
        'nurse123',
        'NURSE',
        'Sister Sunita Rao (Chief Triage Nurse)',
        'INC-NR-34901',
        'AyuMitra Emergency Department',
        true,
        NOW()
    )
ON CONFLICT (email) 
DO UPDATE SET 
    password_hash = EXCLUDED.password_hash,
    full_name = EXCLUDED.full_name,
    nmc_reg_no = EXCLUDED.nmc_reg_no,
    hospital_name = EXCLUDED.hospital_name,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
