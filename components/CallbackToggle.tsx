"use client";

import { useState } from "react";
import { PhoneIncoming } from "lucide-react";
import { CallbackForm } from "./CallbackForm";

// "Request a callback" toggle (client island inside the otherwise-static aside).
export function CallbackToggle() {
  const [open, setOpen] = useState(false);
  return open ? (
    <CallbackForm onDone={() => setOpen(false)} />
  ) : (
    <button className="btn btn-ghost w-full" onClick={() => setOpen(true)}>
      <PhoneIncoming size={18} /> Request a callback
    </button>
  );
}
