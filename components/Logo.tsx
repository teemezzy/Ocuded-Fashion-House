export default function Logo({
  size = 26,
  color = "#A85D34",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="28" r="17" stroke={color} strokeWidth="6" />
      <circle cx="36" cy="66" r="14" fill={color} />
      <circle cx="64" cy="66" r="14" fill={color} />
    </svg>
  );
}
