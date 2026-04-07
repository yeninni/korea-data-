import Icon from "./Icon";
import StatusBadge from "./StatusBadge";
import { getAlternative, getLanguageLabel } from "../utils/lockerUtils";

export default function LockerDetail({ locker, lockers, t }) {
  const alternative = getAlternative(lockers, locker);

  return (
    <aside className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-civic-600">{t.detailTitle}</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{locker.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{locker.address}</p>
        </div>
        <StatusBadge status={locker.availabilityStatus} t={t} />
      </div>

      <dl className="mt-6 grid gap-3">
        {[
          [t.availableUnits, `${locker.availableUnits} / ${locker.totalUnits}`],
          [t.openHours, locker.openHours],
          [t.price, locker.price],
          [t.largeLuggage, locker.largeLuggage ? "Yes" : "No"],
          [t.languages, locker.supportedLanguages.map(getLanguageLabel).join(", ")]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-sm font-bold text-slate-500">{label}</dt>
            <dd className="mt-1 font-black text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-2xl bg-civic-50 p-4">
        <div className="flex items-center gap-2 font-black text-civic-700">
          <Icon name="bus" className="h-5 w-5" />
          {t.nearbyBusInfo}
        </div>
        <p className="mt-2 text-sm text-slate-600">
          {t.nearestStop}: <strong>{locker.nearestBusStop}</strong>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {locker.nextBuses.map((bus) => (
            <span
              key={bus.route}
              className="rounded-full bg-white px-3 py-1 text-sm font-black text-civic-700"
            >
              {bus.route} · {bus.minutes} min
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-500">
          {t.walk} {locker.estimatedWalkMinutes}m · {t.bus} {locker.estimatedBusMinutes}m
        </p>
      </div>

      {locker.availabilityStatus !== "Available" && alternative && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-black text-amber-700">{t.recommendedAlternative}</p>
          <p className="mt-1 font-bold text-slate-900">{alternative.name}</p>
          <p className="mt-1 text-sm text-slate-600">
            {alternative.availableUnits} / {alternative.totalUnits} · {alternative.nearbyLandmark}
          </p>
        </div>
      )}

      <button
        type="button"
        className="focus-ring mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-civic-600 px-5 font-black text-white hover:bg-civic-700"
      >
        <Icon name="route" className="h-5 w-5" />
        {t.directions}
      </button>
    </aside>
  );
}
