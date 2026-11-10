import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LondonClock, Magnetic, Scramble, useReveal } from "@/components/site-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GokuLabs — Web, mobile & AI studio in London" },
      { name: "description", content: "GokuLabs builds custom web apps, mobile apps and AI automation for growing businesses. Based at 66 Paul Street, London." },
      { property: "og:title", content: "GokuLabs — Web, mobile & AI studio in London" },
      { property: "og:description", content: "Custom web apps, mobile apps and AI automation, built faster by a senior London team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EMAIL = "goku.labs.ltd@gmail.com";

const services = [
  { n: "01", title: "Web Apps", text: "Custom, high-performance web applications.", items: ["Design systems & component libraries", "Realtime dashboards and portals", "Core Web Vitals tuning"] },
  { n: "02", title: "Mobile Apps", text: "Native and cross-platform mobile experiences.", items: ["iOS & Android from one codebase", "Offline-first sync & push flows", "Store release pipelines"] },
  { n: "03", title: "AI & Automation", text: "Integrating intelligent workflows to save you time.", items: ["LLM copilots in your own product", "Document & data pipelines", "Human-in-the-loop guardrails"] },
];

const why = [
  { title: "Faster Delivery", text: "AI-assisted engineering and tight two-week loops turn roadmaps into shipped features while the market is still paying attention." },
  { title: "Smart Solutions", text: "We start with the outcome, not the framework — then pick the smallest stack that gets you there with room to grow." },
  { title: "Built to Scale", text: "Observability, tests and sensible architecture from day one, so your app stays fast at ten users and ten million." },
];

const quotes = [
  { q: "Working with this team for our web app development was an absolute game-changer. They transformed our vision into a user-friendly, responsive platform that exceeded our expectations. Their expertise, attention to detail, and commitment to our success made the entire process seamless and enjoyable.", name: "Sharaddha Khandelwal", role: "Dental Hygienist & Therapist, London" },
  { q: "I'm absolutely pleased with the AI project this company delivered for us in Python. Their professionalism, timely delivery, and the tangible impact on our business operations have made them our go-to partner for all future AI initiatives.", name: "George Wills", role: "London" },
];

function Index() {
  useReveal();
  const [menu, setMenu] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = `${d.get("message")}\n\n— ${d.get("name")} (${d.get("email")})`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`New project — ${d.get("name")}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="grain min-h-screen overflow-x-clip">

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">⚡</span>
            GokuLabs
          </a>
          <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest md:flex">
            {["services", "why-us", "words", "contact"].map((id) => (
              <a key={id} href={`#${id}`} className="hover:text-primary"><Scramble text={id === "words" ? "testimonials" : id.replace("-", " ")} /></a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href="#contact" className="rounded-full bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:bg-primary">Start a project</a>
            <button className="md:hidden" onClick={() => setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu}>
              {menu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="flex flex-col gap-4 border-t px-5 py-6 font-display text-2xl font-bold md:hidden">
            {[["services", "Services"], ["why-us", "Why Us"], ["words", "Testimonials"], ["contact", "Contact"]].map(([id, l]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{l}</a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="relative mx-auto max-w-7xl px-5 pb-16 pt-36 md:px-8 md:pt-44">
        <div className="mb-10 flex flex-wrap justify-between gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span>● Available for new projects</span>
          <span>London — <LondonClock /></span>
        </div>
        <h1 className="font-display text-[15vw] font-extrabold leading-[0.85] tracking-tighter md:text-[9.5rem]">
          <span className="block overflow-hidden"><span className="rise">Smarter apps,</span></span>
          <span className="block overflow-hidden"><span className="rise [animation-delay:120ms]">built <em className="font-normal italic text-primary">faster.</em></span></span>
        </h1>
        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-md text-lg text-muted-foreground reveal">
            We engineer cutting-edge web and mobile solutions — with AI baked in — to scale your business.
          </p>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground">
                Start a project <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#services" className="inline-flex items-center rounded-full border border-ink px-7 py-4 font-medium transition-colors hover:bg-ink hover:text-paper">See what we do</a>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-wrap -rotate-1 border-y-2 border-ink bg-accent py-4">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-display text-3xl font-bold md:text-5xl">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Web Apps", "✺", "Mobile Apps", "✺", "AI & Automation", "✺", "Design Systems", "✺", "Dashboards", "✺"].map((w, i) => <span key={`${k}-${i}`}>{w}</span>),
          )}
        </div>
      </div>

      {/* Services accordion */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-28 md:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 reveal">
          <h2 className="font-display text-5xl font-extrabold tracking-tight md:text-7xl">What we do</h2>
          <p className="max-w-sm text-muted-foreground">One senior team, three disciplines — wired together so your product ships as a whole, not as disconnected parts.</p>
        </div>
        <div className="border-t-2 border-ink">
          {services.map((s) => (
            <div key={s.n} className="reveal group border-b-2 border-ink px-2 py-10 transition-colors duration-300 hover:bg-ink hover:text-paper md:px-6">
              <div className="flex items-center gap-6">
                <span className="font-mono text-sm text-primary">{s.n}</span>
                <h3 className="flex-1 font-display text-4xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-3 md:text-6xl">{s.title}</h3>
                <ArrowUpRight className="h-8 w-8 transition-transform duration-300 group-hover:rotate-45 group-hover:text-primary" />
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2 md:pl-12">
                <p className="text-xl">{s.text}</p>
                <ul className="space-y-2 font-mono text-sm">
                  {s.items.map((it) => <li key={it} className="flex gap-3"><span className="text-primary">→</span>{it}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why us — interactive tabs */}
      <section id="why-us" className="bg-ink py-28 text-paper">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">The GokuLabs advantage</p>
          <h2 className="mb-14 font-display text-5xl font-extrabold tracking-tight md:text-7xl">The GokuLabs Advantage</h2>
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
            <ol className="space-y-4">
              {why.map((w, i) => (
                <li key={w.title} className="reveal group flex gap-6 rounded-sm border border-paper/15 p-6 transition-colors hover:border-primary">
                  <span className="font-display text-5xl font-extrabold text-primary">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl font-bold md:text-3xl">{w.title}</h3>
                    <p className="mt-2 leading-relaxed text-paper/70">{w.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <aside className="reveal self-start rounded-sm bg-primary p-8 text-primary-foreground md:sticky md:top-28">
              <p className="font-mono text-xs uppercase tracking-widest opacity-80">Advantage</p>
              <ul className="mt-6 space-y-4 font-display text-3xl font-bold">
                <li>⚡ Faster Delivery</li>
                <li>◆ Smart Solutions</li>
                <li>▲ Built to Scale</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="words" className="mx-auto max-w-7xl px-5 py-28 md:px-8">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary reveal">Testimonials</p>
        <h2 className="mb-14 font-display text-5xl font-extrabold tracking-tight md:text-7xl reveal">Kind words, shipped products</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {quotes.map((q) => (
            <blockquote key={q.name} className="reveal flex flex-col justify-between rounded-sm border-2 border-ink bg-card p-8 shadow-[6px_6px_0_var(--ink)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--primary)]">
              <p className="text-lg leading-relaxed"><span className="font-display text-5xl leading-none text-primary">“</span>{q.q}</p>
              <footer className="mt-8 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-accent font-display font-bold">{q.name.split(" ").map((p) => p[0]).join("")}</span>
                <div>
                  <div className="font-semibold">{q.name}</div>
                  <div className="text-sm text-muted-foreground">{q.role}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-28 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-display text-6xl font-extrabold leading-[0.9] tracking-tighter md:text-8xl">Let's build something smart.</h2>
            <p className="mt-8 max-w-md text-lg opacity-90">Tell us what you're working on. You'll hear back from a real engineer — usually within one working day.</p>
            <dl className="mt-10 space-y-4 font-mono text-sm">
              <div><dt className="opacity-70">STUDIO</dt><dd>66 Paul Street, London</dd></div>
              <div><dt className="opacity-70">EMAIL</dt><dd><a className="underline underline-offset-4 hover:no-underline" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
            </dl>
          </div>
          <form onSubmit={onSubmit} className="space-y-8 self-end">
            {[{ n: "name", l: "Your name", t: "text" }, { n: "email", l: "Email", t: "email" }].map((f) => (
              <label key={f.n} className="block">
                <span className="font-mono text-xs uppercase tracking-widest opacity-80">{f.l}</span>
                <input required name={f.n} type={f.t} className="mt-2 w-full border-b-2 border-primary-foreground/50 bg-transparent py-3 text-2xl outline-none transition-colors placeholder:text-primary-foreground/40 focus:border-primary-foreground" />
              </label>
            ))}
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-widest opacity-80">Tell us about the project</span>
              <textarea required name="message" rows={3} className="mt-2 w-full resize-none border-b-2 border-primary-foreground/50 bg-transparent py-3 text-2xl outline-none focus:border-primary-foreground" />
            </label>
            <Magnetic>
              <button type="submit" className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-lg font-medium text-paper">
                Send it <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </button>
            </Magnetic>
          </form>
        </div>
      </section>

      <footer className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-5 pt-16 md:px-8">
          <div className="flex flex-wrap justify-between gap-4 font-mono text-xs uppercase tracking-widest text-paper/60">
            <span>66 Paul Street, London</span>
            <nav className="flex gap-6">
              {[["services", "Services"], ["why-us", "Why Us"], ["words", "Testimonials"], ["contact", "Contact"]].map(([id, l]) => (
                <a key={id} href={`#${id}`} className="hover:text-primary">{l}</a>
              ))}
            </nav>
            <span>© 2026 GokuLabs. All rights reserved.</span>
          </div>
          <div className="select-none pt-6 font-display text-[22vw] font-extrabold leading-[0.8] tracking-tighter text-paper/10 transition-colors duration-700 hover:text-primary md:text-[16rem]" data-hover>
            GokuLabs
          </div>
        </div>
      </footer>
    </div>
  );
}
