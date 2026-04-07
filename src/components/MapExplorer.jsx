import FilterBar from "./FilterBar";
import LockerCard from "./LockerCard";
import LockerDetail from "./LockerDetail";
import MockMap from "./MockMap";

export default function MapExplorer({
  t,
  lockers,
  mapLockers = lockers,
  selectedLocker,
  onSelectLocker,
  sortMode,
  onSortModeChange,
  largeOnly,
  onLargeOnlyChange
}) {
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
            <MockMap lockers={mapLockers} selectedLocker={selectedLocker} onSelect={onSelectLocker} t={t} />
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
                <div className="rounded-[1.75rem] bg-white p-6 text-slate-600 shadow-sm ring-1 ring-slate-200 md:col-span-2">
                  {t.noResults}
                </div>
              )}
            </div>
          </div>

          {selectedLocker && <LockerDetail locker={selectedLocker} lockers={mapLockers} t={t} />}
        </div>
      </div>
    </section>
  );
}
