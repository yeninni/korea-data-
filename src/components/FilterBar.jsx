import Icon from "./Icon";

export default function FilterBar({
  t,
  sortMode,
  onSortModeChange,
  largeOnly,
  onLargeOnlyChange
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-civic-50 text-civic-700">
          <Icon name="sliders" className="h-5 w-5" />
        </span>
        {t.sortBy}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={sortMode}
          onChange={(event) => onSortModeChange(event.target.value)}
          className="focus-ring min-h-12 rounded-2xl border border-slate-200 bg-white px-4 font-semibold text-slate-700"
        >
          <option value="nearest">{t.nearest}</option>
          <option value="leastCrowded">{t.leastCrowded}</option>
          <option value="fastestBus">{t.fastestBus}</option>
        </select>

        <label className="focus-within:ring-civic-500 flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 px-4 font-semibold text-slate-700 focus-within:ring-2">
          <input
            type="checkbox"
            checked={largeOnly}
            onChange={(event) => onLargeOnlyChange(event.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-civic-600"
          />
          {t.largeLuggageOnly}
        </label>
      </div>
    </div>
  );
}
