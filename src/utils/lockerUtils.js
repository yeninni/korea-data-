export const statusStyles = {
  Available: {
    labelKey: "availableNow",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    marker: "bg-emerald-500",
    order: 0
  },
  "Almost Full": {
    labelKey: "almostFull",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    marker: "bg-amber-500",
    order: 1
  },
  Full: {
    labelKey: "full",
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
    marker: "bg-rose-500",
    order: 2
  }
};

export function getAvailabilityRatio(locker) {
  return locker.totalUnits === 0 ? 0 : locker.availableUnits / locker.totalUnits;
}

export function getCrowdingScore(locker) {
  return 1 - getAvailabilityRatio(locker);
}

export function matchesSearch(locker, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [
    locker.name,
    locker.district,
    locker.address,
    locker.nearbyLandmark,
    locker.nearestBusStop
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export function sortLockers(lockers, sortMode) {
  const sorted = [...lockers];

  if (sortMode === "leastCrowded") {
    return sorted.sort((a, b) => {
      if (statusStyles[a.availabilityStatus].order !== statusStyles[b.availabilityStatus].order) {
        return statusStyles[a.availabilityStatus].order - statusStyles[b.availabilityStatus].order;
      }

      return getCrowdingScore(a) - getCrowdingScore(b);
    });
  }

  if (sortMode === "fastestBus") {
    return sorted.sort((a, b) => a.estimatedBusMinutes - b.estimatedBusMinutes);
  }

  return sorted.sort((a, b) => a.estimatedWalkMinutes - b.estimatedWalkMinutes);
}

export function summarize(lockers) {
  return lockers.reduce(
    (summary, locker) => {
      summary.total += locker.totalUnits;
      summary.available += locker.availableUnits;
      summary[locker.availabilityStatus] += 1;
      return summary;
    },
    { total: 0, available: 0, Available: 0, "Almost Full": 0, Full: 0 }
  );
}

export function getAlternative(lockers, currentLocker) {
  return lockers
    .filter((locker) => locker.id !== currentLocker.id)
    .filter((locker) => locker.availabilityStatus !== "Full")
    .sort((a, b) => {
      const sameLandmarkA = a.nearbyLandmark === currentLocker.nearbyLandmark ? -1 : 0;
      const sameLandmarkB = b.nearbyLandmark === currentLocker.nearbyLandmark ? -1 : 0;
      if (sameLandmarkA !== sameLandmarkB) return sameLandmarkA - sameLandmarkB;
      return getCrowdingScore(a) - getCrowdingScore(b);
    })[0];
}

export function getLanguageLabel(languageCode) {
  return {
    ko: "KO",
    en: "EN",
    zh: "中文",
    ja: "日本語"
  }[languageCode];
}
