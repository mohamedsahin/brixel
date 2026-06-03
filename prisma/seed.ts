import { PrismaClient } from "@prisma/client";
import { PACKAGES } from "../lib/packages";

const prisma = new PrismaClient();

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000);

async function main() {
  // ---- Packages (source of truth → DB) ----
  for (const p of PACKAGES) {
    await prisma.package.upsert({
      where: { key: p.key },
      update: {
        name: p.name,
        fromPrice: p.fromPrice,
        priceRange: p.priceRange,
        type: p.type,
        recurring: p.recurring,
        blurb: p.blurb,
        features: p.features,
        tech: p.tech,
        bestFor: p.bestFor,
        order: p.order,
        featured: p.featured ?? false,
      },
      create: {
        key: p.key,
        name: p.name,
        fromPrice: p.fromPrice,
        priceRange: p.priceRange,
        type: p.type,
        recurring: p.recurring,
        blurb: p.blurb,
        features: p.features,
        tech: p.tech,
        bestFor: p.bestFor,
        order: p.order,
        featured: p.featured ?? false,
      },
    });
  }

  // ---- Sample leads ----
  const leads = [
    { name: "Layla Hassan", business: "Layla's Beauty Lounge", phone: "+971 55 220 1180", email: "layla@beautylounge.ae", packageKey: "starter", message: "Salon in JLT, want people to find us and book on WhatsApp.", source: "concierge", preferredContact: "WhatsApp", temperature: "hot", aiSummary: "Salon owner wants to be found online + WhatsApp bookings. Ready now.", status: "New", createdAt: hoursAgo(2) },
    { name: "Omar Farouk", business: "Farouk Auto Parts", phone: "+971 50 887 3321", packageKey: "store", message: "Want to sell parts online with Tabby.", source: "form", preferredContact: "Call", temperature: "warm", aiSummary: "Wants an online store with pay-later. Comparing options.", status: "Contacted", createdAt: hoursAgo(20) },
    { name: "Dr. Reem Al Suwaidi", business: "Smile Dental Clinic", phone: "+971 52 441 9087", email: "reem@smiledental.ae", packageKey: "pro", message: "Premium clinic site, Arabic + English, online bookings.", source: "concierge", preferredContact: "WhatsApp", temperature: "hot", aiSummary: "Clinic wants premium bilingual site + bookings. High intent.", status: "Quoted", createdAt: hoursAgo(46) },
    { name: "Sara Mansour", business: "Sara's Cakes", phone: "+971 56 332 7741", packageKey: "starter", message: "Just looking, home baker.", source: "whatsapp", preferredContact: "WhatsApp", temperature: "cold", aiSummary: "Home baker browsing. Not ready yet.", status: "New", createdAt: hoursAgo(70) },
    { name: "Khalid Nasser", business: "Nasser Logistics", phone: "+971 50 119 0042", email: "khalid@nasserlog.ae", packageKey: "custom", message: "Need a delivery dashboard for drivers.", source: "form", preferredContact: "Email", temperature: "warm", aiSummary: "Wants a custom driver dashboard. Needs scoping.", status: "Quoted", createdAt: hoursAgo(96) },
    { name: "Aisha Belhoul", business: "Belhoul Interiors", phone: "+971 55 700 6612", email: "aisha@belhoul.ae", packageKey: "pro", message: "Portfolio + bookings, bilingual.", source: "concierge", preferredContact: "WhatsApp", temperature: "hot", aiSummary: "Interior studio wants premium bilingual portfolio + bookings.", status: "Won", createdAt: hoursAgo(140) },
  ] as const;

  await prisma.lead.deleteMany();
  for (const l of leads) {
    await prisma.lead.create({ data: l as any });
  }

  // ---- Callbacks ----
  await prisma.callback.deleteMany();
  await prisma.callback.createMany({
    data: [
      { name: "Mariam K.", phone: "+971 50 442 1199", bestTime: "After 5 PM", status: "pending", createdAt: hoursAgo(3) },
      { name: "Yousef A.", phone: "+971 55 880 2231", bestTime: "Morning", status: "pending", createdAt: hoursAgo(26) },
      { name: "Hana M.", phone: "+971 52 309 8841", bestTime: "Lunchtime", status: "done", createdAt: hoursAgo(120) },
    ],
  });

  // ---- Conversations ----
  await prisma.conversation.deleteMany();
  await prisma.conversation.create({
    data: {
      sessionId: "seed-s1",
      recommendedPackage: "starter",
      classification: "hot",
      createdAt: hoursAgo(2),
      messages: [
        { role: "assistant", content: "Hi! I'm Bricky 👋 What kind of business are you building a website for?" },
        { role: "user", content: "i have a small beauty salon" },
        { role: "assistant", content: "Lovely! Do you mainly want people to see your services and message you, or also buy products online?" },
        { role: "user", content: "just see and message me" },
        { role: "assistant", content: "Perfect — our Starter Website (from AED 4,500) is a great fit. Would you like a free quote? I just need your name and best number 😊" },
        { role: "user", content: "Layla, 0552201180" },
        { role: "assistant", content: "Thank you Layla! The team will message you on WhatsApp shortly." },
      ],
    },
  });

  // ---- Events (funnel) ----
  await prisma.event.deleteMany();
  const events: { type: string }[] = [];
  for (let i = 0; i < 420; i++) events.push({ type: "visit" });
  for (let i = 0; i < 150; i++) events.push({ type: "engage_ai" });
  for (let i = 0; i < 48; i++) events.push({ type: "enquiry" });
  for (let i = 0; i < 11; i++) events.push({ type: "won" });
  await prisma.event.createMany({ data: events });

  // ---- Owner ----
  await prisma.adminUser.upsert({
    where: { email: process.env.OWNER_EMAIL ?? "owner@brixel.ae" },
    update: {},
    create: { email: process.env.OWNER_EMAIL ?? "owner@brixel.ae", role: "owner" },
  });

  console.log("✅ Seeded packages, leads, callbacks, conversations, events.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
