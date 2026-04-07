import { statusStyles } from "../utils/lockerUtils";

export default function StatusBadge({ status, t }) {
  const style = statusStyles[status];

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ring-1 ${style.badge}`}>
      {t[style.labelKey]}
    </span>
  );
}
