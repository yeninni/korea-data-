import { useEffect, useMemo, useRef, useState } from "react";
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

function createOverlayContent(locker) {
  return `
    <div class="kakao-map-overlay">
      <strong>${locker.name}</strong>
      <span>${locker.availableUnits}/${locker.totalUnits}</span>
    </div>
  `;
}

export default function MockMap({ lockers, selectedLocker, onSelect, t }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const overlayRef = useRef(null);
  const [mapState, setMapState] = useState(KAKAO_MAP_APP_KEY ? "loading" : "missing-key");

  const visibleLockers = useMemo(
    () =>
      lockers.filter(
        (locker) => Number.isFinite(locker.latitude) && Number.isFinite(locker.longitude)
      ),
    [lockers]
  );

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

    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }

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
      kakao.maps.event.addListener(marker, "click", () => onSelect(locker));
      markersRef.current.push(marker);
      bounds.extend(position);

      if (selected) {
        overlayRef.current = new kakao.maps.CustomOverlay({
          position,
          content: createOverlayContent(locker),
          yAnchor: 1.8,
          zIndex: 6
        });
        overlayRef.current.setMap(map);
      }
    });

    if (visibleLockers.length === 1) {
      map.setCenter(new kakao.maps.LatLng(visibleLockers[0].latitude, visibleLockers[0].longitude));
      map.setLevel(5);
    } else {
      map.setBounds(bounds, 60, 60, 60, 60);
    }
  }, [mapState, onSelect, selectedLocker, visibleLockers]);

  const statusList = Object.entries(statusStyles);

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-civic-50 shadow-sm">
      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute left-6 top-6 z-10 max-w-sm rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
        <h3 className="font-black text-slate-950">{t.mapTitle}</h3>
        <p className="mt-1 text-sm text-slate-500">{t.mapHint}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {statusList.map(([status, style]) => (
            <span
              key={status}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${style.badge}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${style.marker}`} />
              {t[style.labelKey]}
            </span>
          ))}
        </div>
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
  );
}
