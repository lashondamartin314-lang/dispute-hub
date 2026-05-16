import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AwardSchema = z.object({
  phaseId: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  phaseNumber: z.number().int().min(1).max(20),
  phaseName: z.string().min(1).max(120),
});

export const awardPhaseBadge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => AwardSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Idempotent: unique (user_id, phase_id) prevents duplicates.
    const { data: row, error } = await supabase
      .from("phase_badges")
      .upsert(
        {
          user_id: userId,
          phase_id: data.phaseId,
          phase_number: data.phaseNumber,
          phase_name: data.phaseName,
        },
        { onConflict: "user_id,phase_id", ignoreDuplicates: true },
      )
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { ok: true, badge: row };
  });

export const getMyBadges = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("phase_badges")
      .select("phase_id, phase_number, phase_name, earned_at")
      .order("phase_number", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, created_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });
