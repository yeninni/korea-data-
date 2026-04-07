import { useEffect, useMemo, useState } from "react";
import AboutSection from "./components/AboutSection";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MapExplorer from "./components/MapExplorer";
import TouristRecommendations from "./components/TouristRecommendations";
import { landmarks, regions } from "./data/lockers";
import { dictionary } from "./i18n/dictionary";
import { fetchLockerStatus, getMockLockerPayload } from "./services/publicDataClient";
import { haversineDistanceKm, matchesSearch, sortLockers, summarize } from "./utils/lockerUtils";

export default function App() {
  const [language, setLanguage] = useState("ko");
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Korea");
  const [selectedLandmark, setSelectedLandmark] = useState("");
  const [sortMode, setSortMode] = useState("nearest");
  const [largeOnly, setLargeOnly] = useState(false);
  const [selectedLockerId, setSelectedLockerId] = useState("locker-gwanghwamun-01");
  const [lockerPayload, setLockerPayload] = useState(getMockLockerPayload);
  const [dataStatus, setDataStatus] = useState("Loading public locker data...");
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
        setDataStatus(`Live public locker data + nationwide demo coverage · ${payload.lockers.length} locations`);
        setSelectedLockerId(payload.lockers[0]?.id ?? "locker-gwanghwamun-01");
        setSelectedRegion("All Korea");
        setSelectedLandmark("");
      })
      .catch(() => {
        if (ignore) return;
        const fallbackPayload = getMockLockerPayload();
        setLockerPayload(fallbackPayload);
        setDataStatus("Demo fallback data · API proxy not connected");
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
    null;

  const summary = summarize(lockerData);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header t={t} language={language} onLanguageChange={setLanguage} />
      <Hero
        t={t}
        language={language}
        query={query}
        onQueryChange={setQuery}
        onUseLocation={handleUseLocation}
        landmarks={landmarks}
        selectedLandmark={selectedLandmark}
        onLandmarkChange={handleLandmarkChange}
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        summary={summary}
        dataStatus={dataStatus}
      />
      <MapExplorer
        t={t}
        language={language}
        lockers={filteredLockers}
        selectedLocker={selectedLocker}
        onSelectLocker={(locker) => setSelectedLockerId(locker.id)}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        largeOnly={largeOnly}
        onLargeOnlyChange={setLargeOnly}
        currentLocation={currentLocation}
        onUseLocation={handleUseLocation}
        locationStatus={locationStatus}
        locationFocusToken={locationFocusToken}
      />
      <TouristRecommendations
        t={t}
        landmarks={landmarks}
        lockers={lockerData}
        selectedLocker={selectedLocker}
        onSelectLocker={(locker) => setSelectedLockerId(locker.id)}
      />
      <AboutSection t={t} />
    </div>
  );
}
