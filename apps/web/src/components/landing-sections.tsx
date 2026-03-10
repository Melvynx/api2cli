"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── OPENCLAW SECTION ─── */
export function OpenClawSection() {
  const { ref, inView } = useInView(0.1);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveStep((s) => {
        if (s >= 2) {
          clearInterval(interval);
          return 2;
        }
        return s + 1;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [inView]);

  const steps = [
    {
      cmd: "$ api2cli create stripe",
      output: "✓ Scaffolded stripe-cli with 47 resources",
      label: "Scaffold",
    },
    {
      cmd: "$ api2cli bundle stripe",
      output: "✓ Built to 4.2KB — zero dependencies",
      label: "Build",
    },
    {
      cmd: "$ api2cli link stripe",
      output: "✓ stripe-cli available globally",
      label: "Deploy",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-border/30 py-28 md:py-36"
    >
      {/* Background claw marks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-20 top-1/2 -translate-y-1/2 text-[28rem] font-black leading-none opacity-[0.02]"
          style={{ fontFamily: "var(--font-geist-pixel-square)" }}
        >
          🦀
        </div>
        <div
          className="absolute -left-10 top-10 h-[600px] w-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(213,71,71,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left: Copy */}
          <div
            className={`transition-all duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D54747]/30 bg-[#D54747]/5 px-3 py-1">
              <span className="text-sm">🦀</span>
              <span className="font-mono text-xs text-[#D54747]">
                OpenClaw Integration
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-geist-pixel-square)] text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Add any tool to
              <br />
              <span className="bg-gradient-to-r from-[#D54747] to-[#FF8A65] bg-clip-text text-transparent">
                your OpenClaw
              </span>
              <br />
              in 2 seconds.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Connect to any API on the planet. Transform it into an
              agent-ready CLI. Make your OpenClaw so powerful it scares
              your competitors.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  <strong className="text-foreground">200+</strong> APIs
                  supported
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#D54747]" />
                <span>
                  <strong className="text-foreground">~5KB</strong> per CLI
                </span>
              </div>
            </div>

            <Link
              href="/docs/openclaw"
              className="mt-6 inline-flex items-center gap-1.5 font-mono text-sm text-[#D54747] transition-opacity hover:opacity-80"
            >
              View OpenClaw docs
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Right: Terminal animation */}
          <div
            className={`transition-all delay-300 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
          >
            <div className="relative">
              {/* Glow behind terminal */}
              <div
                className="absolute -inset-8 rounded-3xl opacity-40"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(213,71,71,0.12) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#0a0a0a]">
                {/* Terminal header */}
                <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 font-mono text-xs text-white/30">
                    terminal — zsh
                  </span>
                </div>

                {/* Terminal body */}
                <div className="space-y-1 p-5 font-mono text-sm">
                  {steps.map((step, i) => (
                    <div
                      key={step.label}
                      className={`transition-all duration-500 ${i <= activeStep ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                      style={{ transitionDelay: `${i * 150}ms` }}
                    >
                      <div className="text-white/60">{step.cmd}</div>
                      {i <= activeStep && (
                        <div
                          className={`mb-3 transition-opacity duration-300 ${i < activeStep ? "text-emerald-400/80" : "landing-terminal-blink text-emerald-400"}`}
                        >
                          {step.output}
                        </div>
                      )}
                    </div>
                  ))}

                  {activeStep === 2 && (
                    <div className="mt-4 animate-fade-in rounded-lg border border-[#D54747]/20 bg-[#D54747]/5 p-3">
                      <div className="text-xs text-[#D54747]">
                        ✦ Your OpenClaw just got 47 new superpowers.
                      </div>
                    </div>
                  )}
                </div>

                {/* Step indicators */}
                <div className="flex gap-1 border-t border-white/5 px-5 py-3">
                  {steps.map((step, i) => (
                    <button
                      key={step.label}
                      onClick={() => setActiveStep(i)}
                      className={`rounded-full px-3 py-1 font-mono text-xs transition-all ${
                        i === activeStep
                          ? "bg-[#D54747]/20 text-[#D54747]"
                          : "text-white/20 hover:text-white/40"
                      }`}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CLI > MCP SECTION ─── */
export function CliVsMcpSection() {
  const { ref, inView } = useInView(0.1);

  const mcpProblems = [
    {
      icon: "💀",
      title: "Connection Nightmares",
      desc: "WebSocket drops, stdio crashes, reconnection loops. Your agent stalls while MCP plays dead.",
    },
    {
      icon: "🐌",
      title: "Startup Tax: ~800ms",
      desc: "Every. Single. Call. Cold starts, handshakes, capability negotiation. Your agent waits. Your users leave.",
    },
    {
      icon: "🔒",
      title: "Vendor Prison",
      desc: "Tied to one IDE. Tied to one runtime. Tied to one protocol version. No escape.",
    },
    {
      icon: "🤮",
      title: "Token Obesity",
      desc: "Tool schemas, capability lists, protocol overhead. MCPs eat tokens like they're free. They're not.",
    },
  ];

  const cliWins = [
    {
      metric: "~25ms",
      label: "Startup",
      detail: "Native binary speed",
    },
    {
      metric: "0",
      label: "Dependencies",
      detail: "Single file, self-contained",
    },
    {
      metric: "∞",
      label: "Compatibility",
      detail: "Works everywhere, forever",
    },
    {
      metric: "100%",
      label: "Reliability",
      detail: "No connections to drop",
    },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-36">
      {/* Diagonal slash bg */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-0 top-0 h-full w-full opacity-[0.015]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 80px,
              currentColor 80px,
              currentColor 81px
            )`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <span className="font-mono text-xs text-muted-foreground">
              MCP is dead.
            </span>
            <span className="font-mono text-xs text-[#D54747]">
              Long live CLI.
            </span>
          </div>

          <h2 className="font-[family-name:var(--font-geist-pixel-square)] text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            CLI beats MCP.
            <br />
            <span className="text-muted-foreground/40">
              Not even close.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            MCP was a nice experiment. But experiments end. Production
            systems need reliability, speed, and universality. CLI delivers
            all three.
          </p>
        </div>

        {/* MCP Graveyard */}
        <div
          className={`mt-16 transition-all delay-200 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
        >
          <div className="mb-3 font-mono text-xs tracking-wider text-muted-foreground/40 uppercase">
            Why MCP fails you
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {mcpProblems.map((problem) => (
              <div
                key={problem.title}
                className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/30 p-5 transition-all hover:border-destructive/30 hover:bg-destructive/[0.02]"
              >
                <div className="absolute -right-4 -top-4 text-5xl opacity-[0.06] transition-opacity group-hover:opacity-[0.12]">
                  {problem.icon}
                </div>
                <div className="relative">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-lg">{problem.icon}</span>
                    <h3 className="font-mono text-sm font-semibold">
                      {problem.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground/70">
                    {problem.desc}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-destructive/40 via-destructive/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

        {/* VS Divider */}
        <div className="relative my-16 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="landing-vs-pulse relative rounded-full border-2 border-[#D54747]/40 bg-background px-6 py-2">
            <span className="font-[family-name:var(--font-geist-pixel-square)] text-lg font-bold text-[#D54747]">
              VS
            </span>
          </div>
        </div>

        {/* CLI Wins */}
        <div
          className={`transition-all delay-400 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
        >
          <div className="mb-3 font-mono text-xs tracking-wider text-emerald-500/60 uppercase">
            Why CLI wins
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {cliWins.map((win) => (
              <div
                key={win.label}
                className="group rounded-xl border border-border/40 bg-card/30 p-5 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]"
              >
                <div className="font-[family-name:var(--font-geist-pixel-square)] text-2xl font-bold text-foreground md:text-3xl">
                  {win.metric}
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-emerald-500">
                  {win.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground/60">
                  {win.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div
          className={`mt-16 overflow-hidden rounded-2xl border border-border/40 transition-all delay-500 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-card/40">
                <th className="px-6 py-4 text-left font-mono text-xs tracking-wider text-muted-foreground/50 uppercase">
                  Feature
                </th>
                <th className="px-6 py-4 text-center font-mono text-xs tracking-wider text-[#D54747]/70 uppercase line-through">
                  MCP
                </th>
                <th className="px-6 py-4 text-center font-mono text-xs tracking-wider text-emerald-500/80 uppercase">
                  CLI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {[
                ["Startup time", "~800ms", "~25ms"],
                ["Connection", "WebSocket/stdio", "None needed"],
                ["Dependencies", "Runtime + SDK", "Zero"],
                ["Works offline", "Nope", "Always"],
                ["IDE lock-in", "Yes", "Never"],
                ["Token overhead", "~2K per call", "~200"],
                ["Debugging", "Good luck", "Just read stdout"],
                ["Agent discovery", "Manual config", "Natural"],
              ].map(([feature, mcp, cli]) => (
                <tr
                  key={feature}
                  className="transition-colors hover:bg-card/20"
                >
                  <td className="px-6 py-3 font-medium text-foreground/80">
                    {feature}
                  </td>
                  <td className="px-6 py-3 text-center font-medium text-[#D54747]/70">
                    {mcp}
                  </td>
                  <td className="px-6 py-3 text-center font-medium text-emerald-400">
                    {cli}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── CLI IS THE NEW SKILL ─── */
export function CliIsNewSkillSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border/30 py-28 md:py-36"
    >
      {/* Gradient bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(213,71,71,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-16 lg:grid-cols-5">
          {/* Left: Main copy (3 cols) */}
          <div
            className={`lg:col-span-3 transition-all duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1">
              <span className="text-sm">⚡</span>
              <span className="font-mono text-xs text-amber-400">
                The paradigm shift
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-geist-pixel-square)] text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              CLI is the
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-[#D54747] bg-clip-text text-transparent">
                new Skill.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Agent Skills were a breakthrough. But they have limits. CLIs
              inherit everything skills do — and fix everything they don't.
            </p>

            <div className="mt-10 space-y-6">
              {[
                {
                  title: "Natural Discovery",
                  desc: "Models are pre-trained on CLI patterns. They know how to find, invoke, and chain CLIs without instruction. Zero-shot, out of the box.",
                  icon: "🧠",
                },
                {
                  title: "Token Efficient",
                  desc: "Skills dump entire instruction sets into context. CLIs use --help. 50x less tokens per interaction. Your wallet will thank you.",
                  icon: "🪶",
                },
                {
                  title: "No Connection Issues",
                  desc: "Skills need MCP bridges, SDK wrappers, or API keys baked in. CLIs are self-contained executables. Run anywhere. Break never.",
                  icon: "🔌",
                },
                {
                  title: "Composable by Nature",
                  desc: "Pipe output. Chain commands. Parse with jq. CLIs speak Unix. Every tool ever built is already compatible.",
                  icon: "🔗",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className={`group flex gap-4 transition-all duration-700 ${inView ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
                  style={{ transitionDelay: `${300 + i * 150}ms` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-card/40 text-lg transition-colors group-hover:border-[#D54747]/30 group-hover:bg-[#D54747]/5">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground/70">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual comparison (2 cols) */}
          <div
            className={`lg:col-span-2 transition-all delay-300 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
          >
            {/* Skill card - struck through */}
            <div className="relative mb-4 overflow-hidden rounded-xl border border-[#D54747]/30 bg-[#D54747]/[0.03] p-5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-px w-[140%] -rotate-12 bg-[#D54747]/50" />
              </div>
              <div className="relative">
                <div className="mb-3 font-mono text-xs text-[#D54747] uppercase">
                  Old way: Agent Skill
                </div>
                <pre className="overflow-x-auto rounded-lg bg-[#0a0a0a] p-3 font-mono text-xs text-[#D54747]/60">
{`# SKILL.md — 847 lines
# Loaded into context every call
# ~12,000 tokens consumed

## Setup Instructions
1. Install dependencies...
2. Configure API keys...
3. Set environment vars...
4. Hope MCP connects...`}
                </pre>
                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-[#D54747]/10 px-2 py-0.5 font-mono text-xs text-[#D54747]">
                    12K tokens/call
                  </span>
                  <span className="rounded bg-[#D54747]/10 px-2 py-0.5 font-mono text-xs text-[#D54747]">
                    Fragile
                  </span>
                </div>
              </div>
            </div>

            {/* CLI card - highlighted */}
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-5">
              <div className="mb-3 font-mono text-xs text-emerald-500 uppercase">
                New way: CLI
              </div>
              <pre className="overflow-x-auto rounded-lg bg-[#0a0a0a] p-3 font-mono text-xs text-emerald-400/90">
{`$ stripe-cli --help
Usage: stripe-cli <command>

Commands:
  list     List resources
  get      Get a resource
  create   Create a resource

$ stripe-cli list customers
# Just works. 200 tokens.`}
              </pre>
              <div className="mt-3 flex gap-2">
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-400">
                  ~200 tokens
                </span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-400">
                  Bulletproof
                </span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-400">
                  Universal
                </span>
              </div>
            </div>

            {/* Token savings callout */}
            <div className="mt-6 rounded-xl border border-border/30 bg-card/20 p-5 text-center">
              <div className="font-[family-name:var(--font-geist-pixel-square)] text-4xl font-bold text-foreground">
                60x
              </div>
              <div className="mt-1 font-mono text-sm text-[#D54747]">
                fewer tokens per interaction
              </div>
              <div className="mt-2 text-xs text-muted-foreground/50">
                Your CFO will send you flowers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
export function HowItWorksSection() {
  const { ref, inView } = useInView(0.1);

  const steps = [
    {
      num: "01",
      title: "Tell your agent",
      desc: "Just say: \"Create a CLI for the Stripe API.\" Your agent uses the api2cli skill to scaffold everything.",
      code: '> "Create a CLI for the Stripe API"',
    },
    {
      num: "02",
      title: "Agent builds it",
      desc: "api2cli reads the API docs, generates typed resources, authentication, error handling. All standardized.",
      code: "✓ 47 resources · 142 commands · typed",
    },
    {
      num: "03",
      title: "Use it everywhere",
      desc: "The CLI works in any terminal, any agent, any IDE. It's just a binary. No setup, no config, no drama.",
      code: "$ stripe-cli list invoices --status=paid",
    },
  ];

  return (
    <section ref={ref} className="relative py-28 md:py-36">
      <div className="relative mx-auto max-w-6xl px-6">
        <div
          className={`mx-auto mb-16 max-w-2xl text-center transition-all duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
        >
          <h2 className="font-[family-name:var(--font-geist-pixel-square)] text-3xl font-bold tracking-tight md:text-4xl">
            Three steps.
            <br />
            <span className="text-muted-foreground/40">
              That's literally it.
            </span>
          </h2>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border/40 to-transparent md:block" />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`relative transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
              style={{ transitionDelay: `${200 + i * 200}ms` }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D54747]/30 bg-[#D54747]/10 font-[family-name:var(--font-geist-pixel-square)] text-sm font-bold text-[#D54747]">
                  {step.num}
                </div>
                <h3 className="font-mono text-lg font-semibold">
                  {step.title}
                </h3>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground/70">
                {step.desc}
              </p>
              <div className="rounded-lg border border-border/30 bg-[#0a0a0a] px-4 py-3 font-mono text-xs text-muted-foreground/60">
                {step.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── UNIVERSAL COMPATIBILITY ─── */
export function UniversalSection() {
  const { ref, inView } = useInView(0.1);

  const platforms = [
    "Claude Code",
    "Cursor",
    "Windsurf",
    "VS Code",
    "Cline",
    "Aider",
    "Continue",
    "Copilot",
    "Warp",
    "iTerm",
    "Zed",
    "JetBrains",
    "Neovim",
    "Emacs",
    "Any Terminal",
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border/30 py-28 md:py-36"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
        >
          <h2 className="font-[family-name:var(--font-geist-pixel-square)] text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Works with{" "}
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              everything.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            If it has a terminal, it runs your CLI. No plugins. No
            extensions. No configuration files. Just works.
          </p>
        </div>

        <div
          className={`mt-14 flex flex-wrap items-center justify-center gap-3 transition-all delay-200 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {platforms.map((platform, i) => (
            <div
              key={platform}
              className="landing-platform-tag rounded-full border border-border/40 bg-card/30 px-4 py-2 font-mono text-sm text-muted-foreground transition-all hover:border-[#D54747]/30 hover:bg-[#D54747]/5 hover:text-foreground"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {platform}
            </div>
          ))}
        </div>

        <div
          className={`mx-auto mt-12 max-w-md text-center transition-all delay-400 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <div className="inline-flex items-center gap-3 rounded-xl border border-border/30 bg-card/20 px-6 py-4">
            <span className="font-mono text-2xl font-bold text-foreground">
              15+
            </span>
            <span className="text-left text-sm text-muted-foreground">
              agent platforms
              <br />
              <span className="text-muted-foreground/50">
                and counting
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL CTA ─── */
const CTA_CMD = "npx skills add melvynx/api2cli";

export function FinalCtaSection() {
  const { ref, inView } = useInView(0.1);
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText(CTA_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={ref}
      className="py-16 md:py-20"
    >
      <div className="mx-auto max-w-md px-6 text-center">
        <div
          className={`transition-all duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
        >
          <div className="space-y-4">
            <div className="flex gap-3">
              <Link
                href="/docs/getting-started"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-[#D54747] font-mono text-sm font-semibold text-white transition-all hover:bg-[#c03d3d] hover:shadow-lg hover:shadow-[#D54747]/20"
              >
                Create my first CLI
              </Link>
              <Link
                href="#cli"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-border bg-card/60 font-mono text-sm font-medium transition-colors hover:bg-card"
              >
                Browse registry
              </Link>
            </div>

            <button
              onClick={copyCommand}
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/20 px-5 py-3.5 font-mono text-sm transition-all hover:border-[#D54747]/30 hover:bg-card/40"
            >
              <span className="text-muted-foreground/40">$</span>
              <span>{CTA_CMD}</span>
              <span className="rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground transition-colors group-hover:bg-[#D54747]/10 group-hover:text-[#D54747]">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
