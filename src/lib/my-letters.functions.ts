import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyLetters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [lettersRes, responsesRes, disputesRes] = await Promise.all([
      supabase
        .from("letters_sent")
        .select(
          "id, bureau_or_furnisher, letter_template_id, tracking_number, sent_at, response_due_at, notes, dispute_id",
        )
        .eq("user_id", userId)
        .order("sent_at", { ascending: false }),
      supabase
        .from("letter_responses")
        .select("id, letter_id, outcome, received_at, notes")
        .eq("user_id", userId)
        .order("received_at", { ascending: false }),
      supabase
        .from("disputes")
        .select("id, status, account_id")
        .eq("user_id", userId),
    ]);

    return {
      letters: lettersRes.data ?? [],
      responses: responsesRes.data ?? [],
      disputes: disputesRes.data ?? [],
    };
  });
