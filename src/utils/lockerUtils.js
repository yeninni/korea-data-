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
  ["수원시", "水原市"],
  ["수원", "水原"],
  ["대구", "大邱"],
  ["부산", "釜山"],
  ["서울", "ソウル"],
  ["인천", "仁川"],
  ["제주", "済州"],
  ["경주", "慶州"],
  ["강릉", "江陵"]
];

const localizedLockerNames = {
  ko: {
    "Gwanghwamun Public Locker Center": "광화문 공영 물품보관함",
    "Myeongdong Station Smart Locker": "명동역 스마트 물품보관함",
    "Seoul Station Travel Locker": "서울역 여행자 물품보관함",
    "Hongdae Tourist Locker": "홍대 관광 물품보관함",
    "Dongdaemun Design Plaza Locker": "동대문디자인플라자 물품보관함",
    "Incheon Airport Public Storage Desk": "인천공항 공영 짐보관소",
    "Busan Station Tourist Locker": "부산역 관광 물품보관함",
    "Haeundae Beach Public Locker": "해운대해수욕장 공영 물품보관함",
    "Jeju Airport Arrival Locker": "제주공항 도착층 물품보관함",
    "Gyeongju Historic Area Locker": "경주 역사관광지 물품보관함",
    "Dongdaegu Station Public Locker": "동대구역 공영 물품보관함",
    "Gangneung Station Easy Locker": "강릉역 간편 물품보관함"
  }
};

const localizedDistricts = {
  ko: {
    "Jongno-gu": "종로구",
    "Jung-gu": "중구",
    "Yongsan-gu": "용산구",
    "Mapo-gu": "마포구",
    "Jung-gu, Incheon": "인천 중구",
    "Dong-gu, Busan": "부산 동구",
    "Haeundae-gu, Busan": "부산 해운대구",
    "Jeju-si": "제주시",
    "Gyeongju-si": "경주시",
    "Dong-gu, Daegu": "대구 동구",
    "Gangneung-si": "강릉시"
  }
};

const localizedAddresses = {
  ko: {
    "172 Sejong-daero, Jongno-gu, Seoul": "서울 종로구 세종대로 172",
    "Myeongdong Station Exit 6, Jung-gu, Seoul": "서울 중구 명동역 6번 출구",
    "Seoul Station Transfer Hall, 405 Hangang-daero": "서울역 환승통로, 한강대로 405",
    "Hongik University Station Exit 9, Mapo-gu, Seoul": "서울 마포구 홍대입구역 9번 출구",
    "DDP Visitor Center, Eulji-ro, Jung-gu": "서울 중구 을지로 DDP 관광안내센터",
    "Terminal 1 Arrival Hall, Incheon International Airport": "인천국제공항 제1터미널 도착층",
    "Busan Station Main Hall, Jungang-daero, Dong-gu, Busan": "부산 동구 중앙대로 부산역 맞이방",
    "Haeundae Beach Tourist Information Center, Busan": "부산 해운대해수욕장 관광안내소",
    "Jeju International Airport Arrival Hall, Jeju": "제주국제공항 도착층",
    "Hwangnidan-gil Tourist Information Area, Gyeongju": "경주 황리단길 관광안내 구역",
    "Dongdaegu Station Transfer Center, Dong-gu, Daegu": "대구 동구 동대구역 환승센터",
    "Gangneung Station Tourist Zone, Gangneung": "강릉역 관광안내 구역"
  }
};

const localizedBusStops = {
  ko: {
    "Gwanghwamun Square": "광화문광장",
    "Myeongdong Entrance": "명동입구",
    "Seoul Station Bus Transfer Center": "서울역버스환승센터",
    "Hongik University Station": "홍대입구역",
    "Dongdaemun Design Plaza": "동대문디자인플라자",
    "Incheon Airport T1": "인천공항 T1",
    "Busan Station": "부산역",
    "Haeundae Beach": "해운대해수욕장",
    "Jeju International Airport": "제주국제공항",
    "Daereungwon Tomb Complex": "대릉원",
    "Dongdaegu Station Transfer Center": "동대구역 환승센터",
    "Gangneung Station": "강릉역"
  }
};

const localizedPrices = {
  ko: {
    "Small 2,000 KRW / Large 4,000 KRW": "소형 2,000원 / 대형 4,000원",
    "Small 2,000 KRW / Medium 3,000 KRW / Large 5,000 KRW":
      "소형 2,000원 / 중형 3,000원 / 대형 5,000원",
    "Small 2,000 KRW / Large 5,000 KRW": "소형 2,000원 / 대형 5,000원",
    "Small 2,000 KRW / Large 4,500 KRW": "소형 2,000원 / 대형 4,500원",
    "Small 2,000 KRW / Medium 3,000 KRW": "소형 2,000원 / 중형 3,000원",
    "Small 4,000 KRW / Large 8,000 KRW": "소형 4,000원 / 대형 8,000원",
    "Small 3,000 KRW / Large 6,000 KRW": "소형 3,000원 / 대형 6,000원"
  }
};

const localizedOpenHours = {
  ko: {
    "24 hours": "24시간 운영",
    "Open hours not provided": "운영시간 정보 없음"
  },
  zh: {
    "Open hours not provided": "暂无营业时间信息"
  },
  ja: {
    "Open hours not provided": "営業時間情報なし"
  }
};

const localizedBusRouteLabels = {
  ko: {
    "Public bus": "일반버스",
    Transfer: "환승"
  },
  zh: {
    "Public bus": "公交",
    Transfer: "换乘"
  },
  ja: {
    "Public bus": "一般バス",
    Transfer: "乗換"
  }
};

function localizeMappedValue(value, t, translations) {
  if (!value) return value;
  return translations[t.locale]?.[value] ?? value;
}

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
  const localizedName = localizeMappedValue(cleanedName, t, localizedLockerNames);

  if (localizedName !== cleanedName) {
    return localizedName;
  }

  if (t.locale !== "ja") {
    return cleanedName;
  }

  return collapseRepeatedTerms(localizeJapaneseLockerName(cleanedName));
}

export function formatDistrict(value, t) {
  return localizeMappedValue(value, t, localizedDistricts);
}

export function formatAddress(value, t) {
  return localizeMappedValue(value, t, localizedAddresses);
}

export function formatBusStop(value, t) {
  const localizedValue = localizeMappedValue(value, t, localizedBusStops);
  if (localizedValue !== value) {
    return localizedValue;
  }

  const areaStopMatch = value?.match(/^(.*) area stop$/);
  if (!areaStopMatch) {
    return value;
  }

  const baseName = areaStopMatch[1];
  const localizedBase =
    t.landmarkNames?.[baseName] ?? localizeMappedValue(baseName, t, localizedBusStops) ?? baseName;

  if (t.locale === "ko") return `${localizedBase} 인근 정류장`;
  if (t.locale === "zh") return `${localizedBase} 周边站点`;
  if (t.locale === "ja") return `${localizedBase} 周辺の停留所`;
  return `${localizedBase} area stop`;
}

export function formatPrice(value, t) {
  return localizeMappedValue(value, t, localizedPrices);
}

export function formatOpenHours(value, t) {
  return localizeMappedValue(value, t, localizedOpenHours);
}

export function formatBusRouteLabel(value, t) {
  return localizeMappedValue(value, t, localizedBusRouteLabels);
}

export function formatDuration(minutes, t) {
  return `${minutes}${t.minuteSuffix ?? "m"}`;
}

export function formatSupportLabel(supported, t) {
  return supported ? t.supported ?? "Yes" : t.notSupported ?? "No";
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
    Gyeonggi: ["경기", "경기도", "京畿"],
    Gangwon: ["강원", "강원도", "江原"],
    Jeollanamdo: ["전남", "전라남도", "全羅南道", "全罗南道"],
    Jeonbuk: ["전북", "전라북도", "全北", "全羅北道", "全罗北道"],
    Gyeongsangbukdo: ["경북", "경상북도", "慶尚北道", "庆尚北道"],
    Gyeongsangnamdo: ["경남", "경상남도", "慶尚南道", "庆尚南道"],
    "수원시": ["수원", "Suwon", "Suwon-si", "水原", "水原市"],
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

export function getLanguageLabel(languageCode, t) {
  return (
    t?.languageLabels?.[languageCode] ??
    {
      ko: "KO",
      en: "EN",
      zh: "中文",
      ja: "日本語"
    }[languageCode]
  );
}
