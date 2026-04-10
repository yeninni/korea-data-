import { publicDataSources } from "../data/publicDataSources";
import Icon from "./Icon";

export default function AboutSection({ t }) {
  const conciseAboutText =
    {
      ko: "짐 보관 시설에 대한 정보 접근성이 낮을 경우 관광객의 이동 편의성이 저하되며, 특정 장소로 수요가 집중되는 현상이 발생합니다. 본 서비스는 실시간 보관함 이용 정보와 대중교통 정보를 연계해 제공함으로써, 사용자가 의사결정에 맞는 보관 옵션을 빠르게 선택할 수 있도록 지원합니다.",
      en: "Travelers lose time when locker information is hard to find. This service combines real-time locker and transit data so people can choose faster and move more comfortably.",
      zh: "如果游客无法及时找到可用的行李寄存点，就容易耽误行程，也会让需求集中到少数地点。本服务结合储物柜实时信息与公共交通信息，帮助用户更快做出选择。",
      ja: "旅行者が使えるロッカーをすぐ見つけられないと、移動が不便になり、利用が一部の場所に集中しやすくなります。このサービスは、ロッカーの空き情報と公共交通情報をあわせて案内し、より早く選べるようにします。"
    }[t.locale] ?? t.aboutText;

  return (
    <section id="about" className="bg-civic-900 py-12 text-white">
      <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="text-center lg:text-left">
          <p className="font-soft text-xs uppercase tracking-[0.2em] text-civic-100">
            {t.aboutEyebrow}
          </p>
          <h2 className="mt-3 font-display font-semibold text-3xl tracking-tight sm:text-[2.5rem]">
            {t.aboutTitle}
          </h2>
          <p className="mt-4 max-w-2xl font-soft text-base leading-7 text-civic-100 lg:max-w-none">
            {conciseAboutText}
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-5 text-slate-900 shadow-civic">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-civic-50 text-civic-700">
              <Icon name="shield" className="h-5 w-5" />
            </span>
            <h3 className="font-display font-semibold text-xl tracking-tight">{t.dataTitle}</h3>
          </div>

          <div className="mt-5 grid gap-3">
            {publicDataSources.map((source) => {
              const localizedSource = source.localized?.[t.locale] ?? source;

              return (
                <article
                  key={source.name}
                  className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
                >
                  <h4 className="font-display text-lg font-semibold text-slate-950">
                    {localizedSource.name}
                  </h4>
                  <p className="mt-1 font-soft text-sm text-civic-700">
                    {localizedSource.provider}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-slate-600">{localizedSource.role}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
