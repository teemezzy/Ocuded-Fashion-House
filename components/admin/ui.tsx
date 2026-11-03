/* Shared presentational building blocks for the admin panel. */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-[16px] mb-[24px]">
      <div>
        <h1 className="font-serif text-[28px] text-ink leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-[13.5px] text-muted mt-[4px]">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg border border-ink/10 rounded-[12px] ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block text-[11px] px-[10px] py-[4px] rounded-full whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-rust text-bg hover:bg-rust-dark"
      : variant === "danger"
      ? "bg-transparent text-rust hover:bg-rust/10 border border-rust/40"
      : "bg-transparent text-ink hover:bg-ink/5 border border-ink/15";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-[12.5px] tracking-[0.12em] uppercase px-[18px] py-[10px] rounded-[8px] transition-colors ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

/* Simple label + control wrapper */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-ink mb-[6px]">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[12px] text-muted mt-[5px]">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full bg-bg border border-ink/15 rounded-[9px] px-[12px] py-[10px] text-[14px] text-ink outline-none transition-colors focus:border-rust focus:ring-2 focus:ring-rust/20";

/* Accessible on/off switch */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[24px] w-[44px] shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-rust" : "bg-ink/20"
      }`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-bg transition-transform ${
          checked ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
