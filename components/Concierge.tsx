"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X, CheckCircle2, Phone, Scissors, ShoppingBag, Calendar, Eye } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { waLink, telLink, CONTACT } from "@/lib/contact";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING = "Hi! I'm Bricky 👋 What kind of business are you building a website for?";
const QUICKIES = [
  { t: "I run a salon", Icon: Scissors },
  { t: "I want to sell products", Icon: ShoppingBag },
  { t: "I need bookings", Icon: Calendar },
  { t: "Just looking around", Icon: Eye },
];

function fmt(text: string) {
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return { __html: safe.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>") };
}

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [captured, setCaptured] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef("s" + Math.random().toString(36).slice(2));
  const engaged = useRef(false);

  useEffect(() => {
    if (open || sessionStorage.getItem("brixel_bubble")) return;
    const t = setTimeout(() => setBubble(true), 4500);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (open) {
      setBubble(false);
      sessionStorage.setItem("brixel_bubble", "1");
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("brixel:open-concierge", handler);
    return () => window.removeEventListener("brixel:open-concierge", handler);
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || typing) return;

    if (!engaged.current) {
      engaged.current = true;
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "engage_ai", sessionId: sessionId.current }),
      }).catch(() => {});
    }

    const next = [...msgs, { role: "user", content } as Msg];
    setMsgs(next);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, messages: next }),
      });
      const data = await res.json();
      setMsgs([...next, { role: "assistant", content: data.reply || "Got it!" }]);
      if (data.captured) setCaptured(true);
    } catch {
      setMsgs([
        ...next,
        { role: "assistant", content: "Sorry, I had a tiny hiccup! Tap the green WhatsApp button or call " + CONTACT.phone + "." },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      {/* Desktop-only floating toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat with Bricky"
          className="pulse-ring fixed bottom-5 end-5 z-[62] hidden h-[62px] w-[62px] place-items-center rounded-full bg-teal text-white shadow-lift transition hover:scale-105 lg:grid"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Desktop-only chat bubble teaser */}
      {!open && bubble && (
        <div className="fixed bottom-8 end-[88px] z-[61] hidden max-w-[240px] rounded-2xl rounded-br-sm border border-line bg-white px-4 py-3 text-sm shadow-lift lg:block">
          <b className="font-head text-teal">Hi, I&apos;m Bricky!</b> Want help picking the right website? Ask me anything.
          <button onClick={() => setOpen(true)} className="mt-2 block font-head font-bold text-aqua">
            Let&apos;s chat →
          </button>
        </div>
      )}

      {/* Chat panel — bottom sheet on mobile, floating card on desktop */}
      {open && (
        <div
          className={cn(
            "fixed z-[63] flex flex-col overflow-hidden bg-white",
            // Mobile: full-width bottom sheet
            "inset-x-0 bottom-0 rounded-t-[24px] slide-up",
            "h-[88dvh] max-h-[88dvh]",
            // Desktop: floating card
            "lg:bottom-5 lg:inset-x-auto lg:end-5 lg:h-[580px] lg:max-h-[calc(100vh-40px)] lg:w-[380px] lg:rounded-[20px] lg:border lg:border-line lg:shadow-lift",
          )}
        >
          {/* Mobile drag handle */}
          <div className="flex justify-center pt-2.5 lg:hidden">
            <div className="h-[5px] w-10 rounded-full bg-mist-deep" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 bg-teal px-4 py-3.5 text-white lg:px-[18px] lg:py-4">
            <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-aqua">
              <Bot size={20} />
            </span>
            <div className="flex-1">
              <h4 className="font-head text-base text-white">Bricky</h4>
              <div className="flex items-center gap-1.5 text-xs text-[#bfe3dd]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CFC9A]" />
                Brixel helper · replies in seconds
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ms-auto grid h-9 w-9 place-items-center rounded-full text-[#bfe3dd] transition hover:bg-white/10"
            >
              <X size={22} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={bodyRef}
            className="chat-scroll flex flex-1 flex-col gap-3 overflow-y-auto bg-cloud p-4 lg:p-[18px]"
          >
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={i}
                  className="max-w-[84%] self-end rounded-2xl rounded-br-sm bg-teal px-3.5 py-2.5 text-[14.5px] text-white"
                >
                  {m.content}
                </div>
              ) : (
                <div
                  key={i}
                  className="max-w-[84%] self-start rounded-2xl rounded-bl-sm border border-line bg-white px-3.5 py-2.5 text-[14.5px] leading-relaxed [&_b]:text-teal"
                  dangerouslySetInnerHTML={fmt(m.content)}
                />
              ),
            )}

            {typing && (
              <div className="max-w-[84%] self-start rounded-2xl border border-line bg-white px-3.5 py-3">
                <span className="flex gap-1">
                  <Dot /> <Dot d={0.15} /> <Dot d={0.3} />
                </span>
              </div>
            )}

            {captured && (
              <div className="rounded-xl border border-aqua bg-mist p-3.5">
                <div className="mb-2 flex items-center gap-1.5 font-head text-sm font-bold text-teal">
                  <CheckCircle2 size={17} /> You&apos;re all set!
                </div>
                <div className="flex gap-2">
                  <a
                    className="btn btn-wa btn-sm flex-1"
                    href={waLink("Hi Brixel! Bricky just took my details 🙂")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon size={15} /> WhatsApp
                  </a>
                  <a className="btn btn-ghost btn-sm flex-1" href={telLink()}>
                    <Phone size={14} /> Call
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Quick reply buttons */}
          {msgs.length <= 1 && !typing && (
            <div className="flex flex-wrap gap-2 bg-cloud px-4 pb-1.5 lg:px-[18px]">
              {QUICKIES.map(({ t, Icon }) => (
                <button
                  key={t}
                  onClick={() => send(t)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-head text-[13px] font-medium text-teal hover:bg-mist"
                >
                  <Icon size={14} /> {t}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex gap-2 border-t border-line bg-white p-3"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              aria-label="Message"
              className="flex-1 rounded-full border-[1.5px] border-line bg-cloud px-4 py-2.5 text-[14.5px] outline-none focus:border-aqua focus:bg-white transition"
            />
            <button
              type="submit"
              aria-label="Send"
              className="grid h-[44px] w-[44px] flex-none place-items-center rounded-full bg-amber text-amber-text transition active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return (
    <span
      className="inline-block h-[7px] w-[7px] rounded-full bg-teal-300"
      style={{ animation: `bob 1.2s ease-in-out ${d}s infinite` }}
    />
  );
}
