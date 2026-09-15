-- ==============================================================================
-- SkillBridge / EduBridge AI - Supabase Database Schema
-- Run this complete script in the Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. User Profiles Table (Mirrors Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'college_admin', 'company', 'super_admin')),
    avatar TEXT,
    organization TEXT,
    department TEXT,
    college TEXT,
    phone TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Opportunities / Internships / Jobs Table
CREATE TABLE IF NOT EXISTS public.opportunities (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_logo TEXT,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Internship' CHECK (type IN ('Internship', 'Job', 'Project')),
    department TEXT,
    location TEXT,
    work_mode TEXT DEFAULT 'Remote' CHECK (work_mode IN ('Remote', 'Hybrid', 'Onsite', 'In-Person')),
    stipend_or_salary TEXT,
    deadline TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Closed', 'Paused')),
    description TEXT,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    required_skills JSONB DEFAULT '[]'::jsonb,
    preferred_skills JSONB DEFAULT '[]'::jsonb,
    qualifications JSONB DEFAULT '[]'::jsonb,
    applicant_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Student Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    opportunity_id TEXT NOT NULL,
    job_title TEXT NOT NULL,
    company_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected', 'Hired')),
    match_score INTEGER DEFAULT 85,
    custom_pitch TEXT,
    notes TEXT,
    interview_date TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Student Detailed Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT,
    college TEXT,
    degree TEXT,
    batch TEXT,
    cgpa NUMERIC(4, 2),
    headline TEXT,
    bio TEXT,
    phone TEXT,
    location TEXT,
    industry_readiness_score INTEGER DEFAULT 0,
    ai_skill_score INTEGER DEFAULT 0,
    skills JSONB DEFAULT '[]'::jsonb,
    educations JSONB DEFAULT '[]'::jsonb,
    experiences JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Skill Assessments & Badges Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    badge TEXT,
    passed BOOLEAN DEFAULT TRUE,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Industry Mentorship Programs Table
CREATE TABLE IF NOT EXISTS public.mentorship_programs (
    id TEXT PRIMARY KEY,
    program_title TEXT NOT NULL,
    mentor_name TEXT NOT NULL,
    mentor_role TEXT,
    mentor_avatar TEXT,
    domain TEXT,
    description TEXT,
    skills_covered JSONB DEFAULT '[]'::jsonb,
    duration TEXT,
    max_mentees INTEGER DEFAULT 20,
    enrolled_count INTEGER DEFAULT 0,
    deadline TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Open', 'Completed', 'Closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Workshops Table
CREATE TABLE IF NOT EXISTS public.workshops (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    trainer TEXT NOT NULL,
    trainer_role TEXT,
    domain TEXT,
    description TEXT,
    date TEXT,
    time TEXT,
    duration TEXT,
    mode TEXT DEFAULT 'Online' CHECK (mode IN ('Online', 'Offline', 'Hybrid')),
    skills_covered JSONB DEFAULT '[]'::jsonb,
    max_participants INTEGER DEFAULT 250,
    registered_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Completed', 'Cancelled', 'Registration Closed')),
    venue_or_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. Automatic Profile Creation Trigger on Auth Sign-Up
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, avatar)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        COALESCE(new.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing on auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 10. Row Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- Permissive policies for read access (anyone can view public listings)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Opportunities are viewable by everyone" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Anyone can insert opportunities" ON public.opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update opportunities" ON public.opportunities FOR UPDATE USING (true);

CREATE POLICY "Applications viewable by involved parties" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Anyone can submit applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update applications" ON public.applications FOR UPDATE USING (true);

CREATE POLICY "Student profiles are viewable by everyone" ON public.student_profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert student profile" ON public.student_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update student profile" ON public.student_profiles FOR UPDATE USING (true);

CREATE POLICY "Assessments are viewable by everyone" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert assessments" ON public.assessments FOR INSERT WITH CHECK (true);

CREATE POLICY "Mentorship programs are viewable by everyone" ON public.mentorship_programs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert mentorship programs" ON public.mentorship_programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update mentorship programs" ON public.mentorship_programs FOR UPDATE USING (true);

CREATE POLICY "Workshops are viewable by everyone" ON public.workshops FOR SELECT USING (true);
CREATE POLICY "Anyone can insert workshops" ON public.workshops FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update workshops" ON public.workshops FOR UPDATE USING (true);
