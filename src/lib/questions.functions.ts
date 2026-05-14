import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const QuestionSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  topic: z.string().trim().min(1, "Pick a topic").max(120),
  question: z
    .string()
    .trim()
    .min(10, "Give Shonda a little more detail (10+ characters)")
    .max(4000, "Please keep it under 4,000 characters"),
});

export type QuestionInput = z.infer<typeof QuestionSchema>;

export const submitQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => QuestionSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("questions").insert({
      name: data.name,
      email: data.email,
      topic: data.topic,
      question: data.question,
    });
    if (error) {
      console.error("submitQuestion insert failed:", error);
      return { ok: false as const, error: "Could not save your question. Please try again." };
    }
    return { ok: true as const };
  });
