export function PageHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <section className="bg-mist py-14">
      <div className="wrap mx-auto max-w-[60ch] text-center">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-3 text-[clamp(32px,4.6vw,52px)]">{title}</h1>
        {sub && <p className="mt-3.5 text-lg text-ink-soft">{sub}</p>}
      </div>
    </section>
  );
}
