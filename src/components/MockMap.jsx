import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { formatLockerName, statusStyles } from "../utils/lockerUtils";

const DEFAULT_CENTER = { lat: 36.35, lng: 127.85 };
const DEFAULT_LEVEL = 13;
const MIN_LEVEL = 1;
const MAX_LEVEL = 14;
const KAKAO_MAP_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

let kakaoMapsPromise = null;

function loadKakaoMaps(appKey) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Map is only available in the browser."));
  }

  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  if (!appKey) {
    return Promise.reject(new Error("VITE_KAKAO_MAP_APP_KEY is required."));
  }

  if (kakaoMapsPromise) {
    return kakaoMapsPromise;
  }

  kakaoMapsPromise = new Promise((resolve, reject) => {
    const scriptId = "kakao-maps-sdk";
    const existingScript = document.getElementById(scriptId);

    const handleLoad = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao Maps SDK did not load."));
        return;
      }

      window.kakao.maps.load(() => resolve(window.kakao));
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Kakao Maps SDK.")), {
        once: true
      });

      if (window.kakao?.maps) {
        handleLoad();
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load Kakao Maps SDK.")), { once: true });
    document.head.appendChild(script);
  });

  return kakaoMapsPromise;
}

function createCurrentLocationMarkerImage(kakao) {
  const width = 26;
  const height = 34;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 26 34">
      <path
        d="M13 1C7.48 1 3 5.41 3 10.85c0 7.95 10 21.15 10 21.15s10-13.2 10-21.15C23 5.41 18.52 1 13 1Z"
        fill="#ef4444"
        stroke="#ffffff"
        stroke-width="2"
      />
      <circle cx="13" cy="11" r="4.2" fill="#ffffff" />
    </svg>
  `;

  return new kakao.maps.MarkerImage(
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    new kakao.maps.Size(width, height),
    { offset: new kakao.maps.Point(width / 2, height - 2) }
  );
}

export default function MockMap({
  lockers,
  selectedLocker,
  focusedLockerId,
  onSelect,
  onRegionSelect,
  t,
  currentLocation,
  onUseLocation,
  locationStatus,
  locationFocusToken
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const labelOverlaysRef = useRef([]);
  const currentMarkerRef = useRef(null);
  const [mapState, setMapState] = useState(KAKAO_MAP_APP_KEY ? "loading" : "missing-key");
  const [mapLevel, setMapLevel] = useState(DEFAULT_LEVEL);

  const visibleLockers = useMemo(
    () =>
      lockers.filter(
        (locker) => Number.isFinite(locker.latitude) && Number.isFinite(locker.longitude)
      ),
    [lockers]
  );
  const selectedVisibleLocker =
    selectedLocker &&
    visibleLockers.some((locker) => locker.id === selectedLocker.id) &&
    Number.isFinite(selectedLocker.latitude) &&
    Number.isFinite(selectedLocker.longitude)
      ? selectedLocker
      : null;

  function clearMapDecorations() {
    labelOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    labelOverlaysRef.current = [];

    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
      currentMarkerRef.current = null;
    }
  }

  function handleLocateClick() {
    if (currentLocation && window.kakao?.maps && mapRef.current) {
      const position = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lon);
      mapRef.current.setLevel(4);
      mapRef.current.panTo(position);
      return;
    }

    onUseLocation?.();
  }

  function handleZoom(nextLevel) {
    if (!mapRef.current) return;
    const clampedLevel = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, nextLevel));
    mapRef.current.setLevel(clampedLevel);
    setMapLevel(clampedLevel);
  }

  useEffect(() => {
    let cancelled = false;

    if (!KAKAO_MAP_APP_KEY) {
      setMapState("missing-key");
      return undefined;
    }

    setMapState("loading");

    loadKakaoMaps(KAKAO_MAP_APP_KEY)
      .then((kakao) => {
        if (cancelled || !containerRef.current) return;

        if (!mapRef.current) {
          mapRef.current = new kakao.maps.Map(containerRef.current, {
            center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
            level: DEFAULT_LEVEL
          });

          kakao.maps.event.addListener(mapRef.current, "zoom_changed", () => {
            setMapLevel(mapRef.current.getLevel());
          });
        }

        setMapLevel(mapRef.current.getLevel());
        setMapState("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setMapState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mapState !== "ready" || !window.kakao?.maps || !mapRef.current) {
      return;
    }

    const { kakao } = window;
    const map = mapRef.current;

    clearMapDecorations();

    if (visibleLockers.length === 0) {
      map.setCenter(new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng));
      map.setLevel(DEFAULT_LEVEL);
      setMapLevel(DEFAULT_LEVEL);
      return;
    }

    const bounds = new kakao.maps.LatLngBounds();

    visibleLockers.forEach((locker) => {
      const position = new kakao.maps.LatLng(locker.latitude, locker.longitude);
      const selected = selectedVisibleLocker?.id === locker.id;
      const labelContent = document.createElement("button");
      labelContent.type = "button";
      labelContent.className = `kakao-map-label${selected ? " is-selected" : ""}${
        locker.isRegionMarker ? " is-region" : ""
      }`;

      const markerDot = document.createElement("span");
      markerDot.className = `kakao-map-label-dot ${statusStyles[locker.availabilityStatus].marker}`;

      const markerText = document.createElement("span");
      markerText.className = "kakao-map-label-text";
      markerText.textContent = locker.isRegionMarker ? locker.name : formatLockerName(locker, t);

      labelContent.appendChild(markerDot);
      labelContent.appendChild(markerText);

      if (locker.isRegionMarker) {
        const countBadge = document.createElement("span");
        countBadge.className = "kakao-map-label-count";
        countBadge.textContent = `${locker.lockerCount}`;
        labelContent.appendChild(countBadge);
      }

      labelContent.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (locker.isRegionMarker) {
          onRegionSelect?.(locker.region);
          return;
        }

        onSelect(locker);
      });
      const labelOverlay = new kakao.maps.CustomOverlay({
        position,
        content: labelContent,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: locker.isRegionMarker ? 100 + (locker.lockerCount ?? 0) : selected ? 1000 : 10
      });
      labelOverlay.setMap(map);
      labelOverlaysRef.current.push(labelOverlay);
      bounds.extend(position);
    });

    if (currentLocation) {
      const currentPosition = new kakao.maps.LatLng(currentLocation.lat, currentLocation.lon);
      currentMarkerRef.current = new kakao.maps.Marker({
        position: currentPosition,
        title: "Current location",
        image: createCurrentLocationMarkerImage(kakao),
        zIndex: 7
      });
      currentMarkerRef.current.setMap(map);
    }

    if (
      selectedVisibleLocker &&
      !selectedVisibleLocker.isRegionMarker &&
      focusedLockerId === selectedVisibleLocker.id
    ) {
      map.setLevel(5);
      map.panTo(new kakao.maps.LatLng(selectedVisibleLocker.latitude, selectedVisibleLocker.longitude));
      setMapLevel(5);
      return;
    }

    if (visibleLockers.length === 1) {
      const centerTarget = currentLocation
        ? new kakao.maps.LatLng(currentLocation.lat, currentLocation.lon)
        : new kakao.maps.LatLng(visibleLockers[0].latitude, visibleLockers[0].longitude);
      map.setCenter(centerTarget);
      map.setLevel(5);
      setMapLevel(5);
    } else if (!currentLocation) {
      map.setBounds(bounds, 60, 60, 60, 60);
      setMapLevel(map.getLevel());
    }
  }, [currentLocation, focusedLockerId, mapState, onRegionSelect, onSelect, selectedVisibleLocker, t, visibleLockers]);

  useEffect(() => {
    if (
      mapState !== "ready" ||
      !window.kakao?.maps ||
      !mapRef.current ||
      !currentLocation ||
      !locationFocusToken
    ) {
      return;
    }

    const currentPosition = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lon);
    mapRef.current.setLevel(4);
    mapRef.current.setCenter(currentPosition);
    setMapLevel(4);
  }, [currentLocation, locationFocusToken, mapState]);

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-civic-50 shadow-sm">
      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute right-5 top-5 z-30">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white/95 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <button
            type="button"
            onClick={() => handleZoom(mapLevel - 1)}
            className="focus-ring h-11 w-11 text-xl font-black text-civic-700 hover:bg-civic-50 disabled:text-slate-300"
            disabled={mapLevel <= MIN_LEVEL}
            aria-label={t.zoomIn}
          >
            +
          </button>
          <span className="h-px bg-slate-200" />
          <button
            type="button"
            onClick={() => handleZoom(mapLevel + 1)}
            className="focus-ring h-11 w-11 text-xl font-black text-civic-700 hover:bg-civic-50 disabled:text-slate-300"
            disabled={mapLevel >= MAX_LEVEL}
            aria-label={t.zoomOut}
          >
            -
          </button>
        </div>
      </div>

      <div className="absolute right-5 top-1/2 z-30 -translate-y-1/2">
        <button
          type="button"
          onClick={handleLocateClick}
          disabled={locationStatus === "loading"}
          aria-label={t.useLocation}
          title={t.useLocation}
          className={`focus-ring group relative flex h-14 w-14 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 shadow-[0_12px_28px_rgba(15,23,42,0.16)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.2)] ${
            locationStatus === "loading" ? "cursor-wait opacity-70" : ""
          }`}
        >
          <span className="absolute inset-[7px] rounded-full bg-gradient-to-b from-slate-50 to-slate-100" />
          <span className="absolute inset-[13px] rounded-full border border-sky-100 bg-sky-50 shadow-inner" />
          <span className="absolute inset-[18px] rounded-full bg-civic-600/10" />
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full text-civic-700 transition group-hover:text-civic-800">
            <Icon name="target" className="h-5.5 w-5.5 stroke-[2.1]" />
          </span>
        </button>
      </div>

      {mapState !== "ready" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/10 px-6">
          <div className="max-w-md rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-black text-slate-950">
              {mapState === "missing-key" ? t.mapSetup : t.mapError}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {mapState === "missing-key"
                ? "Set VITE_KAKAO_MAP_APP_KEY in your .env file to load the nationwide map."
                : t.mapErrorDetail}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
