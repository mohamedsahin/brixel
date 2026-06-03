import { z } from "zod";
import { PACKAGE_KEYS } from "./packages";

const phoneRegex = /^[+\d][\d\s-]{6,}$/;

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(120),
  business: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().regex(phoneRegex, "Please enter a valid phone number"),
  email: z.string().trim().email("That email doesn't look right").optional().or(z.literal("")),
  packageKey: z.enum(PACKAGE_KEYS).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  preferredContact: z.enum(["WhatsApp", "Call", "Email"]).default("WhatsApp"),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

export const callbackSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(phoneRegex, "Please enter a valid phone number"),
  bestTime: z.string().trim().max(60).optional().or(z.literal("")),
});
export type CallbackInput = z.infer<typeof callbackSchema>;

export const eventSchema = z.object({
  sessionId: z.string().trim().max(80).optional(),
  type: z.enum(["visit", "engage_ai", "enquiry", "won", "page_view"]),
  metadata: z.record(z.any()).optional(),
});

export const chatSchema = z.object({
  sessionId: z.string().trim().min(1).max(80),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .min(1)
    .max(40),
});
export type ChatInput = z.infer<typeof chatSchema>;
