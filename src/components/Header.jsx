import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ t, language, onLanguageChange }) {
  const logoSrc = `${import.meta.env.BASE_URL}brand-logo-square.png`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <a href="#home" className="focus-ring flex items-center gap-3 rounded-xl">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200">
            <img src={logoSrc} alt="" className="h-full w-full object-cover" />
          </span>
          <span>
            <span className="block text-lg font-extrabold tracking-tight text-slate-950">
              {t.serviceName}
            </span>
            <span className="block text-sm text-slate-500">{t.tagline}</span>
          </span>
        </a>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <nav className="flex flex-wrap gap-2 text-sm font-semibold text-slate-600">
            {[
              ["#home", t.navHome],
              ["#map", t.navMap],
              ["#about", t.navAbout]
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="focus-ring rounded-full px-4 py-2 hover:bg-civic-50 hover:text-civic-700"
              >
                {label}
              </a>
            ))}
          </nav>
          <LanguageSwitcher language={language} onChange={onLanguageChange} />
        </div>
      </div>
    </header>
  );
}
