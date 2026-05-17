import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getDashboardSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [
      latestReportRes,
      scoresRes,
      accountsRes,
      disputesRes,
      lettersRes,
      responsesRes,
      xpRes,
      activityRes,
      badgesRes,
    ] = await Promise.all([
      supabase
        .from("credit_reports")
        .select("id, source, pulled_at, summary, raw_file_path")
        .eq("user_id", userId)
        .order("pulled_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("credit_scores")
        .select("bureau, score, pulled_at")
        .eq("user_id", userId)
        .order("pulled_at", { ascending: true }),
      supabase
        .from("accounts")
        .select("id, creditor, type, status, balance, credit_limit, is_negative, action_lane, account_number_masked, payment_status")
        .eq("user_id", userId),
      supabase
        .from("disputes")
        .select("id, status, current_phase, current_round, account_id, updated_at"),
      supabase
        .from("letters_sent")
        .select("id, bureau_or_furnisher, sent_at, response_due_at, dispute_id")
        .order("sent_at", { ascending: false })
        .limit(100),
      supabase
        .from("letter_responses")
        .select("id, outcome, received_at, letter_id")
        .order("received_at", { ascending: false })
        .limit(100),
      supabase.from("xp_events").select("points"),
      supabase
        .from("xp_events")
        .select("id, kind, points, description, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("phase_badges")
        .select("phase_id, phase_number, phase_name, earned_at")
        .order("phase_number", { ascending: true }),
    ]);

    const scores = scoresRes.data ?? [];
    // Per-bureau starting + current
    const byBureau: Record<string, { starting: number | null; current: number | null; history: { score: number; date: string }[] }> = {
      equifax: { starting: null, current: null, history: [] },
      experian: { starting: null, current: null, history: [] },
      transunion: { starting: null, current: null, history: [] },
    };
    for (const s of scores) {
      const b = s.bureau as keyof typeof byBureau;
      if (!byBureau[b]) continue;
      byBureau[b].history.push({ score: s.score, date: s.pulled_at });
      if (byBureau[b].starting === null) byBureau[b].starting = s.score;
      byBureau[b].current = s.score;
    }

    const totalXp = (xpRes.data ?? []).reduce((sum, e) => sum + (e.points ?? 0), 0);
    const level = Math.floor(Math.sqrt(Math.max(0, totalXp) / 50));
    const xpForNext = 50 * (level + 1) * (level + 1);
    const xpForCurrent = 50 * level * level;

    const accounts = accountsRes.data ?? [];
    const negatives = accounts.filter((a) => a.is_negative);
    const positives = accounts.filter((a) => !a.is_negative);

    const disputes = disputesRes.data ?? [];
    const kanban = {
      drafting: disputes.filter((d) => d.status === "drafting").length,
      sent: disputes.filter((d) => d.status === "sent").length,
      responded: disputes.filter((d) => d.status === "responded").length,
      verified: disputes.filter((d) => d.status === "verified").length,
      deleted: disputes.filter((d) => d.status === "deleted").length,
      updated: disputes.filter((d) => d.status === "updated").length,
    };

    return {
      latestReport: latestReportRes.data ?? null,
      scores: byBureau,
      accounts: {
        all: accounts,
        negatives,
        positives,
        totalCount: accounts.length,
        derogatoryCount: negatives.length,
      },
      disputes,
      kanban,
      letters: lettersRes.data ?? [],
      responses: responsesRes.data ?? [],
      xp: {
        total: totalXp,
        level,
        xpForCurrent,
        xpForNext,
        pctToNext: xpForNext === xpForCurrent ? 0 : Math.round(((totalXp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100),
      },
      activity: activityRes.data ?? [],
      badges: badgesRes.data ?? [],
    };
  });
