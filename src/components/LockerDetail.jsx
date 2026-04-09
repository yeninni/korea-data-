import { useEffect, useMemo, useState } from "react";
import Icon from "./Icon";
import StatusBadge from "./StatusBadge";
import {
  formatAddress,
  formatAvailableUnits,
  formatBusStop,
  formatLandmark,
  formatLockerName,
  formatOpenHours,
  formatPrice,
  formatSupportLabel,
  getAlternative
} from "../utils/lockerUtils";

export default function LockerDetail({ locker, lockers, t }) {
  const alternative = getAlternative(lockers, locker);
  const sizeOptions = useMemo(
    () => [
      { key: "small", label: t.sizeSmall, count: locker.sizeAvailability?.small ?? null },
      { key: "medium", label: t.sizeMedium, count: locker.sizeAvailability?.medium ?? null },
      { key: "large", label: t.sizeLarge, count: locker.sizeAvailability?.large ?? null }
    ],
    [locker.sizeAvailability, t.sizeLarge, t.sizeMedium, t.sizeSmall]
  );
  const defaultSizeKey =
    sizeOptions.find((option) => typeof option.count === "number" && option.count > 0)?.key ??
    sizeOptions.find((option) => typeof option.count === "number")?.key ??
    "small";
  const [selectedSize, setSelectedSize] = useState(defaultSizeKey);

  useEffect(() => {
    setSelectedSize(defaultSizeKey);
  }, [defaultSizeKey, locker.id]);

  const selectedSizeOption = sizeOptions.find((option) => option.key === selectedSize) ?? sizeOptions[0];

  return (
    <aside className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-soft text-sm text-civic-600">{t.detailTitle}</p>
          <h2 className="mt-1 font-display font-bold text-2xl tracking-tight text-slate-950">
            {formatLockerName(locker, t)}
          </h2>
          <p className="mt-2 font-soft text-sm leading-6 text-slate-500">{formatAddress(locker.address, t)}</p>
        </div>
        <StatusBadge status={locker.availabilityStatus} t={t} />
      </div>

      <dl className="mt-6 grid gap-3">
        {[
          [t.availableUnits, formatAvailableUnits(locker.availableUnits, locker.totalUnits, t)],
          [t.openHours, formatOpenHours(locker.openHours, t)],
          [t.price, formatPrice(locker.price, t)],
          [t.largeLuggage, formatSupportLabel(locker.largeLuggage, t)]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <dt className="font-soft text-sm text-slate-500">{label}</dt>
            <dd className="mt-1 font-display font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-soft text-sm text-slate-500">{t.sizeAvailabilityTitle}</p>
            <p className="mt-1 font-display font-semibold text-slate-900">{t.sizeAvailabilityHint}</p>
          </div>
          {selectedSizeOption && typeof selectedSizeOption.count === "number" && (
            <span className="inline-flex min-h-14 min-w-14 items-center justify-center self-center rounded-full bg-white px-3 py-1 text-center font-display text-sm font-semibold leading-5 text-civic-700 ring-1 ring-slate-200">
              <span className="flex flex-col items-center justify-center">
                <span>{selectedSizeOption.label}</span>
                <span>{selectedSizeOption.count}</span>
              </span>
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {sizeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSelectedSize(option.key)}
              className={`focus-ring rounded-2xl px-3 py-3 text-center transition ${
                selectedSize === option.key
                  ? "bg-civic-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-civic-50"
              }`}
            >
              <span className="block font-soft text-xs">{option.label}</span>
              <strong className="mt-1 block font-display text-base font-bold">
                {typeof option.count === "number" ? option.count : "-"}
              </strong>
            </button>
          ))}
        </div>

        <p className="mt-3 font-soft text-sm text-slate-500">
          {typeof selectedSizeOption?.count === "number"
            ? t.sizeAvailabilityDescription
                .replace("{size}", selectedSizeOption.label)
                .replace("{count}", selectedSizeOption.count)
            : t.sizeAvailabilityUnavailable}
        </p>
      </div>

      <div className="mt-5 rounded-2xl bg-civic-50 p-4">
        <div className="flex items-center gap-2 font-display font-semibold text-civic-700">
          <Icon name="bus" className="h-5 w-5" />
          {t.nearestStop}
        </div>
        <p className="mt-2 font-display text-lg font-semibold text-slate-900">
          {formatBusStop(locker.nearestBusStop, t)}
        </p>
      </div>

      {locker.availabilityStatus !== "Available" && alternative && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-soft text-sm text-amber-700">{t.recommendedAlternative}</p>
          <p className="mt-1 font-display font-semibold text-slate-900">{formatLockerName(alternative, t)}</p>
          <p className="mt-1 text-sm text-slate-600">
            {formatAvailableUnits(alternative.availableUnits, alternative.totalUnits, t)} ·{" "}
            {formatLandmark(alternative.nearbyLandmark, t)}
          </p>
        </div>
      )}
    </aside>
  );
}
