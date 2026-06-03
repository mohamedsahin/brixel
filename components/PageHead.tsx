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
    <section className="bg-mist py-10 sm:py-14">
      <div className="wrap mx-auto max-w-[60ch] text-center">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-2.5 text-[clamp(28px,4.6vw,52px)]">{title}</h1>
        {sub && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:mt-3.5 sm:text-lg">{sub}</p>}
      </div>
    </section>
  );
}
