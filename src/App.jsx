import { useEffect, useMemo, useState } from "react";
import AboutSection from "./components/AboutSection";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MapExplorer from "./components/MapExplorer";
import TouristRecommendations from "./components/TouristRecommendations";
import { landmarks, regions } from "./data/lockers";
import { dictionary } from "./i18n/dictionary";
import { fetchLockerStatus, getMockLockerPayload } from "./services/publicDataClient";
import { matchesSearch, sortLockers, summarize } from "./utils/lockerUtils";

export default function App() {
  const [language, setLanguage] = useState("en");
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Korea");
  const [selectedLandmark, setSelectedLandmark] = useState("");
  const [sortMode, setSortMode] = useState("nearest");
  const [largeOnly, setLargeOnly] = useState(false);
  const [selectedLockerId, setSelectedLockerId] = useState("locker-gwanghwamun-01");
  const [lockerPayload, setLockerPayload] = useState(getMockLockerPayload);
  const [dataStatus, setDataStatus] = useState("liveDataStatus");

  const t = dictionary[language];
  const lockerData = lockerPayload.lockers;

  useEffect(() => {
    let ignore = false;

    fetchLockerStatus()
      .then((payload) => {
        if (ignore) return;
        setLockerPayload(payload);
        setDataStatus("liveDataStatus");
        setSelectedLockerId(payload.lockers[0]?.id ?? "locker-gwanghwamun-01");
        setSelectedRegion("All Korea");
        setSelectedLandmark("");
      })
      .catch(() => {
        if (ignore) return;
        const fallbackPayload = getMockLockerPayload();
        setLockerPayload(fallbackPayload);
        setDataStatus("liveDataStatus");
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredLockers = useMemo(() => {
    const regionFiltered = lockerData.filter((locker) => {
      return selectedRegion === "All Korea" || locker.region === selectedRegion;
    });

    const landmarkFiltered = regionFiltered.filter((locker) => {
      if (!selectedLandmark) return true;
      if (query) return locker.nearbyLandmark === selectedLandmark || matchesSearch(locker, query);
      return locker.nearbyLandmark === selectedLandmark;
    });

    const queryFiltered = landmarkFiltered
      .filter((locker) => matchesSearch(locker, query))
      .filter((locker) => (largeOnly ? locker.largeLuggage : true));

    const sorted = sortLockers(queryFiltered, sortMode);
    return sorted;
  }, [largeOnly, lockerData, query, selectedLandmark, selectedRegion, sortMode]);

  const selectedLocker =
    filteredLockers.find((locker) => locker.id === selectedLockerId) ||
    filteredLockers[0] ||
    lockerData.find((locker) => locker.id === selectedLockerId) ||
    null;

  const summary = summarize(lockerData);

  function handleUseLocation() {
    setQuery("Seoul Station");
    setSelectedRegion("All Korea");
    setSelectedLandmark("Seoul Station");
    setSelectedLockerId("locker-seoulstation-01");
  }

  function handleQueryChange(value) {
    setQuery(value);
    if (value.trim()) {
      setSelectedRegion("All Korea");
      setSelectedLandmark("");
    }
  }

  function handleLandmarkChange(landmark) {
    setSelectedLandmark(landmark);
    setQuery("");
    const locker = lockerData.find((item) => item.nearbyLandmark === landmark);
    if (locker) {
      setSelectedLockerId(locker.id);
      setSelectedRegion(locker.region ?? "All Korea");
    }
  }

  function handleRegionChange(region) {
    setSelectedRegion(region);
    setQuery("");
    const locker = lockerData.find((item) => region === "All Korea" || item.region === region);
    if (locker) {
      setSelectedLockerId(locker.id);
      setSelectedLandmark(locker.nearbyLandmark);
    }
  }

  function handleSelectLocker(locker) {
    setSelectedLockerId(locker.id);
    setSelectedRegion(locker.region ?? "All Korea");
    setSelectedLandmark(locker.nearbyLandmark ?? "");
    setQuery("");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header t={t} language={language} onLanguageChange={setLanguage} />
      <Hero
        t={t}
        query={query}
        onQueryChange={handleQueryChange}
        onUseLocation={handleUseLocation}
        landmarks={landmarks}
        selectedLandmark={selectedLandmark}
        onLandmarkChange={handleLandmarkChange}
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        summary={summary}
        dataStatus={t[dataStatus]}
      />
      <MapExplorer
        t={t}
        lockers={filteredLockers}
        mapLockers={lockerData}
        selectedLocker={selectedLocker}
        onSelectLocker={handleSelectLocker}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        largeOnly={largeOnly}
        onLargeOnlyChange={setLargeOnly}
      />
      <TouristRecommendations
        t={t}
        landmarks={landmarks}
        lockers={lockerData}
        selectedLocker={selectedLocker}
        onSelectLocker={handleSelectLocker}
      />
      <AboutSection t={t} />
    </div>
  );
}
