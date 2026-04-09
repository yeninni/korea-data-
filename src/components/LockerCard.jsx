import Icon from "./Icon";
import StatusBadge from "./StatusBadge";
import { formatDistrict, formatDuration, formatLandmark, formatLockerName } from "../utils/lockerUtils";

export default function LockerCard({ locker, t, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(locker)}
      className={`focus-ring w-full rounded-[1.75rem] bg-white p-5 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-civic ${
        selected ? "ring-2 ring-civic-500" : "ring-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-xl tracking-tight text-slate-950">
            {formatLockerName(locker, t)}
          </h3>
          <p className="mt-1 font-soft text-sm text-slate-500">
            {formatLandmark(locker.nearbyLandmark, t)} · {formatDistrict(locker.district, t)}
          </p>
        </div>
        <StatusBadge status={locker.availabilityStatus} t={t} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-civic-50 p-3">
          <span className="block text-slate-500">{t.availableUnits}</span>
          <strong className="mt-1 block font-display text-lg font-bold text-civic-700">
            {locker.availableUnits}/{locker.totalUnits}
          </strong>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <span className="block text-slate-500">{t.walk}</span>
          <strong className="mt-1 block font-display text-lg font-semibold">
            {formatDuration(locker.estimatedWalkMinutes, t)}
          </strong>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <span className="block text-slate-500">{t.bus}</span>
          <strong className="mt-1 block font-display text-lg font-semibold">
            {formatDuration(locker.estimatedBusMinutes, t)}
          </strong>
        </div>
      </div>

      {locker.largeLuggage && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-transit-400/10 px-3 py-1 font-display text-xs font-semibold text-transit-500">
            <Icon name="luggage" className="h-4 w-4" />
            {t.largeLuggage}
          </span>
        </div>
      )}
    </button>
  );
}
