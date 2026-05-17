import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const UpdateAccountSchema = z.object({
  id: z.string().uuid(),
  action_lane: z.enum(["validate", "furnisher", "specialty", "late_rehab"]).nullable().optional(),
  notes: z.string().max(2000).optional(),
  status: z.string().max(40).optional(),
});

export const updateAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => UpdateAccountSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { id, ...patch } = data;
    const { error } = await supabase.from("accounts").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const LogLetterSchema = z.object({
  bureau_or_furnisher: z.string().min(1).max(120),
  letter_template_id: z.string().max(64).optional(),
  dispute_id: z.string().uuid().optional(),
  account_id: z.string().uuid().optional(),
  tracking_number: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
});

export const logLetterSent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => LogLetterSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // If no dispute exists, create a draft one tied to the account
    let disputeId = data.dispute_id ?? null;
    if (!disputeId && data.account_id) {
      const { data: d, error: dErr } = await supabase
        .from("disputes")
        .insert({ user_id: userId, account_id: data.account_id, status: "sent" })
        .select("id")
        .single();
      if (dErr) throw new Error(dErr.message);
      disputeId = d.id;
    } else if (disputeId) {
      await supabase.from("disputes").update({ status: "sent" }).eq("id", disputeId);
    }

    const dueAt = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString();
    const { data: letter, error } = await supabase
      .from("letters_sent")
      .insert({
        user_id: userId,
        dispute_id: disputeId,
        letter_template_id: data.letter_template_id ?? null,
        bureau_or_furnisher: data.bureau_or_furnisher,
        tracking_number: data.tracking_number ?? null,
        notes: data.notes ?? null,
        response_due_at: dueAt,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await supabase.from("xp_events").insert({
      user_id: userId,
      kind: "letter_sent",
      points: 10,
      description: `Letter sent to ${data.bureau_or_furnisher}`,
      ref_table: "letters_sent",
      ref_id: letter.id,
    });

    return { ok: true, id: letter.id };
  });

const LogResponseSchema = z.object({
  letter_id: z.string().uuid(),
  outcome: z.enum(["deleted", "verified", "updated", "no_response", "other"]),
  notes: z.string().max(2000).optional(),
});

export const logLetterResponse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => LogResponseSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: resp, error } = await supabase
      .from("letter_responses")
      .insert({
        user_id: userId,
        letter_id: data.letter_id,
        outcome: data.outcome,
        notes: data.notes ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    // Update linked dispute status
    const { data: letter } = await supabase
      .from("letters_sent")
      .select("dispute_id")
      .eq("id", data.letter_id)
      .maybeSingle();

    const statusMap: Record<string, string> = {
      deleted: "deleted",
      verified: "verified",
      updated: "updated",
      no_response: "sent",
      other: "responded",
    };
    if (letter?.dispute_id) {
      await supabase.from("disputes").update({ status: statusMap[data.outcome] }).eq("id", letter.dispute_id);
    }

    let points = 25;
    let kind: "response_logged" | "dispute_won" = "response_logged";
    let desc = `Response logged: ${data.outcome}`;
    if (data.outcome === "deleted") {
      points = 100;
      kind = "dispute_won";
      desc = "🏆 Account deleted!";
    }

    await supabase.from("xp_events").insert({
      user_id: userId,
      kind,
      points,
      description: desc,
      ref_table: "letter_responses",
      ref_id: resp.id,
    });

    return { ok: true };
  });
