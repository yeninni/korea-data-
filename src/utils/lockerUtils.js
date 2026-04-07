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
  },
  zh: {
    "Gwanghwamun Public Locker Center": "光化门公共储物柜",
    "Myeongdong Station Smart Locker": "明洞站智能储物柜",
    "Seoul Station Travel Locker": "首尔站旅行者储物柜",
    "Hongdae Tourist Locker": "弘大旅游储物柜",
    "Dongdaemun Design Plaza Locker": "东大门设计广场储物柜",
    "Incheon Airport Public Storage Desk": "仁川机场公共行李寄存处",
    "Busan Station Tourist Locker": "釜山站旅游储物柜",
    "Haeundae Beach Public Locker": "海云台海水浴场公共储物柜",
    "Jeju Airport Arrival Locker": "济州机场到达层储物柜",
    "Gyeongju Historic Area Locker": "庆州历史景区储物柜",
    "Dongdaegu Station Public Locker": "东大邱站公共储物柜",
    "Gangneung Station Easy Locker": "江陵站便捷储物柜"
  },
  ja: {
    "Gwanghwamun Public Locker Center": "光化門 公共ロッカー",
    "Myeongdong Station Smart Locker": "明洞駅 スマートロッカー",
    "Seoul Station Travel Locker": "ソウル駅 旅行者ロッカー",
    "Hongdae Tourist Locker": "弘大 観光ロッカー",
    "Dongdaemun Design Plaza Locker": "東大門デザインプラザ ロッカー",
    "Incheon Airport Public Storage Desk": "仁川空港 公共荷物預かり所",
    "Busan Station Tourist Locker": "釜山駅 観光ロッカー",
    "Haeundae Beach Public Locker": "海雲台海水浴場 公共ロッカー",
    "Jeju Airport Arrival Locker": "済州空港 到着階ロッカー",
    "Gyeongju Historic Area Locker": "慶州 歴史観光地ロッカー",
    "Dongdaegu Station Public Locker": "東大邱駅 公共ロッカー",
    "Gangneung Station Easy Locker": "江陵駅 かんたんロッカー"
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
  },
  zh: {
    "Jongno-gu": "钟路区",
    "Jung-gu": "中区",
    "Yongsan-gu": "龙山区",
    "Mapo-gu": "麻浦区",
    "Jung-gu, Incheon": "仁川中区",
    "Dong-gu, Busan": "釜山东区",
    "Haeundae-gu, Busan": "釜山海云台区",
    "Jeju-si": "济州市",
    "Gyeongju-si": "庆州市",
    "Dong-gu, Daegu": "大邱东区",
    "Gangneung-si": "江陵市"
  },
  ja: {
    "Jongno-gu": "鍾路区",
    "Jung-gu": "中区",
    "Yongsan-gu": "龍山区",
    "Mapo-gu": "麻浦区",
    "Jung-gu, Incheon": "仁川 中区",
    "Dong-gu, Busan": "釜山 東区",
    "Haeundae-gu, Busan": "釜山 海雲台区",
    "Jeju-si": "済州市",
    "Gyeongju-si": "慶州市",
    "Dong-gu, Daegu": "大邱 東区",
    "Gangneung-si": "江陵市"
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
  },
  zh: {
    "172 Sejong-daero, Jongno-gu, Seoul": "首尔钟路区世宗大路172",
    "Myeongdong Station Exit 6, Jung-gu, Seoul": "首尔中区明洞站6号出口",
    "Seoul Station Transfer Hall, 405 Hangang-daero": "首尔站换乘通道，汉江大路405",
    "Hongik University Station Exit 9, Mapo-gu, Seoul": "首尔麻浦区弘大入口站9号出口",
    "DDP Visitor Center, Eulji-ro, Jung-gu": "首尔中区乙支路东大门设计广场游客中心",
    "Terminal 1 Arrival Hall, Incheon International Airport": "仁川国际机场第1航站楼到达层",
    "Busan Station Main Hall, Jungang-daero, Dong-gu, Busan": "釜山东区中央大路釜山站大厅",
    "Haeundae Beach Tourist Information Center, Busan": "釜山海云台海水浴场旅游咨询中心",
    "Jeju International Airport Arrival Hall, Jeju": "济州国际机场到达层",
    "Hwangnidan-gil Tourist Information Area, Gyeongju": "庆州皇理团路旅游咨询区",
    "Dongdaegu Station Transfer Center, Dong-gu, Daegu": "大邱东区东大邱站换乘中心",
    "Gangneung Station Tourist Zone, Gangneung": "江陵站旅游咨询区"
  },
  ja: {
    "172 Sejong-daero, Jongno-gu, Seoul": "ソウル 鍾路区 世宗大路 172",
    "Myeongdong Station Exit 6, Jung-gu, Seoul": "ソウル 中区 明洞駅 6番出口",
    "Seoul Station Transfer Hall, 405 Hangang-daero": "ソウル駅 乗換通路、漢江大路 405",
    "Hongik University Station Exit 9, Mapo-gu, Seoul": "ソウル 麻浦区 弘大入口駅 9番出口",
    "DDP Visitor Center, Eulji-ro, Jung-gu": "ソウル 中区 乙支路 DDP観光案内センター",
    "Terminal 1 Arrival Hall, Incheon International Airport": "仁川国際空港 第1ターミナル 到着階",
    "Busan Station Main Hall, Jungang-daero, Dong-gu, Busan": "釜山 東区 中央大路 釜山駅コンコース",
    "Haeundae Beach Tourist Information Center, Busan": "釜山 海雲台海水浴場 観光案内所",
    "Jeju International Airport Arrival Hall, Jeju": "済州国際空港 到着階",
    "Hwangnidan-gil Tourist Information Area, Gyeongju": "慶州 皇理団通り 観光案内エリア",
    "Dongdaegu Station Transfer Center, Dong-gu, Daegu": "大邱 東区 東大邱駅 乗換センター",
    "Gangneung Station Tourist Zone, Gangneung": "江陵駅 観光案内エリア"
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
  },
  zh: {
    "Gwanghwamun Square": "光化门广场",
    "Myeongdong Entrance": "明洞入口",
    "Seoul Station Bus Transfer Center": "首尔站公交换乘中心",
    "Hongik University Station": "弘大入口站",
    "Dongdaemun Design Plaza": "东大门设计广场",
    "Incheon Airport T1": "仁川机场 T1",
    "Busan Station": "釜山站",
    "Haeundae Beach": "海云台海水浴场",
    "Jeju International Airport": "济州国际机场",
    "Daereungwon Tomb Complex": "大陵苑",
    "Dongdaegu Station Transfer Center": "东大邱站换乘中心",
    "Gangneung Station": "江陵站"
  },
  ja: {
    "Gwanghwamun Square": "光化門広場",
    "Myeongdong Entrance": "明洞入口",
    "Seoul Station Bus Transfer Center": "ソウル駅 バス乗換センター",
    "Hongik University Station": "弘大入口駅",
    "Dongdaemun Design Plaza": "東大門デザインプラザ",
    "Incheon Airport T1": "仁川空港 T1",
    "Busan Station": "釜山駅",
    "Haeundae Beach": "海雲台海水浴場",
    "Jeju International Airport": "済州国際空港",
    "Daereungwon Tomb Complex": "大陵苑",
    "Dongdaegu Station Transfer Center": "東大邱駅 乗換センター",
    "Gangneung Station": "江陵駅"
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
    "Small 3,000 KRW / Large 6,000 KRW": "소형 3,000원 / 대형 6,000원",
    "요금 정보는 공공데이터 상세 API에서 확인하세요.": "요금 정보는 공공데이터 상세 API에서 확인하세요."
  },
  zh: {
    "Small 2,000 KRW / Large 4,000 KRW": "小型 2,000韩元 / 大型 4,000韩元",
    "Small 2,000 KRW / Medium 3,000 KRW / Large 5,000 KRW":
      "小型 2,000韩元 / 中型 3,000韩元 / 大型 5,000韩元",
    "Small 2,000 KRW / Large 5,000 KRW": "小型 2,000韩元 / 大型 5,000韩元",
    "Small 2,000 KRW / Large 4,500 KRW": "小型 2,000韩元 / 大型 4,500韩元",
    "Small 2,000 KRW / Medium 3,000 KRW": "小型 2,000韩元 / 中型 3,000韩元",
    "Small 4,000 KRW / Large 8,000 KRW": "小型 4,000韩元 / 大型 8,000韩元",
    "Small 3,000 KRW / Large 6,000 KRW": "小型 3,000韩元 / 大型 6,000韩元",
    "요금 정보는 공공데이터 상세 API에서 확인하세요.": "费用信息请在公共数据详细 API 中查看。"
  },
  ja: {
    "Small 2,000 KRW / Large 4,000 KRW": "小型 2,000ウォン / 大型 4,000ウォン",
    "Small 2,000 KRW / Medium 3,000 KRW / Large 5,000 KRW":
      "小型 2,000ウォン / 中型 3,000ウォン / 大型 5,000ウォン",
    "Small 2,000 KRW / Large 5,000 KRW": "小型 2,000ウォン / 大型 5,000ウォン",
    "Small 2,000 KRW / Large 4,500 KRW": "小型 2,000ウォン / 大型 4,500ウォン",
    "Small 2,000 KRW / Medium 3,000 KRW": "小型 2,000ウォン / 中型 3,000ウォン",
    "Small 4,000 KRW / Large 8,000 KRW": "小型 4,000ウォン / 大型 8,000ウォン",
    "Small 3,000 KRW / Large 6,000 KRW": "小型 3,000ウォン / 大型 6,000ウォン",
    "요금 정보는 공공데이터 상세 API에서 확인하세요.": "料金情報は公共データ詳細 API で確認してください。"
  }
};

const localizedOpenHours = {
  ko: {
    "24 hours": "24시간 운영",
    "Open hours not provided": "운영시간 정보 없음"
  },
  zh: {
    "24 hours": "24小时营业",
    "Open hours not provided": "暂无营业时间信息"
  },
  ja: {
    "24 hours": "24時間営業",
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

const japaneseTextReplacements = [
  ["서울특별시", "ソウル特別市"],
  ["인천국제공항", "仁川国際空港"],
  ["제주국제공항", "済州国際空港"],
  ["홍대입구역", "弘大入口駅"],
  ["명동역", "明洞駅"],
  ["동대문디자인플라자", "東大門デザインプラザ"],
  ["서울역버스환승센터", "ソウル駅 バス乗換センター"],
  ["동대구역 환승센터", "東大邱駅 乗換センター"],
  ["환승센터", "乗換センター"],
  ["환승통로", "乗換通路"],
  ["관광안내센터", "観光案内センター"],
  ["관광안내 구역", "観光案内エリア"],
  ["해수욕장", "海水浴場"],
  ["기본요금", "基本料金"],
  ["추가요금", "追加料金"],
  ["소형", "小型"],
  ["중형", "中型"],
  ["대형", "大型"],
  ["물품보관함", "ロッカー"],
  ["공영", "公共"],
  ["여행자", "旅行者"],
  ["관광", "観光"],
  ["간편", "かんたん"],
  ["짐보관소", "荷物預かり所"],
  ["도착층", "到着階"],
  ["광장", "広場"],
  ["입구", "入口"],
  ["인근 정류장", "周辺の停留所"],
  ["제1터미널", "第1ターミナル"],
  ["서울역", "ソウル駅"],
  ["인천공항", "仁川空港"],
  ["부산역", "釜山駅"],
  ["제주공항", "済州空港"],
  ["동대구역", "東大邱駅"],
  ["강릉역", "江陵駅"],
  ["광화문", "光化門"],
  ["명동", "明洞"],
  ["홍대", "弘大"],
  ["동대문", "東大門"],
  ["해운대", "海雲台"],
  ["황리단길", "皇理団通り"],
  ["강릉", "江陵"],
  ["경주", "慶州"],
  ["서울", "ソウル"],
  ["인천", "仁川"],
  ["부산", "釜山"],
  ["대구", "大邱"],
  ["제주", "済州"],
  ["종로구", "鍾路区"],
  ["중구", "中区"],
  ["용산구", "龍山区"],
  ["마포구", "麻浦区"],
  ["동구", "東区"],
  ["해운대구", "海雲台区"],
  ["제주시", "済州市"],
  ["경주시", "慶州市"],
  ["강릉시", "江陵市"],
  ["종로", "鍾路"],
  ["을지로", "乙支路"],
  ["세종대로", "世宗大路"],
  ["한강대로", "漢江大路"]
];

const chineseTextReplacements = [
  ["서울특별시", "首尔特别市"],
  ["인천국제공항", "仁川国际机场"],
  ["제주국제공항", "济州国际机场"],
  ["홍대입구역", "弘大入口站"],
  ["명동역", "明洞站"],
  ["동대문디자인플라자", "东大门设计广场"],
  ["서울역버스환승센터", "首尔站公交换乘中心"],
  ["동대구역 환승센터", "东大邱站换乘中心"],
  ["환승센터", "换乘中心"],
  ["환승통로", "换乘通道"],
  ["관광안내센터", "旅游咨询中心"],
  ["관광안내 구역", "旅游咨询区"],
  ["해수욕장", "海水浴场"],
  ["기본요금", "基本费用"],
  ["추가요금", "附加费用"],
  ["소형", "小型"],
  ["중형", "中型"],
  ["대형", "大型"],
  ["물품보관함", "储物柜"],
  ["공영", "公共"],
  ["여행자", "旅行者"],
  ["관광", "旅游"],
  ["간편", "便捷"],
  ["짐보관소", "行李寄存处"],
  ["도착층", "到达层"],
  ["광장", "广场"],
  ["입구", "入口"],
  ["인근 정류장", "周边站点"],
  ["제1터미널", "第1航站楼"],
  ["서울역", "首尔站"],
  ["인천공항", "仁川机场"],
  ["부산역", "釜山站"],
  ["제주공항", "济州机场"],
  ["동대구역", "东大邱站"],
  ["강릉역", "江陵站"],
  ["광화문", "光化门"],
  ["명동", "明洞"],
  ["홍대", "弘大"],
  ["동대문", "东大门"],
  ["해운대", "海云台"],
  ["황리단길", "皇理团路"],
  ["강릉", "江陵"],
  ["경주", "庆州"],
  ["서울", "首尔"],
  ["인천", "仁川"],
  ["부산", "釜山"],
  ["대구", "大邱"],
  ["제주", "济州"],
  ["종로구", "钟路区"],
  ["중구", "中区"],
  ["용산구", "龙山区"],
  ["마포구", "麻浦区"],
  ["동구", "东区"],
  ["해운대구", "海云台区"],
  ["제주시", "济州市"],
  ["경주시", "庆州市"],
  ["강릉시", "江陵市"],
  ["종로", "钟路"],
  ["을지로", "乙支路"],
  ["세종대로", "世宗大路"],
  ["한강대로", "汉江大路"]
];

function localizeMappedValue(value, t, translations) {
  if (!value) return value;
  return translations[t.locale]?.[value] ?? value;
}

function replaceTerms(value, replacements) {
  return replacements.reduce((text, [source, target]) => text.replaceAll(source, target), value);
}

function localizeDynamicText(value, t) {
  if (!value) return value;

  if (t.locale === "ja") {
    return replaceTerms(value, japaneseTextReplacements).replace(/(\d+)호선/g, "$1号線");
  }

  if (t.locale === "zh") {
    return replaceTerms(value, chineseTextReplacements).replace(/(\d+)호선/g, "$1号线");
  }

  return value;
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

  if (localizedName !== cleanedName || t.locale === "zh") {
    return localizeDynamicText(localizedName, t);
  }

  if (t.locale === "ja") {
    return collapseRepeatedTerms(localizeDynamicText(localizeJapaneseLockerName(cleanedName), t));
  }

  return cleanedName;
}

export function formatDistrict(value, t) {
  return localizeDynamicText(localizeMappedValue(value, t, localizedDistricts), t);
}

export function formatAddress(value, t) {
  return localizeDynamicText(localizeMappedValue(value, t, localizedAddresses), t);
}

export function formatLandmark(value, t) {
  return localizeDynamicText(t.landmarkNames?.[value] ?? value, t);
}

export function formatBusStop(value, t) {
  const directLocalizedValue = localizeMappedValue(value, t, localizedBusStops);
  if (directLocalizedValue !== value) {
    return localizeDynamicText(directLocalizedValue, t);
  }

  const areaStopMatch = value?.match(/^(.*) area stop$/);
  if (areaStopMatch) {
    const baseName = areaStopMatch[1];
    const localizedBase = formatLandmark(baseName, t);

    if (t.locale === "ko") return `${localizedBase} 인근 정류장`;
    if (t.locale === "zh") return `${localizedBase} 周边站点`;
    if (t.locale === "ja") return `${localizedBase} 周辺の停留所`;
    return `${localizedBase} area stop`;
  }

  return localizeDynamicText(value, t);
}

export function formatPrice(value, t) {
  return localizeDynamicText(localizeMappedValue(value, t, localizedPrices), t);
}

export function formatOpenHours(value, t) {
  return localizeDynamicText(localizeMappedValue(value, t, localizedOpenHours), t);
}

export function formatBusRouteLabel(value, t) {
  return localizeDynamicText(localizeMappedValue(value, t, localizedBusRouteLabels), t);
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

export function haversineDistanceKm(from, to) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

export function sortLockers(lockers, sortMode, currentLocation = null) {
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

  if (currentLocation) {
    return sorted.sort((a, b) => {
      const distanceA =
        a.distanceFromUserKm ??
        haversineDistanceKm(currentLocation, { lat: a.latitude, lon: a.longitude });
      const distanceB =
        b.distanceFromUserKm ??
        haversineDistanceKm(currentLocation, { lat: b.latitude, lon: b.longitude });
      return distanceA - distanceB;
    });
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
