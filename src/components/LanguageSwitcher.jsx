import { languages } from "../i18n/dictionary";
import Icon from "./Icon";

export default function LanguageSwitcher({ language, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
      <Icon name="globe" className="ml-2 h-4 w-4 text-civic-600" />
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => onChange(item.code)}
          className={`focus-ring rounded-full px-3 py-2 text-sm font-semibold transition ${
            language === item.code
              ? "bg-civic-600 text-white"
              : "text-slate-600 hover:bg-civic-50 hover:text-civic-700"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
