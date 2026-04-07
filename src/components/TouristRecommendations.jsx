import LockerCard from "./LockerCard";

export default function TouristRecommendations({ t, landmarks, lockers, selectedLocker, onSelectLocker }) {
  const activeLandmarks = landmarks.filter((landmark) =>
    lockers.some((locker) => locker.nearbyLandmark === landmark)
  );

  return (
    <section id="tourist" className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-civic-600">Tourist guide</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {t.touristTitle}
          </h2>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {activeLandmarks.map((landmark) => {
            const bestLocker = lockers
              .filter((locker) => locker.nearbyLandmark === landmark)
              .sort((a, b) => b.availableUnits - a.availableUnits)[0];

            if (!bestLocker) return null;

            return (
              <div key={landmark} className="rounded-[2rem] bg-slate-50 p-4 ring-1 ring-slate-200">
                <h3 className="mb-4 text-xl font-black text-slate-950">
                  {t.landmarkNames?.[landmark] ?? landmark}
                </h3>
                <LockerCard
                  locker={bestLocker}
                  t={t}
                  selected={selectedLocker?.id === bestLocker.id}
                  onSelect={onSelectLocker}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
