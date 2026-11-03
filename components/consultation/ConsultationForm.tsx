"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  ConsultationData,
  initialData,
  SOURCE_OPTIONS,
  CEREMONY_OPTIONS,
  VISION_OPTIONS,
  FABRIC_OPTIONS,
  STYLE_OPTIONS,
  BUDGET_OPTIONS,
  STEPS,
} from "@/lib/consultation";
import {
  TextField,
  TextArea,
  ChoiceGrid,
  ChipGroup,
  YesNo,
  OtherInput,
  FileDrop,
  ProgressBar,
} from "./fields";

type Errors = Record<string, string>;

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function ConsultationForm({
  onComplete,
}: {
  onComplete?: (data: ConsultationData) => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ConsultationData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof ConsultationData>(
    key: K,
    value: ConsultationData[K]
  ) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key as string]: "" }));
  };

  const toggle = (key: "ceremonyTypes" | "fabrics" | "styles", value: string) => {
    setData((d) => {
      const arr = d[key];
      return {
        ...d,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (!data.name.trim()) e.name = "Please tell us your name.";
      if (!data.email.trim()) e.email = "An email is required.";
      else if (!emailOk(data.email)) e.email = "That email doesn't look right.";
      if (!data.phone.trim()) e.phone = "A phone number is required.";
      if (!data.whatsapp.trim()) e.whatsapp = "A WhatsApp number is required.";
      if (!data.residence.trim()) e.residence = "Where are you based?";
      if (!data.source) e.source = "Let us know how you found us.";
    }
    if (s === 1) {
      if (!data.weddingDate) e.weddingDate = "Please choose your wedding date.";
      if (data.ceremonyTypes.length === 0)
        e.ceremonyTypes = "Select at least one ceremony type.";
      if (!data.colors.trim())
        e.colors = "Share the colors or palette you have in mind.";
    }
    if (s === 2) {
      if (!data.vision) e.vision = "Choose the vision that fits you best.";
      else if (data.vision === "Other" && !data.visionOther.trim())
        e.vision = "Please describe your vision.";
      if (data.fabrics.length === 0)
        e.fabrics = "Select at least one fabric (or 'Not Sure').";
      if (data.styles.length === 0)
        e.styles = "Select at least one style.";
    }
    if (s === 3) {
      if (!data.budget) e.budget = "Select a budget range.";
      if (!data.awareness) e.awareness = "Please answer this question.";
      if (!data.interested) e.interested = "Please answer this question.";
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (onComplete) {
      onComplete(data);
    } else {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (submitted) return <SuccessScreen name={data.name} />;

  const meta = STEPS[step];

  return (
    <div className="grid lg:grid-cols-[0.85fr_1.15fr] min-h-screen">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-[48px] text-bg overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#A85D34,#7E4526_60%,#3F2413)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_20%,rgba(214,168,116,0.25),rgba(214,168,116,0)_70%)]" />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-[10px]">
            <Logo size={30} color="#F1E7D3" />
            <div>
              <div className="font-serif text-[17px] font-medium tracking-[0.22em] leading-none">
                O_CUBED
              </div>
              <div className="text-[7.5px] tracking-[0.42em] text-clay-light mt-[3px]">
                FASHION HOUSE
              </div>
            </div>
          </Link>
        </div>

        <div className="relative max-w-[420px]">
          <div className="font-script text-[clamp(2.4rem,4vw,3.4rem)] leading-[1.1] text-clay-light mb-[18px]">
            Hi Bride-to-Be,
          </div>
          <p className="text-[15px] leading-[1.8] text-[rgba(251,246,238,0.9)] font-light mb-[18px]">
            Thank you for considering O_Cubed for your custom-made wedding dress.
            This short pre-consultation form helps us understand your vision,
            style, timeline, and budget — so we can make the most of our time
            together.
          </p>
          <p className="text-[13.5px] leading-[1.75] text-[rgba(251,246,238,0.7)] font-light">
            We design original gowns tailored to each bride. We&rsquo;re glad to
            draw inspiration from designs you love, but we never replicate another
            designer&rsquo;s work — we create something uniquely yours.
          </p>
        </div>

        <ol className="relative flex flex-col gap-[14px]">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex items-center gap-[12px]">
              <span
                className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-medium transition-colors ${
                  i === step
                    ? "bg-clay-light text-[#3F2413]"
                    : i < step
                    ? "bg-bg/30 text-bg"
                    : "bg-bg/10 text-[rgba(251,246,238,0.6)]"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span
                className={`text-[13.5px] ${
                  i === step
                    ? "text-bg"
                    : "text-[rgba(251,246,238,0.6)]"
                }`}
              >
                {s.title}
              </span>
            </li>
          ))}
        </ol>
      </aside>

      {/* Form panel */}
      <main className="bg-cream2/40 px-[clamp(20px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
        <div className="max-w-[620px] mx-auto">
          {/* mobile brand row */}
          <div className="lg:hidden flex items-center justify-between mb-[24px]">
            <Link href="/" className="inline-flex items-center gap-[8px]">
              <Logo size={24} />
              <span className="font-serif text-[15px] tracking-[0.22em]">
                O_CUBED
              </span>
            </Link>
            <Link href="/" className="text-[12px] text-muted hover:text-rust">
              ← Site
            </Link>
          </div>

          <ProgressBar current={step} total={STEPS.length} />

          <div className="mt-[26px] mb-[24px]">
            <h1 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] text-ink leading-tight">
              {meta.title}
            </h1>
            <p className="text-[13.5px] text-muted mt-[4px]">{meta.subtitle}</p>
          </div>

          {/* Steps */}
          <div key={step} className="flex flex-col gap-[20px] animate-[fadeIn_.4s_ease]">
            {step === 0 && (
              <>
                <TextField
                  label="Name"
                  required
                  value={data.name}
                  onChange={(v) => set("name", v)}
                  error={errors.name}
                  placeholder="Your full name"
                />
                <TextField
                  label="Email"
                  required
                  type="email"
                  value={data.email}
                  onChange={(v) => set("email", v)}
                  error={errors.email}
                  placeholder="you@email.com"
                />
                <div className="grid sm:grid-cols-2 gap-[16px]">
                  <TextField
                    label="Phone number"
                    required
                    type="tel"
                    value={data.phone}
                    onChange={(v) => set("phone", v)}
                    error={errors.phone}
                    placeholder="+234…"
                  />
                  <TextField
                    label="WhatsApp number"
                    required
                    type="tel"
                    value={data.whatsapp}
                    onChange={(v) => set("whatsapp", v)}
                    error={errors.whatsapp}
                    placeholder="+234…"
                  />
                </div>
                <TextField
                  label="City / Country of residence"
                  required
                  value={data.residence}
                  onChange={(v) => set("residence", v)}
                  error={errors.residence}
                  placeholder="e.g. Lagos, Nigeria"
                />
                <ChoiceGrid
                  label="How did you find us?"
                  required
                  columns={3}
                  options={SOURCE_OPTIONS.map((v) => ({ value: v }))}
                  value={data.source}
                  onChange={(v) => set("source", v)}
                  error={errors.source}
                />
              </>
            )}

            {step === 1 && (
              <>
                <TextField
                  label="When is your wedding date?"
                  required
                  type="date"
                  value={data.weddingDate}
                  onChange={(v) => set("weddingDate", v)}
                  error={errors.weddingDate}
                />
                <ChipGroup
                  label="Ceremony type"
                  required
                  options={CEREMONY_OPTIONS}
                  values={data.ceremonyTypes}
                  onToggle={(v) => toggle("ceremonyTypes", v)}
                  error={errors.ceremonyTypes}
                />
                <TextArea
                  label="Do you have specific colors or a palette in mind?"
                  required
                  value={data.colors}
                  onChange={(v) => set("colors", v)}
                  error={errors.colors}
                  placeholder="e.g. ivory with champagne accents, blush tones…"
                />
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <ChoiceGrid
                    label="What is your vision for your bridal look?"
                    required
                    options={[
                      ...VISION_OPTIONS,
                      { value: "Other", desc: "Something else entirely." },
                    ]}
                    value={data.vision}
                    onChange={(v) => set("vision", v)}
                    error={errors.vision}
                  />
                  <OtherInput
                    show={data.vision === "Other"}
                    value={data.visionOther}
                    onChange={(v) => set("visionOther", v)}
                    placeholder="Describe your vision…"
                  />
                </div>
                <div>
                  <ChipGroup
                    label="Preferred fabrics"
                    required
                    options={[...FABRIC_OPTIONS, "Other"]}
                    values={data.fabrics}
                    onToggle={(v) => toggle("fabrics", v)}
                    error={errors.fabrics}
                  />
                  <OtherInput
                    show={data.fabrics.includes("Other")}
                    value={data.fabricsOther}
                    onChange={(v) => set("fabricsOther", v)}
                    placeholder="Which other fabric?"
                  />
                </div>
                <div>
                  <ChipGroup
                    label="Bridal styles you're drawn to"
                    required
                    options={[...STYLE_OPTIONS, "Other"]}
                    values={data.styles}
                    onToggle={(v) => toggle("styles", v)}
                    error={errors.styles}
                  />
                  <OtherInput
                    show={data.styles.includes("Other")}
                    value={data.stylesOther}
                    onChange={(v) => set("stylesOther", v)}
                    placeholder="Describe the style…"
                  />
                </div>
                <FileDrop
                  label="Inspiration images or mood boards (optional)"
                  files={data.inspiration}
                  onFiles={(names) => set("inspiration", names)}
                  onRemove={(name) =>
                    set(
                      "inspiration",
                      data.inspiration.filter((n) => n !== name)
                    )
                  }
                />
              </>
            )}

            {step === 3 && (
              <>
                <ChoiceGrid
                  label="What is your budget range for your custom wedding dress?"
                  required
                  options={BUDGET_OPTIONS.map((v) => ({ value: v }))}
                  value={data.budget}
                  onChange={(v) => set("budget", v)}
                  error={errors.budget}
                />
                <TextArea
                  label="What would make your experience with O_Cubed exceptional? (optional)"
                  value={data.exceptional}
                  onChange={(v) => set("exceptional", v)}
                  placeholder="Anything that would make this feel special…"
                />
                <div className="rounded-[12px] border border-ink/10 bg-bg p-[16px]">
                  <p className="text-[13px] text-muted leading-[1.6] mb-[14px]">
                    We do not replicate other designers&rsquo; work, but we can
                    draw inspiration from them to create something uniquely
                    yours.
                  </p>
                  <YesNo
                    label="Are you aware of and comfortable with this?"
                    required
                    value={data.awareness}
                    onChange={(v) => set("awareness", v)}
                    error={errors.awareness}
                  />
                </div>
                <YesNo
                  label="Knowing the above, would you be interested in working with us?"
                  required
                  value={data.interested}
                  onChange={(v) => set("interested", v)}
                  error={errors.interested}
                />
              </>
            )}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-[32px] pt-[20px] border-t border-ink/10">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className={`text-[13px] tracking-[0.1em] uppercase transition-colors ${
                step === 0
                  ? "text-muted/40 cursor-not-allowed"
                  : "text-ink hover:text-rust"
              }`}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={next}
              className="bg-rust text-bg text-[13px] tracking-[0.16em] uppercase px-[26px] py-[13px] rounded-[10px] hover:bg-rust-dark transition-colors"
            >
              {step === STEPS.length - 1 ? "Submit" : "Continue →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SuccessScreen({ name }: { name: string }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center px-[24px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#A85D34,#7E4526_62%,#3F2413)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(214,168,116,0.25),rgba(214,168,116,0)_70%)]" />
      <div className="relative max-w-[560px] text-bg">
        <Logo size={54} color="#F1E7D3" />
        <div className="font-script text-[clamp(2.6rem,6vw,4rem)] text-clay-light mt-[18px] mb-[10px]">
          Thank you{name ? `, ${name.split(" ")[0]}` : ""}
        </div>
        <h1 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-medium mb-[16px]">
          Your consultation request is in.
        </h1>
        <p className="text-[15px] leading-[1.8] text-[rgba(251,246,238,0.85)] font-light mb-[32px]">
          We&rsquo;ve received your vision and will reach out shortly to schedule
          your bridal consultation. In the meantime, we can&rsquo;t wait to start
          dreaming up something uniquely yours.
        </p>
        <Link
          href="/"
          className="inline-block bg-clay text-[#3A2213] text-[13px] tracking-[0.18em] uppercase px-[30px] py-[15px] rounded-[10px] hover:bg-clay-hover transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
