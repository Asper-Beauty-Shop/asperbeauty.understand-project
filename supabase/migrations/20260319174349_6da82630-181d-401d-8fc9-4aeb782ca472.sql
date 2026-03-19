
CREATE TABLE public.chat_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_message text NOT NULL,
  ai_reply text NOT NULL,
  detected_concern text,
  channel text NOT NULL DEFAULT 'web',
  product_ids uuid[] DEFAULT '{}',
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_transcripts_concern ON public.chat_transcripts (detected_concern) WHERE detected_concern IS NOT NULL;
CREATE INDEX idx_chat_transcripts_created ON public.chat_transcripts (created_at DESC);

ALTER TABLE public.chat_transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert transcripts"
  ON public.chat_transcripts FOR INSERT
  TO public
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can read transcripts"
  ON public.chat_transcripts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
