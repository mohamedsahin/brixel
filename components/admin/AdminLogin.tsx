"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setErr("Wrong password. (Set ADMIN_PASSWORD in your .env)");
        return;
      }
      router.refresh();
    } catch {
      setErr("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-teal">
      <form onSubmit={submit} className="card w-[380px] max-w-[90vw] p-9">
        <Logo />
        <h2 className="mt-5 text-2xl">Owner sign-in</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          The admin panel is private. Set <code>ADMIN_PASSWORD</code> in your environment.
        </p>
        <div className="mb-4 mt-4">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>
        {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
        <button className="btn btn-amber btn-lg w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <Link href="/" className="mt-4 block text-center text-sm text-teal">
          ← Back to website
        </Link>
      </form>
    </div>
  );
}
