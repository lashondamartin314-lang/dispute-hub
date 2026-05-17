import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AwardSchema = z.object({
  kind: z.enum([
    "letter_sent",
    "response_logged",
    "round_completed",
    "dispute_won",
    "account_resolved",
    "phase_complete",
    "report_imported",
    "score_gain",
  ]),
  points: z.number().int().min(-1000).max(1000),
  description: z.string().max(280).optional(),
  refTable: z.string().max(64).optional(),
  refId: z.string().uuid().optional(),
});

export const awardXp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => AwardSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("xp_events").insert({
      user_id: userId,
      kind: data.kind,
      points: data.points,
      description: data.description ?? null,
      ref_table: data.refTable ?? null,
      ref_id: data.refId ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyXpEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("xp_events")
      .select("id, kind, points, description, created_at, ref_table, ref_id")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
