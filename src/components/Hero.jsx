import Icon from "./Icon";

export default function Hero({
  t,
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
  dataStatus,
  searchSuggestions,
  onSearchSelect,
  onSearchSubmit
}) {
  const showSuggestions = query.trim().length > 0;
  const dataSourceCredit =
    {
      ko: "행정안전부·한국지역정보개발원 제공 공공데이터를 활용해 제작되었습니다.",
      en:
        "Built using public data provided by the Ministry of the Interior and Safety and the Korea Local Information Research & Development Institute.",
      zh: "本服务基于行政安全部与韩国地域信息开发院提供的公共数据制作。",
      ja:
        "本サービスは、行政安全部と韓国地域情報開発院が提供する公共データを活用して制作されています。"
    }[t.locale] ?? "Built using public data provided by the source institutions.";
  const lockerSizeGuide = [
    {
      key: "small",
      label: t.sizeSmall,
      description: t.sizeSmallDescription,
      tone: "bg-civic-50 text-civic-700"
    },
    {
      key: "medium",
      label: t.sizeMedium,
      description: t.sizeMediumDescription,
      tone: "bg-amber-50 text-amber-700"
    },
    {
      key: "large",
      label: t.sizeLarge,
      description: t.sizeLargeDescription,
      tone: "bg-emerald-50 text-emerald-700"
    }
  ];

  function handleSubmit(event) {
    event.preventDefault();
    onSearchSubmit();
  }

  return (
    <section id="home" className="relative overflow-hidden bg-civic-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(33,168,154,0.35),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(37,111,174,0.42),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
        <div>
          <p className="inline-flex max-w-2xl items-center gap-2 font-soft text-sm leading-6 text-civic-100/90">
            <Icon name="shield" className="h-4 w-4 shrink-0" />
            <span>{dataSourceCredit}</span>
          </p>
          <h1 className="mt-6 max-w-3xl font-display font-bold text-4xl tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl font-soft text-lg leading-8 text-civic-100">{t.heroText}</p>

          <form onSubmit={handleSubmit} className="mt-8 rounded-[2rem] bg-white p-3 shadow-civic">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <label className="flex items-center gap-3 rounded-3xl bg-slate-50 px-5 py-4 text-slate-700 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-civic-500">
                  <Icon name="search" className="h-5 w-5 text-civic-600" />
                  <input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                    placeholder={t.searchPlaceholder}
                  />
                </label>

                {showSuggestions && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-[1.5rem] bg-white text-slate-900 shadow-civic ring-1 ring-slate-200">
                    <p className="px-4 py-3 font-soft text-xs uppercase tracking-[0.18em] text-civic-600">
                      {t.searchSuggestions}
                    </p>
                    {searchSuggestions.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto">
                        {searchSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onClick={() => onSearchSelect(suggestion)}
                            className="focus-ring flex w-full items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 text-left hover:bg-civic-50"
                          >
                            <span>
                              <span className="block font-display font-semibold text-slate-950">{suggestion.label}</span>
                              <span className="mt-1 block font-soft text-sm text-slate-500">{suggestion.meta}</span>
                            </span>
                            {suggestion.count !== undefined && (
                              <span className="rounded-full bg-civic-50 px-3 py-1 font-display text-xs font-semibold text-civic-700">
                                {suggestion.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="border-t border-slate-100 px-4 py-4 text-sm text-slate-500">
                        {t.searchNoResults}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="focus-ring inline-flex min-h-14 items-center justify-center rounded-3xl bg-transit-400 px-6 font-display font-semibold text-civic-950 hover:bg-transit-300"
              >
                {t.search}
              </button>
              <button
                type="button"
                onClick={onUseLocation}
                className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-3xl bg-civic-600 px-6 font-display font-semibold text-white hover:bg-civic-700"
              >
                <Icon name="map" className="h-5 w-5" />
                {t.useLocation}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="font-soft text-sm uppercase tracking-[0.2em] text-civic-100">{t.region}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => onRegionChange(region)}
                  className={`focus-ring rounded-full px-4 py-2 font-display text-sm font-semibold transition ${
                    selectedRegion === region
                      ? "bg-transit-400 text-civic-900"
                      : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
                  }`}
                >
                  {t.regionNames?.[region] ?? (region === "All Korea" ? t.allRegions : region)}
                </button>
              ))}
            </div>

            <p className="mt-6 font-soft text-sm uppercase tracking-[0.2em] text-civic-100">
              {t.popularAreas}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {landmarks.map((landmark) => (
                <button
                  key={landmark}
                  type="button"
                  onClick={() => onLandmarkChange(landmark)}
                  className={`focus-ring rounded-full px-4 py-2 font-display text-sm font-semibold transition ${
                    selectedLandmark === landmark
                      ? "bg-white text-civic-700"
                      : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
                  }`}
                >
                  {t.landmarkNames?.[landmark] ?? landmark}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-5 text-slate-900 shadow-civic">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-soft text-sm text-civic-600">{t.liveSummary}</p>
              <h2 className="mt-1 font-display font-semibold text-2xl tracking-tight">
                {t.statusTitle ?? "Public locker status"}
              </h2>
            </div>
            <span className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-civic-50 text-transit-500">
              <Icon name="luggage" className="h-7 w-7" />
            </span>
          </div>
          <div className="mt-6 grid gap-3">
            {[
              [t.availableNow, summary.Available, "bg-emerald-50 text-emerald-700"],
              [t.almostFull, summary["Almost Full"], "bg-amber-50 text-amber-700"],
              [t.full, summary.Full, "bg-rose-50 text-rose-700"]
            ].map(([label, count, color]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span className="font-display font-semibold text-slate-700">{label}</span>
                <span className={`rounded-full px-3 py-1 font-display text-lg font-bold ${color}`}>{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-civic-50 p-4 font-soft text-sm leading-6 text-civic-700">
            {(t.availabilitySummary ?? "{available} / {total} lockers are shown as available in this demo dataset.")
              .replace("{available}", summary.available)
              .replace("{total}", summary.total)}
          </div>

          <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-civic-700 ring-1 ring-slate-200">
                <Icon name="luggage" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-soft text-xs uppercase tracking-[0.18em] text-civic-600">
                  {t.sizeGuideEyebrow}
                </p>
                <h3 className="mt-1 font-display font-semibold text-lg text-slate-950">
                  {t.sizeGuideTitle}
                </h3>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {lockerSizeGuide.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200"
                >
                  <span
                    className={`inline-flex min-w-[62px] items-center justify-center rounded-full px-3 py-1 font-display text-xs font-semibold ${item.tone}`}
                  >
                    {item.label}
                  </span>
                  <p className="font-soft text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 font-soft text-xs leading-5 text-slate-500">{t.sizeGuideNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
