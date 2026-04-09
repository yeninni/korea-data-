import { statusStyles } from "../utils/lockerUtils";

export default function StatusBadge({ status, t }) {
  const style = statusStyles[status];

  return (
    <span
      className={`inline-flex min-w-[96px] shrink-0 items-center justify-center rounded-full px-3 py-1 text-center font-display text-sm font-semibold leading-tight ring-1 ${style.badge}`}
    >
      {t[style.labelKey]}
    </span>
  );
}
