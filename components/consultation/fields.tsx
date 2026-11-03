"use client";

/* Reusable, brand-styled form primitives for the consultation wizard. */

const inputBase =
  "w-full bg-bg border rounded-[10px] px-[14px] py-[12px] text-[14px] text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-rust focus:ring-2 focus:ring-rust/20";

export function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[13px] font-medium text-ink mb-[8px]">
      {children}
      {required && <span className="text-rust"> *</span>}
    </label>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[12px] text-rust mt-[6px]">{msg}</p>;
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} ${error ? "border-rust" : "border-ink/15"}`}
      />
      <FieldError msg={error} />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} resize-none ${
          error ? "border-rust" : "border-ink/15"
        }`}
      />
      <FieldError msg={error} />
    </div>
  );
}

/* Single-select tiles */
export function ChoiceGrid({
  label,
  options,
  value,
  onChange,
  required,
  error,
  columns = 2,
}: {
  label: string;
  options: { value: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  columns?: 1 | 2 | 3;
}) {
  const cols =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className={`grid ${cols} gap-[10px]`}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`text-left rounded-[12px] border px-[16px] py-[13px] transition-all ${
                active
                  ? "border-rust bg-rust/[0.06] ring-2 ring-rust/20"
                  : "border-ink/15 bg-bg hover:border-rust/50"
              }`}
            >
              <div className="text-[14px] font-medium text-ink">{opt.value}</div>
              {opt.desc && (
                <div className="text-[12px] text-muted mt-[3px] leading-snug">
                  {opt.desc}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

/* Multi-select chips */
export function ChipGroup({
  label,
  options,
  values,
  onToggle,
  required,
  error,
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="flex flex-wrap gap-[8px]">
        {options.map((opt) => {
          const active = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`rounded-full border px-[14px] py-[8px] text-[13px] transition-all ${
                active
                  ? "border-rust bg-rust text-bg"
                  : "border-ink/20 bg-bg text-ink hover:border-rust/50"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

/* Yes / No toggle */
export function YesNo({
  label,
  value,
  onChange,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: "YES" | "NO") => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="flex gap-[10px]">
        {(["YES", "NO"] as const).map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`flex-1 rounded-[10px] border px-[16px] py-[12px] text-[14px] font-medium transition-all ${
                active
                  ? "border-rust bg-rust text-bg"
                  : "border-ink/15 bg-bg text-ink hover:border-rust/50"
              }`}
            >
              {opt === "YES" ? "Yes" : "No"}
            </button>
          );
        })}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

/* Optional inline "Other" text input */
export function OtherInput({
  show,
  value,
  onChange,
  placeholder = "Tell us more…",
}: {
  show: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  if (!show) return null;
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} border-ink/15 mt-[10px]`}
    />
  );
}

/* File selection (no upload — stores names in state) */
export function FileDrop({
  label,
  files,
  onFiles,
  onRemove,
  max = 5,
}: {
  label: string;
  files: string[];
  onFiles: (names: string[]) => void;
  onRemove: (name: string) => void;
  max?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <label className="block cursor-pointer rounded-[12px] border border-dashed border-ink/25 bg-bg px-[16px] py-[22px] text-center transition-colors hover:border-rust hover:bg-rust/[0.03]">
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []).map((f) => f.name);
            onFiles(picked.slice(0, max));
          }}
        />
        <div className="text-[14px] text-ink">
          Drop images here or{" "}
          <span className="text-rust underline">browse</span>
        </div>
        <div className="text-[12px] text-muted mt-[4px]">
          Up to {max} files · inspiration & mood boards
        </div>
      </label>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-[8px] mt-[10px]">
          {files.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-[8px] rounded-full bg-cream2 border border-ink/10 px-[12px] py-[6px] text-[12px] text-ink"
            >
              <span className="max-w-[160px] truncate">{name}</span>
              <button
                type="button"
                onClick={() => onRemove(name)}
                aria-label={`Remove ${name}`}
                className="text-muted hover:text-rust"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* Animated step progress bar */
export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-[8px]">
        <span className="text-[11px] tracking-[0.18em] uppercase text-label">
          Step {current + 1} of {total}
        </span>
        <span className="text-[11px] text-muted">{pct}%</span>
      </div>
      <div className="h-[6px] w-full rounded-full bg-ink/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-rust transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
