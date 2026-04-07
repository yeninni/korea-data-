import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { statusStyles } from "../utils/lockerUtils";

const DEFAULT_CENTER = { lat: 36.35, lng: 127.85 };
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

function createMarkerImage(kakao, status, selected) {
  const color = {
    Available: "#10b981",
    "Almost Full": "#f59e0b",
    Full: "#ef4444"
  }[status];
  const size = selected ? 28 : 22;
  const ringWidth = selected ? 4 : 3;
  const radius = size / 2;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius - ringWidth}" fill="${color}" stroke="#ffffff" stroke-width="${ringWidth}" />
    </svg>
  `;

  return new kakao.maps.MarkerImage(
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    new kakao.maps.Size(size, size),
    { offset: new kakao.maps.Point(radius, radius) }
  );
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

function createOverlayContent(locker, language) {
  const availabilityLabel =
    language === "ko"
      ? "잔여"
      : language === "zh"
        ? "剩余"
        : language === "ja"
          ? "残り"
          : "Available";
  const localizedAvailabilityLabel =
    language === "ko"
      ? "잔여"
      : language === "zh"
        ? "剩余"
        : language === "ja"
          ? "空き"
          : "Available";

  return `
    <div class="kakao-map-overlay">
      <strong>${locker.name}</strong>
      <span>${localizedAvailabilityLabel} ${locker.availableUnits}/${locker.totalUnits}</span>
    </div>
  `;
}

export default function MockMap({
  lockers,
  selectedLocker,
  onSelect,
  t,
  language,
  currentLocation,
  onUseLocation,
  locationStatus,
  locationFocusToken
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const currentMarkerRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayLockerIdRef = useRef(null);
  const [mapState, setMapState] = useState(KAKAO_MAP_APP_KEY ? "loading" : "missing-key");

  const visibleLockers = useMemo(
    () =>
      lockers.filter(
        (locker) => Number.isFinite(locker.latitude) && Number.isFinite(locker.longitude)
      ),
    [lockers]
  );
  const visibleStatusCounts = useMemo(
    () =>
      visibleLockers.reduce(
        (counts, locker) => {
          counts[locker.availabilityStatus] += 1;
          return counts;
        },
        { Available: 0, "Almost Full": 0, Full: 0 }
      ),
    [visibleLockers]
  );

  function closeOverlay() {
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }
    overlayLockerIdRef.current = null;
  }

  function handleLocateClick() {
    if (currentLocation && window.kakao?.maps && mapRef.current) {
      const position = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lon);
      mapRef.current.setLevel(4);
      mapRef.current.panTo(position);
      return;
    }

    onUseLocation();
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
            level: 13
          });

          kakao.maps.event.addListener(mapRef.current, "click", () => {
            closeOverlay();
          });
        }

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

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
      currentMarkerRef.current = null;
    }

    closeOverlay();

    if (visibleLockers.length === 0) {
      map.setCenter(new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng));
      map.setLevel(13);
      return;
    }

    const bounds = new kakao.maps.LatLngBounds();

    visibleLockers.forEach((locker) => {
      const position = new kakao.maps.LatLng(locker.latitude, locker.longitude);
      const selected = selectedLocker?.id === locker.id;
      const marker = new kakao.maps.Marker({
        position,
        title: locker.name,
        image: createMarkerImage(kakao, locker.availabilityStatus, selected),
        zIndex: selected ? 5 : 1
      });

      marker.setMap(map);
      kakao.maps.event.addListener(marker, "click", () => {
        onSelect(locker);

        if (overlayLockerIdRef.current === locker.id) {
          closeOverlay();
          return;
        }

        closeOverlay();
        overlayLockerIdRef.current = locker.id;
        overlayRef.current = new kakao.maps.CustomOverlay({
          position,
          content: createOverlayContent(locker, language),
          yAnchor: 1.8,
          zIndex: 6
        });
        overlayRef.current.setMap(map);
      });
      markersRef.current.push(marker);
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

    if (visibleLockers.length === 1) {
      const centerTarget = currentLocation
        ? new kakao.maps.LatLng(currentLocation.lat, currentLocation.lon)
        : new kakao.maps.LatLng(visibleLockers[0].latitude, visibleLockers[0].longitude);
      map.setCenter(centerTarget);
      map.setLevel(5);
    } else if (!currentLocation) {
      map.setBounds(bounds, 60, 60, 60, 60);
    }
  }, [currentLocation, language, mapState, onSelect, selectedLocker, visibleLockers]);

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
  }, [currentLocation, locationFocusToken, mapState]);

  const statusList = Object.entries(statusStyles);

  return (
    <div className="space-y-5">
      <div className="px-1">
        <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-[1.5rem] border border-slate-200/80 bg-white/88 px-2 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.10)] backdrop-blur-md">
          {statusList.map(([status, style]) => (
            <div
              key={status}
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5"
            >
              <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
                <span className={`absolute h-4 w-4 rounded-full opacity-30 blur-[3px] ${style.marker}`} />
                <span className={`absolute h-2.5 w-2.5 rounded-full ${style.marker}`} />
              </span>
              <span className="text-sm font-semibold text-slate-700">{t[style.labelKey]}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                {visibleStatusCounts[status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-civic-50 shadow-sm">
        <div ref={containerRef} className="absolute inset-0" />

        <div className="absolute right-5 top-1/2 z-10 -translate-y-1/2">
          <button
            type="button"
            onClick={handleLocateClick}
            disabled={locationStatus === "loading"}
            aria-label={t.useLocation}
            title={t.useLocation}
            className={`focus-ring flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-civic-700 shadow-sm backdrop-blur transition hover:bg-white ${
              locationStatus === "loading" ? "cursor-wait opacity-70" : ""
            }`}
          >
            <Icon name="target" className="h-5 w-5" />
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

        <div className="absolute bottom-5 left-5 z-10 rounded-2xl bg-white/95 px-4 py-3 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          {t.mapNotice}
        </div>
      </div>
    </div>
  );
}
