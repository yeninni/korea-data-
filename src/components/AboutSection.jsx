import { publicDataSources } from "../data/publicDataSources";
import Icon from "./Icon";

export default function AboutSection({ t }) {
  return (
    <section id="about" className="bg-civic-900 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-civic-100">Public value</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t.aboutTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-civic-100">{t.aboutText}</p>
        </div>

        <div className="rounded-[2rem] bg-white p-5 text-slate-900 shadow-civic">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-civic-50 text-civic-700">
              <Icon name="shield" className="h-6 w-6" />
            </span>
            <h3 className="text-2xl font-black tracking-tight">{t.dataTitle}</h3>
          </div>

          <div className="mt-6 grid gap-4">
            {publicDataSources.map((source) => (
              <article key={source.name} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <h4 className="font-black text-slate-950">{source.name}</h4>
                <p className="mt-1 text-sm font-semibold text-civic-700">{source.provider}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{source.role}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
