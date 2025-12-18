-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  cpf TEXT UNIQUE,
  phone TEXT,
  date_of_birth DATE,
  role TEXT CHECK (role IN ('athlete', 'coach', 'organizer', 'referee', 'admin')) DEFAULT 'athlete',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create championships table
CREATE TABLE IF NOT EXISTS public.championships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sport TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  registration_start DATE NOT NULL,
  registration_end DATE NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'registration_open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'upcoming',
  max_teams INTEGER,
  format TEXT, -- knockout, round_robin, groups
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  coach_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  championship_id UUID REFERENCES public.championships(id) ON DELETE CASCADE,
  registration_status TEXT CHECK (registration_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, championship_id)
);

-- Create team_members table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  jersey_number INTEGER,
  position TEXT,
  is_captain BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, athlete_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  championship_id UUID REFERENCES public.championships(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  match_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  round TEXT, -- quarterfinal, semifinal, final, etc
  home_score INTEGER,
  away_score INTEGER,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled')) DEFAULT 'scheduled',
  referee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create match_events table (goals, cards, etc)
CREATE TABLE IF NOT EXISTS public.match_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('goal', 'yellow_card', 'red_card', 'substitution')) NOT NULL,
  minute INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  championship_id UUID REFERENCES public.championships(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create referee_assignments table
CREATE TABLE IF NOT EXISTS public.referee_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  championship_id UUID REFERENCES public.championships(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('available', 'assigned', 'unavailable')) DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referee_id, championship_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_championship ON public.teams(championship_id);
CREATE INDEX IF NOT EXISTS idx_matches_championship ON public.matches(championship_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(match_date);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_athlete ON public.team_members(athlete_id);
CREATE INDEX IF NOT EXISTS idx_match_events_match ON public.match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_news_championship ON public.news(championship_id);
