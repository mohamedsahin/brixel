import { cookies } from "next/headers";

const COOKIE = "brixel_admin";

// DEMO-grade admin gate. Replace with Clerk or NextAuth for production —
// see README. Keeps the panel out of the public flow without extra services.
export function isAdminAuthed() {
  return cookies().get(COOKIE)?.value === "ok";
}

export const ADMIN_COOKIE = COOKIE;
