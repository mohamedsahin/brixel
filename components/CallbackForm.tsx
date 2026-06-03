"use client";

import { useState } from "react";
import { PhoneIncoming } from "lucide-react";

export function CallbackForm({ onDone }: { onDone?: () => void }) {
  const [f, setF] = useState({ name: "", phone: "", bestTime: "Anytime" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !/^[+\d][\d\s-]{6,}$/.test(f.phone.trim())) {
      setErr("Please add your name and a valid number.");
      return;
    }
    try {
      const res = await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setErr("Sorry, something went wrong. Please try WhatsApp or call us.");
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <PhoneIncoming className="mx-auto text-teal" size={30} />
        <p className="mt-2">
          Got it! We&apos;ll call <b>{f.name.split(" ")[0]}</b> at <b>{f.bestTime.toLowerCase()}</b>.
        </p>
        {onDone && (
          <button className="btn btn-ghost btn-sm mt-3" onClick={onDone}>
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-4">
        <label className="label">Name</label>
        <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" />
      </div>
      <div className="mb-4">
        <label className="label">Number</label>
        <input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+971 50 …" inputMode="tel" />
      </div>
      <div className="mb-4">
        <label className="label">Best time to call</label>
        <select className="select" value={f.bestTime} onChange={(e) => setF({ ...f, bestTime: e.target.value })}>
          <option>Anytime</option>
          <option>Morning</option>
          <option>Lunchtime</option>
          <option>Afternoon</option>
          <option>After 5 PM</option>
        </select>
      </div>
      {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
      <button className="btn btn-teal w-full" type="submit">
        Request callback
      </button>
    </form>
  );
}
