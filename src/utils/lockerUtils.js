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

const japanesePlaceNames = [
  ["광화문", "光化門"],
  ["종각", "鐘閣"],
  ["명동", "明洞"],
  ["서울역", "ソウル駅"],
  ["홍대", "弘大"],
  ["동대문", "東大門"],
  ["인천공항", "仁川空港"],
  ["부산역", "釜山駅"],
  ["해운대", "海雲台"],
  ["제주공항", "済州空港"],
  ["황리단길", "皇理団通り"],
  ["동대구역", "東大邱駅"],
  ["강릉역", "江陵駅"],
  ["을지로3가", "乙支路3街"],
  ["을지로입구", "乙支路入口"],
  ["서울식물원", "ソウル植物園"],
  ["종합운동장", "総合運動場"],
  ["강남", "江南"],
  ["잠실", "蚕室"],
  ["시청", "市庁"],
  ["여의도", "汝矣島"],
  ["고속터미널", "高速ターミナル"],
  ["김포공항", "金浦空港"],
  ["김해공항", "金海空港"],
  ["제주시", "済州市"],
  ["대구", "大邱"],
  ["부산", "釜山"],
  ["서울", "ソウル"],
  ["인천", "仁川"],
  ["제주", "済州"],
  ["경주", "慶州"],
  ["강릉", "江陵"]
];

function stripNumericParentheses(value) {
  return value
    .replace(/\(\s*[\d\s,~\-–—]+\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function collapseRepeatedTerms(value) {
  const terms = value.split(/\s+/);
  return terms
    .filter((term, index) => term !== terms[index - 1])
    .join(" ");
}

function localizeJapaneseLockerName(value) {
  return japanesePlaceNames
    .reduce((name, [korean, japanese]) => name.replaceAll(korean, japanese), value)
    .replace(/(\d+)호선/g, "$1号線");
}

export function formatLockerName(locker, t) {
  const cleanedName = collapseRepeatedTerms(stripNumericParentheses(locker.name));

  if (t.locale !== "ja") {
    return cleanedName;
  }

  return collapseRepeatedTerms(localizeJapaneseLockerName(cleanedName));
}

export function getAvailabilityRatio(locker) {
  return locker.totalUnits === 0 ? 0 : locker.availableUnits / locker.totalUnits;
}

export function getCrowdingScore(locker) {
  return 1 - getAvailabilityRatio(locker);
}

export function matchesSearch(locker, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const searchAliases = {
    Seoul: ["서울", "ソウル", "首尔"],
    Busan: ["부산", "釜山"],
    Incheon: ["인천", "仁川"],
    Jeju: ["제주", "済州", "济州"],
    Gyeongju: ["경주", "慶州", "庆州"],
    Gangneung: ["강릉", "江陵"],
    Daegu: ["대구", "大邱"],
    Gwanghwamun: ["광화문", "光化門", "光化门"],
    Myeongdong: ["명동", "明洞"],
    "Seoul Station": ["서울역", "ソウル駅", "首尔站"],
    Hongdae: ["홍대", "弘大"],
    Dongdaemun: ["동대문", "東大門", "东大门"],
    "Incheon Airport": ["인천공항", "仁川空港", "仁川机场"],
    "Busan Station": ["부산역", "釜山駅", "釜山站"],
    Haeundae: ["해운대", "海雲台", "海云台"],
    "Jeju Airport": ["제주공항", "済州空港", "济州机场"],
    "Hwangnidan-gil": ["황리단길", "皇理団通り", "皇理团路"],
    "Gangneung Station": ["강릉역", "江陵駅", "江陵站"],
    "Dongdaegu Station": ["동대구역", "대구역", "東大邱駅", "大邱站"]
  };

  const aliases = [
    ...(searchAliases[locker.region] ?? []),
    ...(searchAliases[locker.nearbyLandmark] ?? [])
  ];

  return [
    locker.name,
    locker.region,
    locker.district,
    locker.address,
    locker.nearbyLandmark,
    locker.nearestBusStop,
    ...aliases
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
