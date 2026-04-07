import Icon from "./Icon";
import StatusBadge from "./StatusBadge";
import { getLanguageLabel } from "../utils/lockerUtils";

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
          <h3 className="text-xl font-black tracking-tight text-slate-950">{locker.name}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {locker.nearbyLandmark} · {locker.district}
          </p>
        </div>
        <StatusBadge status={locker.availabilityStatus} t={t} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-civic-50 p-3">
          <span className="block text-slate-500">{t.availableUnits}</span>
          <strong className="mt-1 block text-lg text-civic-700">
            {locker.availableUnits}/{locker.totalUnits}
          </strong>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <span className="block text-slate-500">{t.walk}</span>
          <strong className="mt-1 block text-lg">{locker.estimatedWalkMinutes}m</strong>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <span className="block text-slate-500">{t.bus}</span>
          <strong className="mt-1 block text-lg">{locker.estimatedBusMinutes}m</strong>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {locker.largeLuggage && (
          <span className="inline-flex items-center gap-1 rounded-full bg-transit-400/10 px-3 py-1 text-xs font-bold text-transit-500">
            <Icon name="luggage" className="h-4 w-4" />
            {t.largeLuggage}
          </span>
        )}
        {locker.supportedLanguages.map((language) => (
          <span
            key={language}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
          >
            {getLanguageLabel(language)}
          </span>
        ))}
      </div>
    </button>
  );
}
