import { useEffect, useMemo, useState } from "react";
import AboutSection from "./components/AboutSection";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LockerAssistant from "./components/LockerAssistant";
import MapExplorer from "./components/MapExplorer";
import { landmarks, regions } from "./data/lockers";
import { dictionary } from "./i18n/dictionary";
import { fetchLockerStatus, getMockLockerPayload } from "./services/publicDataClient";
import {
  formatLockerName,
  haversineDistanceKm,
  matchesSearch,
  sortLockers,
  summarize
} from "./utils/lockerUtils";

export default function App() {
  const [language, setLanguage] = useState("ko");
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Korea");
  const [selectedLandmark, setSelectedLandmark] = useState("");
  const [sortMode, setSortMode] = useState("nearest");
  const [largeOnly, setLargeOnly] = useState(false);
  const [selectedLockerId, setSelectedLockerId] = useState("locker-gwanghwamun-01");
  const [lockerPayload, setLockerPayload] = useState(getMockLockerPayload);
  const [dataStatus, setDataStatus] = useState("liveDataStatus");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationFocusToken, setLocationFocusToken] = useState(0);

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
        setLockerPayload(getMockLockerPayload());
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

    const distanceAware = queryFiltered.map((locker) => ({
      ...locker,
      distanceFromUserKm: currentLocation
        ? haversineDistanceKm(currentLocation, { lat: locker.latitude, lon: locker.longitude })
        : null
    }));

    return sortLockers(distanceAware, sortMode, currentLocation);
  }, [currentLocation, largeOnly, lockerData, query, selectedLandmark, selectedRegion, sortMode]);

  const selectedLocker =
    filteredLockers.find((locker) => locker.id === selectedLockerId) ||
    filteredLockers[0] ||
    lockerData.find((locker) => locker.id === selectedLockerId) ||
    null;

  const summary = summarize(lockerData);
  const searchSuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    const regionCounts = lockerData.reduce((counts, locker) => {
      counts[locker.region] = (counts[locker.region] ?? 0) + 1;
      return counts;
    }, {});

    const regionSuggestions = regions
      .filter((region) => region !== "All Korea")
      .filter((region) => {
        const regionLabel = t.regionNames?.[region] ?? region;
        return `${region} ${regionLabel}`.toLowerCase().includes(normalizedQuery);
      })
      .map((region) => ({
        id: `region-${region}`,
        type: "region",
        region,
        label: t.regionNames?.[region] ?? region,
        meta: t.searchRegion,
        count: regionCounts[region] ?? 0
      }));

    const lockerSuggestions = sortLockers(
      lockerData.filter((locker) => matchesSearch(locker, query)),
      sortMode,
      currentLocation
    )
      .slice(0, 6)
      .map((locker) => ({
        id: locker.id,
        type: "locker",
        locker,
        label: formatLockerName(locker, t),
        meta: `${t.searchLocker} · ${t.regionNames?.[locker.region] ?? locker.region}`
      }));

    return [...regionSuggestions, ...lockerSuggestions].slice(0, 8);
  }, [currentLocation, lockerData, query, regions, sortMode, t]);

  function scrollToMap() {
    window.setTimeout(() => {
      document.getElementById("map")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextLocation = { lat: coords.latitude, lon: coords.longitude };
        setCurrentLocation(nextLocation);
        setLocationStatus("ready");
        setLocationFocusToken(Date.now());
        setQuery("");
        setSelectedRegion("All Korea");
        setSelectedLandmark("");
        setSortMode("nearest");

        const nearestLocker = [...lockerData]
          .map((locker) => ({
            ...locker,
            distanceFromUserKm: haversineDistanceKm(nextLocation, {
              lat: locker.latitude,
              lon: locker.longitude
            })
          }))
          .sort((a, b) => a.distanceFromUserKm - b.distanceFromUserKm)[0];

        if (nearestLocker) {
          setSelectedLockerId(nearestLocker.id);
        }

        scrollToMap();
      },
      () => {
        setLocationStatus("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  function handleQueryChange(value) {
    setQuery(value);
    if (value.trim()) {
      setSelectedRegion("All Korea");
      setSelectedLandmark("");
    }
  }

  function handleSearchSelect(suggestion) {
    if (suggestion.type === "region") {
      handleRegionChange(suggestion.region);
      scrollToMap();
      return;
    }

    handleSelectLocker(suggestion.locker);
    scrollToMap();
  }

  function handleSearchSubmit() {
    if (searchSuggestions[0]) {
      handleSearchSelect(searchSuggestions[0]);
      return;
    }

    scrollToMap();
  }

  function handleLandmarkChange(landmark) {
    setSelectedLandmark(landmark);
    setQuery("");
    const locker = lockerData.find((item) => item.nearbyLandmark === landmark);
    if (locker) {
      setSelectedLockerId(locker.id);
      setSelectedRegion(locker.region ?? "All Korea");
      scrollToMap();
    }
  }

  function handleRegionChange(region) {
    setSelectedRegion(region);
    setQuery("");
    setSelectedLandmark("");
    const locker = lockerData.find((item) => region === "All Korea" || item.region === region);
    if (locker) {
      setSelectedLockerId(locker.id);
      scrollToMap();
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
        searchSuggestions={searchSuggestions}
        onSearchSelect={handleSearchSelect}
        onSearchSubmit={handleSearchSubmit}
      />
      <MapExplorer
        t={t}
        language={language}
        lockers={filteredLockers}
        selectedLocker={selectedLocker}
        onSelectLocker={handleSelectLocker}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        largeOnly={largeOnly}
        onLargeOnlyChange={setLargeOnly}
        currentLocation={currentLocation}
        onUseLocation={handleUseLocation}
        locationStatus={locationStatus}
        locationFocusToken={locationFocusToken}
      />
      <LockerAssistant
        t={t}
        lockers={lockerData}
        selectedLocker={selectedLocker}
        onSelectLocker={handleSelectLocker}
      />
      <AboutSection t={t} />
    </div>
  );
}
