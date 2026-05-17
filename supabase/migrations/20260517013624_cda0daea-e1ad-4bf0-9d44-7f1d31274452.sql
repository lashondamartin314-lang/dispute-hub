
-- ===== credit_reports =====
CREATE TABLE public.credit_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  source text NOT NULL CHECK (source IN ('smartcredit_pdf','smartcredit_csv','manual','other')),
  pulled_at timestamptz NOT NULL DEFAULT now(),
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_file_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "credit_reports owner select" ON public.credit_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "credit_reports owner insert" ON public.credit_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "credit_reports owner update" ON public.credit_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "credit_reports owner delete" ON public.credit_reports FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_credit_reports_user ON public.credit_reports(user_id, pulled_at DESC);

-- ===== credit_scores =====
CREATE TABLE public.credit_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  report_id uuid REFERENCES public.credit_reports(id) ON DELETE CASCADE,
  bureau text NOT NULL CHECK (bureau IN ('equifax','experian','transunion')),
  score int NOT NULL CHECK (score BETWEEN 300 AND 900),
  pulled_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "credit_scores owner select" ON public.credit_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "credit_scores owner insert" ON public.credit_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "credit_scores owner update" ON public.credit_scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "credit_scores owner delete" ON public.credit_scores FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_credit_scores_user ON public.credit_scores(user_id, pulled_at DESC);

-- ===== accounts =====
CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  report_id uuid REFERENCES public.credit_reports(id) ON DELETE SET NULL,
  creditor text NOT NULL,
  account_number_masked text,
  type text CHECK (type IN ('credit_card','retail','auto','mortgage','student','personal','collection','other')),
  status text CHECK (status IN ('open','closed','collection','charge_off','bankruptcy','repossession','foreclosure','included_in_bk','late','paid','other')),
  balance numeric,
  credit_limit numeric,
  payment_status text,
  opened_at date,
  closed_at date,
  is_negative boolean NOT NULL DEFAULT false,
  action_lane text CHECK (action_lane IN ('validate','furnisher','specialty','late_rehab')),
  bureaus jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "accounts owner select" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "accounts owner insert" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "accounts owner update" ON public.accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "accounts owner delete" ON public.accounts FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_accounts_user ON public.accounts(user_id);
CREATE TRIGGER trg_accounts_updated_at BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== disputes =====
CREATE TABLE public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
  current_phase int,
  current_round int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'drafting' CHECK (status IN ('drafting','sent','responded','verified','deleted','updated','closed')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "disputes owner select" ON public.disputes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "disputes owner insert" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "disputes owner update" ON public.disputes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "disputes owner delete" ON public.disputes FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_disputes_user ON public.disputes(user_id, updated_at DESC);
CREATE TRIGGER trg_disputes_updated_at BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== letters_sent =====
CREATE TABLE public.letters_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  dispute_id uuid REFERENCES public.disputes(id) ON DELETE SET NULL,
  letter_template_id text,
  bureau_or_furnisher text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  tracking_number text,
  response_due_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.letters_sent ENABLE ROW LEVEL SECURITY;
CREATE POLICY "letters_sent owner select" ON public.letters_sent FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "letters_sent owner insert" ON public.letters_sent FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "letters_sent owner update" ON public.letters_sent FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "letters_sent owner delete" ON public.letters_sent FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_letters_sent_user ON public.letters_sent(user_id, sent_at DESC);

-- ===== letter_responses =====
CREATE TABLE public.letter_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  letter_id uuid REFERENCES public.letters_sent(id) ON DELETE CASCADE,
  received_at timestamptz NOT NULL DEFAULT now(),
  outcome text NOT NULL CHECK (outcome IN ('deleted','verified','updated','no_response','other')),
  notes text,
  attachment_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.letter_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "letter_responses owner select" ON public.letter_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "letter_responses owner insert" ON public.letter_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "letter_responses owner update" ON public.letter_responses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "letter_responses owner delete" ON public.letter_responses FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_letter_responses_user ON public.letter_responses(user_id, received_at DESC);

-- ===== xp_events =====
CREATE TABLE public.xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('letter_sent','response_logged','round_completed','dispute_won','account_resolved','phase_complete','report_imported','score_gain')),
  points int NOT NULL,
  ref_table text,
  ref_id uuid,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xp_events owner select" ON public.xp_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "xp_events owner insert" ON public.xp_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "xp_events owner delete" ON public.xp_events FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_xp_events_user ON public.xp_events(user_id, created_at DESC);

-- ===== storage bucket =====
INSERT INTO storage.buckets (id, name, public) VALUES ('credit-reports', 'credit-reports', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "credit-reports owner read" ON storage.objects FOR SELECT
  USING (bucket_id = 'credit-reports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "credit-reports owner insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'credit-reports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "credit-reports owner update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'credit-reports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "credit-reports owner delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'credit-reports' AND auth.uid()::text = (storage.foldername(name))[1]);
