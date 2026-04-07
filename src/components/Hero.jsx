import Icon from "./Icon";

const landmarkLabelsByLanguage = {
  ko: {
    Gwanghwamun: "광화문",
    Myeongdong: "명동",
    "Seoul Station": "서울역",
    Hongdae: "홍대",
    Dongdaemun: "동대문",
    "Incheon Airport": "인천공항",
    "Busan Station": "부산역",
    Haeundae: "해운대",
    "Jeju Airport": "제주공항",
    "Hwangnidan-gil": "황리단길",
    "Gangneung Station": "강릉역"
  },
  en: {},
  zh: {},
  ja: {}
};

export default function Hero({
  t,
  language,
  query,
  onQueryChange,
  onUseLocation,
  landmarks,
  selectedLandmark,
  onLandmarkChange,
  regions,
  selectedRegion,
  onRegionChange,
  summary,
  dataStatus
}) {
  const landmarkLabels = landmarkLabelsByLanguage[language] ?? {};
  const statusTitle =
    language === "ko"
      ? "실시간 보관함 현황"
      : language === "en"
        ? "Live locker status"
        : language === "zh"
          ? "实时寄存柜状态"
          : "リアルタイム ロッカー状況";

  const statusSummary =
    language === "ko"
      ? `전체 ${summary.total}곳 중 ${summary.available}곳이 바로 이용 가능한 상태입니다.`
      : language === "en"
        ? `${summary.available} of ${summary.total} lockers are currently available.`
        : language === "zh"
          ? `共 ${summary.total} 个点位中，目前有 ${summary.available} 个可立即使用。`
          : `全 ${summary.total} 箇所のうち、現在 ${summary.available} 箇所がすぐ利用できます。`;

  return (
    <section id="home" className="relative overflow-hidden bg-civic-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(33,168,154,0.35),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(37,111,174,0.42),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold ring-1 ring-white/20">
            <Icon name="shield" className="h-4 w-4" />
            {t.heroBadge}
          </div>
          <div className="mt-3 inline-flex items-center rounded-full bg-transit-400/15 px-4 py-2 text-sm font-bold text-civic-50 ring-1 ring-white/15">
            {dataStatus}
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-civic-100">{t.heroText}</p>

          <div className="mt-8 rounded-[2rem] bg-white p-3 shadow-civic">
            <div className="flex flex-col gap-3 md:flex-row">
              <label className="flex flex-1 items-center gap-3 rounded-3xl bg-slate-50 px-5 py-4 text-slate-700 ring-1 ring-slate-200">
                <Icon name="search" className="h-5 w-5 text-civic-600" />
                <input
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                  placeholder={t.searchPlaceholder}
                />
              </label>
              <button
                type="button"
                onClick={onUseLocation}
                className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-3xl bg-civic-600 px-6 font-bold text-white hover:bg-civic-700"
              >
                <Icon name="map" className="h-5 w-5" />
                {t.useLocation}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-civic-100">{t.region}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => onRegionChange(region)}
                  className={`focus-ring rounded-full px-4 py-2 text-sm font-bold transition ${
                    selectedRegion === region
                      ? "bg-transit-400 text-civic-900"
                      : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
                  }`}
                >
                  {region === "All Korea" ? t.allRegions : region}
                </button>
              ))}
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-civic-100">
              {t.popularAreas}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {landmarks.map((landmark) => (
                <button
                  key={landmark}
                  type="button"
                  onClick={() => onLandmarkChange(landmark)}
                  className={`focus-ring rounded-full px-4 py-2 text-sm font-bold transition ${
                    selectedLandmark === landmark
                      ? "bg-white text-civic-700"
                      : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
                  }`}
                >
                  {landmarkLabels[landmark] ?? landmark}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-5 text-slate-900 shadow-civic">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-civic-600">{t.liveSummary}</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">{statusTitle}</h2>
            </div>
            <Icon name="luggage" className="h-10 w-10 text-transit-500" />
          </div>
          <div className="mt-6 grid gap-3">
            {[
              [t.availableNow, summary.Available, "bg-emerald-50 text-emerald-700"],
              [t.almostFull, summary["Almost Full"], "bg-amber-50 text-amber-700"],
              [t.full, summary.Full, "bg-rose-50 text-rose-700"]
            ].map(([label, count, color]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span className="font-bold text-slate-700">{label}</span>
                <span className={`rounded-full px-3 py-1 text-lg font-black ${color}`}>{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-civic-50 p-4 text-sm leading-6 text-civic-700">
            {statusSummary}
          </div>
        </div>
      </div>
    </section>
  );
}
