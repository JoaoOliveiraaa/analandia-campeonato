-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referee_assignments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Championships policies (everyone can view, only organizers/admins can create)
CREATE POLICY "Championships are viewable by everyone"
  ON public.championships FOR SELECT
  USING (true);

CREATE POLICY "Organizers and admins can create championships"
  ON public.championships FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

CREATE POLICY "Organizers and admins can update championships"
  ON public.championships FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

-- Teams policies
CREATE POLICY "Teams are viewable by everyone"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Coaches can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coach', 'athlete', 'organizer', 'admin')
    )
  );

CREATE POLICY "Coaches can update their own teams"
  ON public.teams FOR UPDATE
  USING (
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

-- Team members policies
CREATE POLICY "Team members are viewable by everyone"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Coaches can add team members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND (coach_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('organizer', 'admin'))
      )
    )
  );

CREATE POLICY "Coaches can update team members"
  ON public.team_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND (coach_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('organizer', 'admin'))
      )
    )
  );

CREATE POLICY "Coaches can delete team members"
  ON public.team_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND (coach_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('organizer', 'admin'))
      )
    )
  );

-- Matches policies
CREATE POLICY "Matches are viewable by everyone"
  ON public.matches FOR SELECT
  USING (true);

CREATE POLICY "Organizers and admins can manage matches"
  ON public.matches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

-- Match events policies
CREATE POLICY "Match events are viewable by everyone"
  ON public.match_events FOR SELECT
  USING (true);

CREATE POLICY "Referees and admins can add match events"
  ON public.match_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('referee', 'organizer', 'admin')
    )
  );

-- News policies
CREATE POLICY "Published news are viewable by everyone"
  ON public.news FOR SELECT
  USING (published = true OR author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

CREATE POLICY "Organizers and admins can create news"
  ON public.news FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

CREATE POLICY "Authors can update their own news"
  ON public.news FOR UPDATE
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

-- Referee assignments policies
CREATE POLICY "Referee assignments are viewable by everyone"
  ON public.referee_assignments FOR SELECT
  USING (true);

CREATE POLICY "Organizers can manage referee assignments"
  ON public.referee_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );
