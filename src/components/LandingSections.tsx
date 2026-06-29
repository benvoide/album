"use client";

import { motion, useReducedMotion } from "motion/react";

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function FadeInCard({
  children,
  delay,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  const reduce = useReducedMotion();
  return (
    <section className="relative grid min-h-[100dvh] grid-cols-1 items-center gap-12 px-4 pt-24 md:grid-cols-2 md:px-10 lg:px-16">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="z-10"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--primary-muted)]">
          Private photo albums
        </p>
        <h1 className="mt-4 text-4xl font-medium leading-[1.1] tracking-tight text-[var(--foreground)] md:text-5xl lg:text-6xl">
          Your photos,
          <br />
          <span className="italic text-[var(--primary)]">your rules.</span>
        </h1>
        <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-[var(--primary-muted)]">
          A quiet space for your memories. Share exactly what you want, with who
          you want.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <motion.a
            href="/signup"
            whileHover={reduce ? undefined : { scale: 1.02 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
          >
            Get started
          </motion.a>
          <motion.a
            href="/login"
            whileHover={reduce ? undefined : { scale: 1.02 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className="inline-flex items-center justify-center rounded-full border border-[var(--accent-warm)] px-7 py-3.5 text-sm font-medium text-[var(--foreground)] transition-all hover:bg-[var(--accent-warm)]/60"
          >
            Sign in
          </motion.a>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden md:block"
      >
        <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[var(--accent-warm)]/40">
          <img
            src="https://picsum.photos/seed/album-memories/800/600"
            alt=""
            className="h-full w-full object-cover opacity-80 mix-blend-multiply dark:mix-blend-screen"
          />
        </div>
        <div className="absolute -bottom-6 -left-6 aspect-[3/2] w-3/5 overflow-hidden rounded-2xl bg-[var(--accent-warm)]/40 shadow-lg">
          <img
            src="https://picsum.photos/seed/album-moments/600/400"
            alt=""
            className="h-full w-full object-cover opacity-80 mix-blend-multiply dark:mix-blend-screen"
          />
        </div>
      </motion.div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      title: "Private by default",
      body: "Every album starts private. You choose when and who to share with.",
      bg: "linear-gradient(135deg, rgba(154,176,164,0.15), rgba(154,176,164,0.04))",
    },
    {
      title: "Share without accounts",
      body: "Share a link. No sign-up needed for viewers. Just memories.",
      bg: "linear-gradient(135deg, rgba(212,168,168,0.15), rgba(212,168,168,0.04))",
    },
    {
      title: "Organize your way",
      body: "Reorder, caption, curate. Your albums, your sequence.",
      bg: "linear-gradient(135deg, rgba(184,205,192,0.15), rgba(184,205,192,0.04))",
    },
    {
      title: "No algorithms",
      body: "No feeds, no likes, no recommendations. Just your photos.",
      bg: "linear-gradient(135deg, rgba(236,232,227,0.6), rgba(236,232,227,0.15))",
    },
  ];

  return (
    <Reveal className="px-4 py-32 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <FadeInCard
              key={f.title}
              delay={i * 0.08}
              className="rounded-3xl p-8 transition-all hover:shadow-sm"
              style={{ background: f.bg }}
            >
              <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--primary-muted)]">
                {f.body}
              </p>
            </FadeInCard>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Create an album",
      body: "Give it a name and a privacy level. Public, private, or link-only.",
    },
    {
      number: "02",
      title: "Add your photos",
      body: "Upload from any device. Drag to reorder. Add captions if you want.",
    },
    {
      number: "03",
      title: "Share your way",
      body: "Send a link. Set an expiry. Revoke access anytime.",
    },
  ];

  return (
    <Reveal className="px-4 py-32 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--primary)]">
                Step {s.number}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--primary-muted)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function CtaSection() {
  const reduce = useReducedMotion();
  return (
    <Reveal className="px-4 py-32 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <div
          className="rounded-3xl px-8 py-20 text-center md:px-20"
          style={{ background: "linear-gradient(135deg, rgba(154,176,164,0.1), rgba(154,176,164,0.03))" }}
        >
          <h2 className="text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
            Ready to start your album?
          </h2>
          <p className="mx-auto mt-4 max-w-[40ch] text-[var(--primary-muted)]">
            No algorithms. No feeds. Just your memories, your way.
          </p>
          <motion.a
            href="/signup"
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
          >
            Get started
          </motion.a>
        </div>
      </div>
    </Reveal>
  );
}