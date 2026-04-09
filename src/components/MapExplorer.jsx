import FilterBar from "./FilterBar";
import LockerCard from "./LockerCard";
import LockerDetail from "./LockerDetail";
import MockMap from "./MockMap";
import { getCrowdingScore } from "../utils/lockerUtils";

function classifyAvailability(availableUnits, totalUnits) {
  if (availableUnits <= 0) return "Full";
  if (totalUnits > 0 && availableUnits / totalUnits <= 0.2) return "Almost Full";
  return "Available";
}

function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

function getRegionSummaries(lockers) {
  const summaries = new Map();

  lockers.forEach((locker) => {
    const region = locker.region ?? "All Korea";
    const current =
      summaries.get(region) ??
      {
        region,
        lockers: [],
        availableUnits: 0,
        totalUnits: 0
      };

    current.lockers.push(locker);
    current.availableUnits += locker.availableUnits;
    current.totalUnits += locker.totalUnits;
    summaries.set(region, current);
  });

  return [...summaries.values()].sort((a, b) => {
    const aBest = Math.min(...a.lockers.map(getCrowdingScore));
    const bBest = Math.min(...b.lockers.map(getCrowdingScore));
    return aBest - bBest || b.lockers.length - a.lockers.length;
  });
}

function getRegionMapMarkers(regionSummaries, t) {
  return regionSummaries
    .map((summary) => {
      const validLockers = summary.lockers.filter(
        (locker) => Number.isFinite(locker.latitude) && Number.isFinite(locker.longitude)
      );

      if (validLockers.length === 0) return null;

      const center = validLockers.reduce(
        (sum, locker) => ({
          latitude: sum.latitude + locker.latitude,
          longitude: sum.longitude + locker.longitude
        }),
        { latitude: 0, longitude: 0 }
      );

      return {
        id: `region-${summary.region}`,
        name: t.regionNames?.[summary.region] ?? summary.region,
        region: summary.region,
        district: "",
        address: "",
        latitude: center.latitude / validLockers.length,
        longitude: center.longitude / validLockers.length,
        availabilityStatus: classifyAvailability(summary.availableUnits, summary.totalUnits),
        availableUnits: summary.availableUnits,
        totalUnits: summary.totalUnits,
        nearbyLandmark: t.regionNames?.[summary.region] ?? summary.region,
        isRegionMarker: true,
        lockerCount: summary.lockers.length
      };
    })
    .filter(Boolean);
}

export default function MapExplorer({
  t,
  lockers,
  mapLockers = lockers,
  selectedLocker,
  onSelectLocker,
  sortMode,
  onSortModeChange,
  largeOnly,
  onLargeOnlyChange,
  selectedRegion,
  onRegionChange
}) {
  const regionSummaries = getRegionSummaries(mapLockers);
  const selectedRegionLabel = t.regionNames?.[selectedRegion] ?? selectedRegion;
  const hasFocusedResults = selectedRegion !== "All Korea" || lockers.length !== mapLockers.length;
  const displayedMapLockers = hasFocusedResults ? lockers : getRegionMapMarkers(regionSummaries, t);
  const selectedMapLocker =
    displayedMapLockers.some((locker) => locker.id === selectedLocker?.id) ? selectedLocker : null;
  const selectedDetailLocker = hasFocusedResults
    ? lockers.some((locker) => locker.id === selectedLocker?.id)
      ? selectedLocker
      : lockers[0] ?? null
    : null;

  return (
    <section id="map" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <FilterBar
          t={t}
          sortMode={sortMode}
          onSortModeChange={onSortModeChange}
          largeOnly={largeOnly}
          onLargeOnlyChange={onLargeOnlyChange}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
          <div className="space-y-5">
            <MockMap
              lockers={displayedMapLockers}
              selectedLocker={selectedMapLocker}
              onSelect={onSelectLocker}
              onRegionSelect={onRegionChange}
              t={t}
            />

            <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display font-semibold text-2xl tracking-tight text-slate-950">
                    {t.areaOverview}
                  </h2>
                  <p className="mt-1 font-soft text-sm text-slate-500">{t.areaOverviewHint}</p>
                </div>
                <p className="font-display text-sm font-semibold text-civic-700">
                  {fillTemplate(t.stationsInRegion, { region: selectedRegionLabel })}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {regionSummaries.map((summary) => {
                  const regionLabel = t.regionNames?.[summary.region] ?? summary.region;
                  const selected = selectedRegion === summary.region;

                  return (
                    <button
                      key={summary.region}
                      type="button"
                      onClick={() => onRegionChange(summary.region)}
                      className={`focus-ring rounded-[1.5rem] p-4 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-civic ${
                        selected
                          ? "bg-civic-600 text-white ring-civic-600"
                          : "bg-slate-50 text-slate-900 ring-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display font-semibold text-xl">{regionLabel}</h3>
                        <span
                          className={`rounded-full px-3 py-1 font-display text-xs font-semibold ${
                            selected ? "bg-white/15 text-white" : "bg-white text-civic-700"
                          }`}
                        >
                          {fillTemplate(t.lockersCount, { count: summary.lockers.length })}
                        </span>
                      </div>
                      <p className={`mt-3 font-soft text-sm ${selected ? "text-civic-50" : "text-slate-500"}`}>
                        {summary.availableUnits} / {summary.totalUnits} {t.availableUnits}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {hasFocusedResults ? (
              <div className="grid gap-4 md:grid-cols-2">
                {lockers.length > 0 ? (
                  lockers.map((locker) => (
                    <LockerCard
                      key={locker.id}
                      locker={locker}
                      t={t}
                      selected={selectedLocker?.id === locker.id}
                      onSelect={onSelectLocker}
                    />
                  ))
                ) : (
                  <div className="rounded-[1.75rem] bg-white p-6 font-soft text-slate-600 shadow-sm ring-1 ring-slate-200 md:col-span-2">
                    {t.noResults}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-[1.75rem] bg-white p-6 font-soft text-slate-600 shadow-sm ring-1 ring-slate-200">
                {t.selectRegionPrompt}
              </div>
            )}
          </div>

          {selectedDetailLocker ? (
            <LockerDetail locker={selectedDetailLocker} lockers={mapLockers} t={t} />
          ) : (
            <aside className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-28">
              <p className="font-soft text-sm text-civic-600">{t.detailTitle}</p>
              <h2 className="mt-2 font-display font-bold text-2xl tracking-tight text-slate-950">
                {t.detailEmptyTitle}
              </h2>
              <p className="mt-3 font-soft leading-7 text-slate-600">
                {hasFocusedResults ? t.detailEmptyDescription : t.detailSelectRegionDescription}
              </p>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="font-soft text-sm text-slate-500">{t.mapHint}</p>
                <p className="mt-2 font-display font-semibold text-slate-900">
                  {hasFocusedResults ? t.detailSelectLockerHint : t.detailSelectRegionHint}
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
