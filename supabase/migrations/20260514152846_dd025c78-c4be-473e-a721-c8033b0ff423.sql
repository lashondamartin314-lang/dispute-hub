CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can submit a question.
CREATE POLICY "Anyone can submit a question"
  ON public.questions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND char_length(topic) BETWEEN 1 AND 120
    AND char_length(question) BETWEEN 10 AND 4000
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- Authenticated users can view their own submissions.
CREATE POLICY "Users view own questions"
  ON public.questions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_questions_created_at ON public.questions (created_at DESC);
CREATE INDEX idx_questions_user_id ON public.questions (user_id);