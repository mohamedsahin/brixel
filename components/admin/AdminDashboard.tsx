"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid, Users, PhoneIncoming, MessageCircle, BarChart3, Box,
  Bell, Search, Phone, Mail, Check, Bot, Star, Clock, X,
  Newspaper, Eye, Trash2, Globe, Zap,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { waLink } from "@/lib/contact";
import { timeAgo } from "@/lib/utils";
import { fmtAED, type PackageDef } from "@/lib/packages";

type Lead = any;
type Dash = {
  leads: Lead[];
  callbacks: any[];
  conversations: any[];
  notifications: any[];
  eventCounts: Record<string, number>;
  articles: any[];
  ok: boolean;
};

const STATUSES = ["New", "Contacted", "Quoted", "Won", "Lost"] as const;
const TEMP_LABEL: Record<string, string> = { hot: "Hot", warm: "Warm", cold: "Cold" };
const SRC_LABEL: Record<string, string> = { form: "Form", whatsapp: "WhatsApp", concierge: "Concierge", callback: "Callback" };
const TEMP_CLASS: Record<string, string> = {
  hot: "bg-[#fde2dd] text-[#b3331b]", warm: "bg-[#fdeccb] text-[#92560a]", cold: "bg-[#dceaf7] text-[#2b6098]",
};
const STATUS_CLASS: Record<string, string> = {
  New: "bg-mist text-teal", Contacted: "bg-[#e8e0f7] text-[#5b3aa0]", Quoted: "bg-[#fdeccb] text-[#92560a]",
  Won: "bg-[#d6f0df] text-[#1c7a43]", Lost: "bg-[#eceff0] text-[#6b7a7f]",
};

const TABS = [
  ["overview", LayoutGrid, "Overview"],
  ["leads", Users, "Leads"],
  ["callbacks", PhoneIncoming, "Callbacks"],
  ["conversations", MessageCircle, "Conversations"],
  ["analytics", BarChart3, "Analytics"],
  ["packages", Box, "Packages"],
  ["blog", Newspaper, "Blog / SEO"],
] as const;

export function AdminDashboard({ data, packages }: { data: Dash; packages: PackageDef[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<string>("overview");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [convoId, setConvoId] = useState<string | null>(null);

  const pkgByKey = useMemo(() => Object.fromEntries(packages.map((p) => [p.key, p])), [packages]);
  const pendingCb = data.callbacks.filter((c) => c.status === "pending").length;
  const unread = data.notifications.filter((n) => !n.read).length;

  async function refresh() {
    router.refresh();
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-cloud lg:grid-cols-[248px_1fr]">
      {/* sidebar */}
      <aside className="bg-teal p-4 text-[#cfe7e3] lg:sticky lg:top-0 lg:h-screen">
        <div className="px-2 py-1">
          <Logo white />
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {TABS.map(([k, Icon, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-start font-head text-[15px] font-medium transition ${
                tab === k ? "bg-white text-teal" : "text-[#bcdcd7] hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={19} /> {label}
              {k === "callbacks" && pendingCb > 0 && (
                <span className="badge ms-auto bg-[#fdeccb] text-[#92560a]">{pendingCb}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-8 lg:absolute lg:inset-x-4 lg:bottom-5">
          <Link href="/" className="btn btn-sm w-full bg-white/10 text-white">View website ↗</Link>
          <button
            className="mt-2 w-full text-sm text-[#9cc7c2]"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              router.refresh();
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* main */}
      <main className="overflow-auto px-8 py-7">
        <div className="mb-6 flex items-center gap-3.5">
          <h1 className="text-[27px]">{TABS.find((t) => t[0] === tab)![2]}</h1>
          <div className="ms-auto flex items-center gap-3.5">
            <div className="relative text-teal">
              <Bell size={22} />
              {unread > 0 && (
                <span className="absolute -end-1.5 -top-1.5 rounded-full bg-amber px-1.5 text-[11px] font-bold text-amber-text">
                  {unread}
                </span>
              )}
            </div>
            <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-mist font-head font-bold text-teal">BO</span>
          </div>
        </div>

        {!data.ok && (
          <div className="card mb-5 border-amber/40 bg-[#fdeccb]/40 p-4 text-sm text-[#92560a]">
            Database not connected yet. Run <code>npm run db:push &amp;&amp; npm run db:seed</code> to see live data.
          </div>
        )}

        {tab === "overview" && <Overview data={data} pkgByKey={pkgByKey} setTab={setTab} openLead={setLeadId} />}
        {tab === "leads" && <Leads data={data} pkgByKey={pkgByKey} openLead={setLeadId} refresh={refresh} />}
        {tab === "callbacks" && <Callbacks data={data} refresh={refresh} />}
        {tab === "conversations" && <Conversations data={data} pkgByKey={pkgByKey} openConvo={setConvoId} />}
        {tab === "analytics" && <Analytics data={data} packages={packages} pkgByKey={pkgByKey} />}
        {tab === "packages" && <PackageManager packages={packages} refresh={refresh} />}
        {tab === "blog" && <BlogManager articles={data.articles || []} refresh={refresh} />}
      </main>

      {leadId && <LeadDrawer lead={data.leads.find((l) => l.id === leadId)} pkgByKey={pkgByKey} onClose={() => setLeadId(null)} refresh={refresh} />}
      {convoId && <ConvoDrawer convo={data.conversations.find((c) => c.id === convoId)} pkgByKey={pkgByKey} onClose={() => setConvoId(null)} />}
    </div>
  );
}

function Badge({ kind, children }: { kind: string; children: React.ReactNode }) {
  return <span className={`badge ${TEMP_CLASS[kind] ?? "bg-mist text-teal"}`}>{children}</span>;
}

function Overview({ data, pkgByKey, setTab, openLead }: any) {
  const today = data.leads.filter((l: any) => Date.now() - new Date(l.createdAt).getTime() < 86400000);
  const hot = data.leads.filter((l: any) => l.temperature === "hot");
  const pendingCb = data.callbacks.filter((c: any) => c.status === "pending");
  const won = data.leads.filter((l: any) => l.status === "Won").length;
  const conv = data.leads.length ? Math.round((won / data.leads.length) * 100) : 0;
  const counts: Record<string, number> = {};
  data.leads.forEach((l: any) => { if (l.packageKey) counts[l.packageKey] = (counts[l.packageKey] || 0) + 1; });
  const topKey = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi n={today.length} l="Enquiries today" d={`${data.leads.length} total`} />
        <Kpi n={pendingCb.length} l="Callbacks waiting" d="Tap Callbacks to action" />
        <Kpi n={hot.length} l="Hot leads" d="Ready to buy now" />
        <Kpi n={`${conv}%`} l="Win rate" d={`${won} won deals`} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <div className="mb-3.5 flex items-center">
            <h3 className="text-lg">Latest enquiries</h3>
            <button className="btn btn-ghost btn-sm ms-auto" onClick={() => setTab("leads")}>View all</button>
          </div>
          <Table head={["Name", "Package", "Source", "Temp", "When"]}>
            {data.leads.slice(0, 5).map((l: any) => (
              <tr key={l.id} className="cursor-pointer hover:bg-cloud" onClick={() => openLead(l.id)}>
                <Td><b className="font-head text-teal">{l.name}</b><div className="text-xs text-ink-faint">{l.business || "—"}</div></Td>
                <Td>{l.packageKey ? pkgByKey[l.packageKey]?.name : "—"}</Td>
                <Td><span className="text-[13px] text-ink-soft">{SRC_LABEL[l.source]}</span></Td>
                <Td><Badge kind={l.temperature}>{TEMP_LABEL[l.temperature]}</Badge></Td>
                <Td><span className="text-[13px] text-ink-soft">{timeAgo(l.createdAt)}</span></Td>
              </tr>
            ))}
          </Table>
        </div>
        <div className="card p-6">
          <h3 className="mb-3.5 text-lg">Most requested</h3>
          {topKey && (
            <div className="flex items-center gap-3.5 py-3.5">
              <span className="text-[38px]">{pkgByKey[topKey] && <Box className="text-aqua" size={34} />}</span>
              <div>
                <div className="font-head text-lg font-bold text-teal">{pkgByKey[topKey]?.name}</div>
                <div className="text-sm text-ink-soft">{counts[topKey]} enquiries</div>
              </div>
            </div>
          )}
          <div className="mt-2.5 border-t border-line pt-4">
            <h4 className="mb-3 font-head text-sm uppercase tracking-wide text-ink-faint">Recent activity</h4>
            <div className="flex flex-col gap-2.5">
              {data.notifications.slice(0, 4).map((n: any) => (
                <div key={n.id} className="flex items-center gap-2.5 text-sm">
                  <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-lg bg-mist text-teal">
                    {n.type === "callback" ? <PhoneIncoming size={15} /> : n.type === "hot_lead" ? <Star size={15} /> : <Mail size={15} />}
                  </span>
                  <span className="flex-1">
                    {n.type === "callback" ? <><b>{n.payload?.name}</b> requested a callback</>
                      : n.type === "hot_lead" ? <>🔥 Hot lead: <b>{n.payload?.name}</b></>
                      : <>New enquiry from <b>{n.payload?.name}</b></>}
                  </span>
                  <span className="flex-none text-xs text-ink-faint">{timeAgo(n.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ n, l, d }: { n: React.ReactNode; l: string; d: string }) {
  return (
    <div className="card p-5">
      <div className="font-head text-[30px] font-extrabold text-teal">{n}</div>
      <div className="mt-0.5 text-[13.5px] text-ink-soft">{l}</div>
      <div className="mt-2 text-xs font-semibold text-aqua">{d}</div>
    </div>
  );
}

function Leads({ data, pkgByKey, openLead, refresh }: any) {
  const [q, setQ] = useState("");
  const [src, setSrc] = useState("all");
  const [temp, setTemp] = useState("all");
  const [stat, setStat] = useState("all");

  const rows = data.leads.filter((l: any) => {
    if (q && !`${l.name} ${l.business || ""} ${l.phone}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (src !== "all" && l.source !== src) return false;
    if (temp !== "all" && l.temperature !== temp) return false;
    if (stat !== "all" && l.status !== stat) return false;
    return true;
  });

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="relative max-w-[300px] flex-1">
          <Search size={17} className="absolute start-3 top-2.5 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, business, phone…"
            className="w-full rounded-lg border-[1.5px] border-line py-2.5 ps-9 pe-3 text-sm" />
        </div>
        <Select value={src} onChange={setSrc} opts={[["all", "All sources"], ["form", "Form"], ["concierge", "Concierge"], ["whatsapp", "WhatsApp"], ["callback", "Callback"]]} />
        <Select value={temp} onChange={setTemp} opts={[["all", "All temps"], ["hot", "Hot"], ["warm", "Warm"], ["cold", "Cold"]]} />
        <Select value={stat} onChange={setStat} opts={[["all", "All statuses"], ...STATUSES.map((s) => [s, s] as [string, string])]} />
      </div>
      <Table head={["Name & business", "Contact", "Package", "Source", "AI summary", "Temp", "Status", "Actions"]}>
        {rows.map((l: any) => (
          <tr key={l.id}>
            <Td onClick={() => openLead(l.id)} className="cursor-pointer">
              <b className="font-head text-teal">{l.name}</b>
              <div className="text-xs text-ink-faint">{l.business || "—"} · {timeAgo(l.createdAt)}</div>
            </Td>
            <Td><span className="text-[13px]">{l.phone}</span>{l.email && <div className="text-[13px] text-ink-faint">{l.email}</div>}</Td>
            <Td><span className="text-[13px]">{l.packageKey ? pkgByKey[l.packageKey]?.name : "—"}</span></Td>
            <Td><span className="text-[13px] text-ink-soft">{SRC_LABEL[l.source]}</span></Td>
            <Td><span className="block max-w-[200px] text-[13px] text-ink-soft">{l.aiSummary || l.message || "—"}</span></Td>
            <Td><Badge kind={l.temperature}>{TEMP_LABEL[l.temperature]}</Badge></Td>
            <Td>
              <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}
                className="rounded-lg border border-line px-2 py-1.5 text-[12.5px]">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Td>
            <Td><ActionLinks lead={l} /></Td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr><td colSpan={8} className="p-8 text-center text-ink-soft">No leads match your filters.</td></tr>
        )}
      </Table>
    </div>
  );
}

function ActionLinks({ lead }: { lead: any }) {
  return (
    <div className="flex gap-1.5">
      <a className="grid h-8 w-8 place-items-center rounded-lg border border-line text-wa hover:bg-mist"
        href={waLink(`Hi ${lead.name.split(" ")[0]}, thanks for your enquiry to Brixel!`)} target="_blank" rel="noreferrer" title="WhatsApp">
        <WhatsAppIcon size={16} />
      </a>
      <a className="grid h-8 w-8 place-items-center rounded-lg border border-line text-teal hover:bg-mist"
        href={`tel:${(lead.phone || "").replace(/\s/g, "")}`} title="Call"><Phone size={15} /></a>
      {lead.email && (
        <a className="grid h-8 w-8 place-items-center rounded-lg border border-line text-teal hover:bg-mist"
          href={`mailto:${lead.email}`} title="Email"><Mail size={15} /></a>
      )}
    </div>
  );
}

function LeadDrawer({ lead, pkgByKey, onClose, refresh }: any) {
  if (!lead) return null;
  async function setStatus(status: string) {
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    refresh();
  }
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-ink/40" onClick={onClose}>
      <div className="h-full w-[460px] max-w-full overflow-auto bg-white p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-mist font-head font-bold text-teal">
            {lead.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
          </span>
          <div><h2 className="text-[22px]">{lead.name}</h2><div className="text-sm text-ink-soft">{lead.business || "—"}</div></div>
          <button className="ms-auto grid h-8 w-8 place-items-center rounded-lg border border-line" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mt-3.5 flex gap-2">
          <Badge kind={lead.temperature}>{TEMP_LABEL[lead.temperature]}</Badge>
          <span className={`badge ${STATUS_CLASS[lead.status]}`}>{lead.status}</span>
          <span className="badge bg-mist text-teal">{SRC_LABEL[lead.source]}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <a className="btn btn-wa btn-sm flex-1" href={waLink(`Hi ${lead.name.split(" ")[0]}!`)} target="_blank" rel="noreferrer"><WhatsAppIcon size={16} /> WhatsApp</a>
          <a className="btn btn-teal btn-sm flex-1" href={`tel:${(lead.phone || "").replace(/\s/g, "")}`}><Phone size={15} /> Call</a>
        </div>
        <DField label="Phone / WhatsApp" val={lead.phone} />
        {lead.email && <DField label="Email" val={lead.email} />}
        <DField label="Preferred contact" val={lead.preferredContact} />
        <DField label="Interested in" val={lead.packageKey ? pkgByKey[lead.packageKey]?.name : "Not sure yet"} />
        {lead.aiSummary && <DField label="AI summary" val={lead.aiSummary} />}
        {lead.message && <DField label="Their message" val={lead.message} />}
        <div className="mt-5">
          <label className="label">Move through pipeline</label>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`rounded-lg border px-2.5 py-1.5 font-head text-xs font-semibold ${lead.status === s ? "border-teal bg-teal text-white" : "border-line bg-white text-ink-soft"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DField({ label, val }: { label: string; val: string }) {
  return (
    <div className="mt-4">
      <div className="font-head text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-0.5 text-[15.5px] text-ink">{val}</div>
    </div>
  );
}

function Callbacks({ data, refresh }: any) {
  async function toggle(c: any) {
    await fetch(`/api/admin/callbacks/${c.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: c.status === "pending" ? "done" : "pending" }),
    });
    refresh();
  }
  return (
    <div className="card overflow-hidden">
      <Table head={["Name", "Number", "Best time", "When", "Status", "Actions"]}>
        {data.callbacks.map((c: any) => (
          <tr key={c.id}>
            <Td><b className="font-head text-teal">{c.name}</b></Td>
            <Td><span className="text-sm">{c.phone}</span></Td>
            <Td><span className="badge bg-[#fdeccb] text-[#92560a]"><Clock size={13} /> {c.bestTime || "Anytime"}</span></Td>
            <Td><span className="text-[13px] text-ink-soft">{timeAgo(c.createdAt)}</span></Td>
            <Td>{c.status === "pending" ? <span className="badge bg-mist text-teal">Pending</span> : <span className="badge bg-[#d6f0df] text-[#1c7a43]">Done</span>}</Td>
            <Td>
              <div className="flex gap-1.5">
                <a className="grid h-8 w-8 place-items-center rounded-lg border border-line text-teal hover:bg-mist" href={`tel:${c.phone.replace(/\s/g, "")}`} title="Call"><Phone size={15} /></a>
                <button className="grid h-8 w-8 place-items-center rounded-lg border border-line text-aqua hover:bg-mist" onClick={() => toggle(c)} title="Toggle done"><Check size={16} /></button>
              </div>
            </Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function Conversations({ data, pkgByKey, openConvo }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.conversations.map((c: any) => {
        const last = c.messages[c.messages.length - 1];
        return (
          <div key={c.id} className="card cursor-pointer p-5" onClick={() => openConvo(c.id)}>
            <div className="mb-2.5 flex items-center gap-2.5">
              <Bot className="text-teal" size={22} />
              <div className="flex-1">
                <div className="font-head text-[15px] font-bold text-teal">Session {String(c.sessionId).slice(0, 8)}</div>
                <div className="text-xs text-ink-soft">{timeAgo(c.createdAt)} · {c.messages.length} messages</div>
              </div>
              <Badge kind={c.classification}>{TEMP_LABEL[c.classification]}</Badge>
            </div>
            <p className="line-clamp-2 text-[13.5px] text-ink-soft">{last?.content}</p>
            <div className="mt-3 text-[13px]">Recommended: <b className="text-teal">{c.recommendedPackage ? pkgByKey[c.recommendedPackage]?.name : "—"}</b></div>
          </div>
        );
      })}
      {data.conversations.length === 0 && <p className="text-ink-soft">No concierge conversations yet.</p>}
    </div>
  );
}

function ConvoDrawer({ convo, pkgByKey, onClose }: any) {
  if (!convo) return null;
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-ink/40" onClick={onClose}>
      <div className="h-full w-[460px] max-w-full overflow-auto bg-white p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2.5">
          <Bot className="text-teal" size={26} />
          <div className="flex-1"><h2 className="text-xl">Bricky transcript</h2><div className="text-[13px] text-ink-soft">Session {String(convo.sessionId).slice(0, 12)} · {timeAgo(convo.createdAt)}</div></div>
          <button className="grid h-8 w-8 place-items-center rounded-lg border border-line" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mt-3 flex gap-2">
          <Badge kind={convo.classification}>{TEMP_LABEL[convo.classification]}</Badge>
          {convo.recommendedPackage && <span className="badge bg-mist text-teal">→ {pkgByKey[convo.recommendedPackage]?.name}</span>}
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          {convo.messages.map((m: any, i: number) => (
            <div key={i} className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[14.5px] ${m.role === "user" ? "self-end bg-teal text-white" : "self-start border border-line bg-cloud"}`}>
              {m.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Analytics({ data, packages, pkgByKey }: any) {
  const ev = data.eventCounts;
  const funnel: [string, number, string][] = [
    ["Visitors", ev.visit || 0, "bg-teal"],
    ["Chatted with Bricky", ev.engage_ai || 0, "bg-aqua"],
    ["Sent an enquiry", ev.enquiry || 0, "bg-amber"],
    ["Became a customer", ev.won || 0, "bg-[#1c7a43]"],
  ];
  const max = funnel[0][1] || 1;
  const counts: Record<string, number> = {};
  data.leads.forEach((l: any) => { if (l.packageKey) counts[l.packageKey] = (counts[l.packageKey] || 0) + 1; });
  const pkgMax = Math.max(1, ...Object.values(counts).map(Number));

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="card p-6">
        <h3 className="mb-4 text-lg">Conversion funnel</h3>
        <div className="flex flex-col gap-3">
          {funnel.map((f, i) => (
            <div key={i} className="grid grid-cols-[130px_1fr_56px] items-center gap-3 text-sm">
              <span>{f[0]}</span>
              <div className="h-3.5 overflow-hidden rounded-full bg-mist">
                <div className={`h-full rounded-full ${f[2]}`} style={{ width: `${(f[1] / max) * 100}%` }} />
              </div>
              <b className="text-end font-head text-teal">{f[1]}</b>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-6 border-t border-line pt-4">
          <Stat label="Visitor → enquiry" val={`${Math.round(((ev.enquiry || 0) / max) * 100)}%`} />
          <Stat label="Enquiry → won" val={`${Math.round(((ev.won || 0) / (ev.enquiry || 1)) * 100)}%`} />
        </div>
      </div>
      <div className="card p-6">
        <h3 className="mb-4 text-lg">Most requested packages</h3>
        <div className="flex flex-col gap-3">
          {[...packages].sort((a, b) => (counts[b.key] || 0) - (counts[a.key] || 0)).map((p) => (
            <div key={p.key} className="grid grid-cols-[130px_1fr_56px] items-center gap-3 text-sm">
              <span className="truncate">{p.name}</span>
              <div className="h-3.5 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-aqua" style={{ width: `${((counts[p.key] || 0) / pkgMax) * 100}%` }} />
              </div>
              <b className="text-end font-head text-teal">{counts[p.key] || 0}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, val }: { label: string; val: string }) {
  return (
    <div>
      <div className="text-[13px] text-ink-soft">{label}</div>
      <div className="font-head text-2xl font-extrabold text-teal">{val}</div>
    </div>
  );
}

function PackageManager({ packages, refresh }: { packages: PackageDef[]; refresh: () => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<any>({});
  const [saving, setSaving] = useState(false);

  function start(p: PackageDef) {
    setEditing(p.key);
    setDraft({ name: p.name, fromPrice: p.fromPrice, priceRange: p.priceRange, blurb: p.blurb });
  }
  async function save() {
    setSaving(true);
    await fetch(`/api/admin/packages/${editing}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, fromPrice: Number(draft.fromPrice) || 0 }),
    });
    setSaving(false);
    setEditing(null);
    refresh();
  }

  return (
    <div>
      <p className="mb-4 text-ink-soft">Edit names, prices and plain-English descriptions — changes show on the website right away, no code needed.</p>
      <div className="flex flex-col gap-3.5">
        {[...packages].sort((a, b) => a.order - b.order).map((p) => (
          <div key={p.key} className="card p-6">
            {editing === p.key ? (
              <div>
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1.4fr]">
                  <div><label className="label">Name</label><input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
                  <div><label className="label">From price (AED)</label><input className="input" type="number" value={draft.fromPrice} onChange={(e) => setDraft({ ...draft, fromPrice: e.target.value })} /></div>
                  <div><label className="label">Price range (display)</label><input className="input" value={draft.priceRange} onChange={(e) => setDraft({ ...draft, priceRange: e.target.value })} /></div>
                </div>
                <div className="mt-3"><label className="label">Plain-English description</label><textarea className="textarea" value={draft.blurb} onChange={(e) => setDraft({ ...draft, blurb: e.target.value })} /></div>
                <div className="flex gap-2.5">
                  <button className="btn btn-amber btn-sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg">{p.name}</h3>
                    <span className="font-head text-sm font-bold text-aqua">from <b className="text-teal">{fmtAED(p.fromPrice)}</b>{p.recurring}</span>
                  </div>
                  <p className="mt-1.5 max-w-[70ch] text-[14.5px] text-ink-soft">{p.blurb}</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => start(p)}>Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Blog / SEO manager ---- */
function BlogManager({ articles, refresh }: { articles: any[]; refresh: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg]         = useState("");
  const [autoPublish, setAutoPublish] = useState<boolean | null>(null); // null = loading

  // Load current setting on mount
  useEffect(() => {
    fetch("/api/admin/settings?key=blog_auto_publish")
      .then((r) => r.json())
      .then((d) => setAutoPublish(d.value === "true"))
      .catch(() => setAutoPublish(false));
  }, []);

  async function toggleAutoPublish() {
    const next = !autoPublish;
    setAutoPublish(next);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "blog_auto_publish", value: String(next) }),
    });
  }

  async function generateNow() {
    setGenerating(true);
    setGenMsg("⏳ Writing article with AI — this takes ~20 seconds…");
    try {
      const res  = await fetch("/api/admin/generate-article", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setGenMsg(`✅ ${data.status === "published" ? "Published" : "Saved as draft"}: "${data.title}"`);
        refresh();
      } else {
        setGenMsg(`❌ ${data.error ?? "Unknown error"}`);
      }
    } catch {
      setGenMsg("❌ Network error");
    } finally {
      setGenerating(false);
    }
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  async function deleteArticle(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    refresh();
  }

  const published  = articles.filter((a) => a.status === "published").length;
  const drafts     = articles.filter((a) => a.status === "draft").length;
  const totalViews = articles.reduce((s: number, a: any) => s + (a.views ?? 0), 0);

  return (
    <div>
      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi n={published}     l="Published"     d="Live on the blog" />
        <Kpi n={drafts}        l="Awaiting review" d="Ready to publish" />
        <Kpi n={totalViews}    l="Total views"   d="Across all posts" />
        <Kpi n={articles.length} l="Total articles" d="All time" />
      </div>

      {/* Auto-publish toggle card */}
      <div className="card mb-5 flex flex-wrap items-center gap-4 p-5">
        <div className="flex-1 min-w-[220px]">
          <div className="font-head text-[15px] font-bold text-teal">
            {autoPublish ? "🟢 Auto-publish is ON" : "🟡 Draft mode is ON"}
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">
            {autoPublish
              ? "New AI articles go live immediately — no review needed."
              : "New AI articles are saved as drafts. You read & approve before they go live."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-ink-soft">Draft</span>
          <button
            onClick={toggleAutoPublish}
            disabled={autoPublish === null}
            className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${
              autoPublish ? "bg-teal" : "bg-mist-deep"
            }`}
            aria-label="Toggle auto-publish"
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all duration-200 ${
                autoPublish ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
          <span className="text-[13px] text-ink-soft">Auto-publish</span>
        </div>
      </div>

      {/* Generate + view */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={generateNow}
          disabled={generating}
          className="btn btn-amber btn-sm"
        >
          <Zap size={15} /> {generating ? "Generating…" : "Generate article now"}
        </button>
        <a href="/blog" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
          <Globe size={15} /> View blog ↗
        </a>
        <span className="text-[12px] text-ink-faint">
          Cron runs daily at 7 AM UAE time. Manual trigger above.
        </span>
      </div>

      {genMsg && (
        <div className="mb-4 rounded-lg border border-line bg-cloud px-4 py-3 text-[13.5px]">
          {genMsg}
        </div>
      )}

      {/* Drafts quick-action banner */}
      {drafts > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber/40 bg-[#fdeccb]/50 px-4 py-3 text-[13.5px]">
          <span className="font-head font-semibold text-[#92560a]">
            {drafts} draft{drafts > 1 ? "s" : ""} awaiting review
          </span>
          <span className="text-[#92560a]">— scroll down, change status to "Published" when ready.</span>
        </div>
      )}

      {/* Articles table */}
      <div className="card overflow-hidden">
        <Table head={["Title", "Keyword", "Tags", "Status", "Views", "When", "Actions"]}>
          {articles.map((a: any) => (
            <tr key={a.id} className={a.status === "draft" ? "bg-[#fdeccb]/20" : ""}>
              <Td>
                <div className="max-w-[260px]">
                  <b className="block font-head text-[13px] text-teal line-clamp-2 leading-snug">{a.title}</b>
                  <span className="text-[11px] text-ink-faint">/blog/{a.slug}</span>
                </div>
              </Td>
              <Td><span className="text-[12px] text-ink-soft">{a.focusKeyword}</span></Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {((a.tags ?? []) as string[]).slice(0, 2).map((t: string) => (
                    <span key={t} className="rounded-full bg-mist px-2 py-0.5 text-[11px] text-teal">{t}</span>
                  ))}
                </div>
              </Td>
              <Td>
                <select
                  value={a.status}
                  onChange={(e) => setStatus(a.id, e.target.value)}
                  className={`rounded-lg border px-2 py-1.5 text-[12px] font-semibold ${
                    a.status === "published"
                      ? "border-[#1c7a43] bg-[#d6f0df] text-[#1c7a43]"
                      : a.status === "draft"
                      ? "border-[#92560a] bg-[#fdeccb] text-[#92560a]"
                      : "border-line bg-cloud text-ink-soft"
                  }`}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </Td>
              <Td>
                <span className="flex items-center gap-1 text-[12.5px] text-ink-soft">
                  <Eye size={12} /> {a.views ?? 0}
                </span>
              </Td>
              <Td><span className="text-[12px] text-ink-soft">{timeAgo(a.createdAt)}</span></Td>
              <Td>
                <div className="flex gap-1.5">
                  <a
                    href={`/blog/${a.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="View on site"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line text-teal hover:bg-mist"
                  >
                    <Globe size={14} />
                  </a>
                  <button
                    onClick={() => deleteArticle(a.id, a.title)}
                    title="Delete"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line text-red-400 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
          {articles.length === 0 && (
            <tr>
              <td colSpan={7} className="p-10 text-center text-ink-soft">
                No articles yet. Click &ldquo;Generate article now&rdquo; to create the first one.
              </td>
            </tr>
          )}
        </Table>
      </div>
    </div>
  );
}

/* ---- tiny table helpers ---- */
function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="border-b border-line bg-cloud px-3.5 py-3 text-start font-head text-[12.5px] font-semibold uppercase tracking-wide text-ink-faint">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function Td({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <td onClick={onClick} className={`border-b border-line px-3.5 py-3 align-middle text-sm ${className ?? ""}`}>{children}</td>;
}
function Select({ value, onChange, opts }: { value: string; onChange: (v: string) => void; opts: [string, string][] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border-[1.5px] border-line px-3 py-2.5 text-sm">
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
