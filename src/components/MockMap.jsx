import { statusStyles } from "../utils/lockerUtils";

export default function MockMap({ lockers, selectedLocker, onSelect, t }) {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-civic-50 shadow-sm">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,111,174,0.08)_1px,transparent_1px),linear-gradient(rgba(37,111,174,0.08)_1px,transparent_1px)] bg-[size:46px_46px]" />
      <div className="absolute left-6 top-6 z-10 rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-200">
        <h3 className="font-black text-slate-950">{t.mapTitle}</h3>
        <p className="mt-1 max-w-xs text-sm text-slate-500">{t.mapHint}</p>
      </div>

      <div className="absolute left-[8%] right-[10%] top-[46%] h-4 rotate-[-7deg] rounded-full bg-white/80 shadow-sm" />
      <div className="absolute bottom-[14%] left-[18%] right-[18%] h-4 rotate-[9deg] rounded-full bg-white/80 shadow-sm" />
      <div className="absolute bottom-[10%] left-[58%] top-[18%] w-4 rotate-[3deg] rounded-full bg-white/80 shadow-sm" />
      <div className="absolute left-[16%] top-[20%] rounded-full bg-transit-400/20 px-5 py-3 text-sm font-black text-transit-500">
        Seoul transit area
      </div>

      {lockers.map((locker) => {
        const isSelected = selectedLocker?.id === locker.id;
        return (
          <button
            key={locker.id}
            type="button"
            onClick={() => onSelect(locker)}
            className={`focus-ring absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg transition ${
              isSelected ? "scale-125 bg-white ring-4 ring-civic-500/25" : "bg-white hover:scale-110"
            }`}
            style={{
              left: `${locker.coordinatesOnMap.x}%`,
              top: `${locker.coordinatesOnMap.y}%`
            }}
            aria-label={locker.name}
          >
            <span
              className={`block h-5 w-5 rounded-full ring-4 ring-white ${
                statusStyles[locker.availabilityStatus].marker
              }`}
            />
          </button>
        );
      })}

      <div className="absolute bottom-5 left-5 z-10 rounded-2xl bg-white/95 px-4 py-3 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
        {t.mockNotice}
      </div>
    </div>
  );
}
