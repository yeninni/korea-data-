import { useEffect, useMemo, useState } from "react";
import FilterBar from "./FilterBar";
import LockerCard from "./LockerCard";
import LockerDetail from "./LockerDetail";
import MockMap from "./MockMap";
import { formatDistrict, formatLandmark, getCrowdingScore } from "../utils/lockerUtils";

const SEOUL_FEATURED_GROUPS = [
  {
    id: "seoul-station",
    matches: (locker) => locker.nearbyLandmark === "Seoul Station" || /서울역/.test(locker.name)
  },
  {
    id: "myeongdong",
    matches: (locker) => locker.nearbyLandmark === "Myeongdong" || /명동|을지로입구|을지로3가/.test(locker.name)
  },
  {
    id: "hongdae",
    matches: (locker) => locker.nearbyLandmark === "Hongdae" || /홍대입구|합정/.test(locker.name)
  },
  {
    id: "dongdaemun",
    matches: (locker) =>
      locker.nearbyLandmark === "Dongdaemun" || /동대문|동대문역사문화공원|ddp/i.test(locker.name)
  },
  {
    id: "gwanghwamun",
    matches: (locker) => locker.nearbyLandmark === "Gwanghwamun" || /광화문|종각|시청/.test(locker.name)
  },
  {
    id: "gangnam",
    matches: (locker) =>
      locker.nearbyLandmark === "강남구" ||
      /강남|삼성|선릉|잠실|종합운동장/.test(`${locker.name} ${locker.district ?? ""}`)
  }
];

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
        totalUnits: 0,
        subregions: new Set()
      };

    current.lockers.push(locker);
    current.availableUnits += locker.availableUnits;
    current.totalUnits += locker.totalUnits;
    current.subregions.add(locker.district || locker.nearbyLandmark || locker.region);
    summaries.set(region, current);
  });

  return [...summaries.values()]
    .map((summary) => ({
      ...summary,
      subregions: [...summary.subregions]
    }))
    .sort((a, b) => {
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

function pickRepresentativeLocker(lockers) {
  return [...lockers].sort((a, b) => {
    return (
      getCrowdingScore(a) - getCrowdingScore(b) ||
      b.availableUnits - a.availableUnits ||
      a.estimatedWalkMinutes - b.estimatedWalkMinutes
    );
  })[0] ?? null;
}

function getFeaturedSeoulLockers(lockers) {
  const selected = [];
  const usedIds = new Set();

  SEOUL_FEATURED_GROUPS.forEach((group) => {
    const chosen = pickRepresentativeLocker(
      lockers.filter((locker) => !usedIds.has(locker.id) && group.matches(locker))
    );

    if (chosen) {
      selected.push(chosen);
      usedIds.add(chosen.id);
    }
  });

  const remaining = lockers.filter((locker) => !usedIds.has(locker.id));
  return [...selected, ...remaining].slice(0, 6);
}

function getDefaultDetailLocker(lockers) {
  return (
    lockers.find((locker) => locker.id === "locker-seoulstation-01") ||
    lockers.find((locker) => locker.nearbyLandmark === "Seoul Station") ||
    lockers.find((locker) => locker.name?.includes("서울역")) ||
    lockers.find((locker) => locker.region === "Seoul") ||
    lockers[0] ||
    null
  );
}

export default function MapExplorer({
  t,
  lockers,
  mapLockers = lockers,
  selectedLocker,
  focusedLockerId,
  onSelectLocker,
  sortMode,
  onSortModeChange,
  largeOnly,
  onLargeOnlyChange,
  selectedRegion,
  onRegionChange,
  currentLocation,
  onUseLocation,
  locationStatus,
  locationFocusToken
}) {
  const [showAllSeoulLockers, setShowAllSeoulLockers] = useState(false);
  const regionSummaries = getRegionSummaries(mapLockers);
  const selectedRegionLabel = t.regionNames?.[selectedRegion] ?? selectedRegion;
  const hasFocusedResults =
    Boolean(currentLocation) || selectedRegion !== "All Korea" || lockers.length !== mapLockers.length;
  const shouldCollapseSeoulLockers = selectedRegion === "Seoul" && lockers.length > 6;
  const featuredSeoulLockers = useMemo(
    () => (shouldCollapseSeoulLockers ? getFeaturedSeoulLockers(lockers) : lockers),
    [lockers, shouldCollapseSeoulLockers]
  );
  const displayedLockerCards =
    shouldCollapseSeoulLockers && !showAllSeoulLockers ? featuredSeoulLockers : lockers;
  const hiddenSeoulLockerCount = Math.max(0, lockers.length - featuredSeoulLockers.length);
  const displayedMapLockers = hasFocusedResults ? lockers : getRegionMapMarkers(regionSummaries, t);
  const selectedMapLocker =
    displayedMapLockers.some((locker) => locker.id === selectedLocker?.id) ? selectedLocker : null;
  const defaultDetailLocker = getDefaultDetailLocker(mapLockers);
  const selectedDetailLocker = hasFocusedResults
    ? lockers.some((locker) => locker.id === selectedLocker?.id)
      ? selectedLocker
      : lockers[0] ?? null
    : defaultDetailLocker;

  useEffect(() => {
    setShowAllSeoulLockers(false);
  }, [selectedRegion]);

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
              focusedLockerId={focusedLockerId}
              onSelect={onSelectLocker}
              onRegionSelect={onRegionChange}
              t={t}
              currentLocation={currentLocation}
              onUseLocation={onUseLocation}
              locationStatus={locationStatus}
              locationFocusToken={locationFocusToken}
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
                  const subregionPreview = summary.subregions
                    .slice(0, 3)
                    .map((subregion) => formatLandmark(formatDistrict(subregion, t), t))
                    .join(" · ");

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
                      {subregionPreview && (
                        <p className={`mt-2 font-soft text-xs ${selected ? "text-civic-100" : "text-slate-400"}`}>
                          {subregionPreview}
                          {summary.subregions.length > 3 ? ` ${t.moreSuffix}` : ""}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {hasFocusedResults ? (
              <div className="grid gap-4 md:grid-cols-2">
                {displayedLockerCards.length > 0 ? (
                  displayedLockerCards.map((locker) => (
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
                {shouldCollapseSeoulLockers && !showAllSeoulLockers && hiddenSeoulLockerCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAllSeoulLockers(true)}
                    className="focus-ring flex min-h-[250px] w-full flex-col items-center justify-center rounded-[1.75rem] bg-slate-50 p-6 text-center shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-civic"
                  >
                    <span className="font-display text-lg font-semibold text-slate-900">{t.showMoreLockers}</span>
                    <span className="mt-2 font-soft text-sm text-slate-500">
                      {fillTemplate(t.lockersCount, { count: hiddenSeoulLockerCount })}
                    </span>
                  </button>
                )}
                {shouldCollapseSeoulLockers && showAllSeoulLockers && (
                  <button
                    type="button"
                    onClick={() => setShowAllSeoulLockers(false)}
                    className="focus-ring rounded-[1.75rem] bg-slate-50 p-5 text-center font-display font-semibold text-civic-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-white hover:shadow-civic md:col-span-2"
                  >
                    {t.showLessLockers}
                  </button>
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
