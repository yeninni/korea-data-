import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { formatLandmark, formatLockerName, statusStyles } from "../utils/lockerUtils";

const DEFAULT_CENTER = { lat: 36.35, lng: 127.85 };
const TILE_SIZE = 256;
const DEFAULT_MAP_SIZE = { width: 1024, height: 520 };
const MIN_ZOOM = 5;
const MAX_ZOOM = 15;

function isValidCoordinate(locker) {
  return Number.isFinite(locker.latitude) && Number.isFinite(locker.longitude);
}

function getZoomLevel(lockers) {
  if (lockers.length <= 1) return 12;
  if (lockers.length <= 4) return 11;
  if (lockers.length <= 12) return 9;
  return 7;
}

function clampZoom(zoom) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

function getMapCenter(lockers, selectedLocker) {
  if (selectedLocker && isValidCoordinate(selectedLocker)) {
    return { lat: selectedLocker.latitude, lng: selectedLocker.longitude };
  }

  if (lockers.length === 0) return DEFAULT_CENTER;

  const total = lockers.reduce(
    (sum, locker) => ({
      lat: sum.lat + locker.latitude,
      lng: sum.lng + locker.longitude
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: total.lat / lockers.length,
    lng: total.lng / lockers.length
  };
}

function projectCoordinate({ lat, lng }, zoom) {
  const safeLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const latRadians = (safeLat * Math.PI) / 180;
  const scale = 2 ** zoom;

  return {
    x: ((lng + 180) / 360) * scale * TILE_SIZE,
    y:
      ((1 - Math.log(Math.tan(latRadians) + 1 / Math.cos(latRadians)) / Math.PI) / 2) *
      scale *
      TILE_SIZE
  };
}

function unprojectCoordinate({ x, y }, zoom) {
  const scale = 2 ** zoom;
  const lng = (x / (scale * TILE_SIZE)) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / (scale * TILE_SIZE);

  return {
    lat: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
    lng
  };
}

function getVisibleTiles(centerPoint, zoom, mapSize) {
  const startX = Math.floor((centerPoint.x - mapSize.width / 2) / TILE_SIZE) - 1;
  const endX = Math.floor((centerPoint.x + mapSize.width / 2) / TILE_SIZE) + 1;
  const startY = Math.floor((centerPoint.y - mapSize.height / 2) / TILE_SIZE) - 1;
  const endY = Math.floor((centerPoint.y + mapSize.height / 2) / TILE_SIZE) + 1;
  const tileCount = 2 ** zoom;
  const tiles = [];

  for (let x = startX; x <= endX; x += 1) {
    for (let y = startY; y <= endY; y += 1) {
      if (y < 0 || y >= tileCount) continue;
      const wrappedX = ((x % tileCount) + tileCount) % tileCount;

      tiles.push({
        key: `${zoom}-${wrappedX}-${y}`,
        src: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
        left: x * TILE_SIZE - centerPoint.x + mapSize.width / 2,
        top: y * TILE_SIZE - centerPoint.y + mapSize.height / 2
      });
    }
  }

  return tiles;
}

function getMarkerPosition(locker, centerPoint, zoom, mapSize) {
  const point = projectCoordinate({ lat: locker.latitude, lng: locker.longitude }, zoom);

  return {
    left: point.x - centerPoint.x + mapSize.width / 2,
    top: point.y - centerPoint.y + mapSize.height / 2
  };
}

function getPointPosition(point, centerPoint, zoom, mapSize) {
  const projected = projectCoordinate(point, zoom);

  return {
    left: projected.x - centerPoint.x + mapSize.width / 2,
    top: projected.y - centerPoint.y + mapSize.height / 2
  };
}

function isMarkerVisible(position, mapSize) {
  return !(
    position.left < -40 ||
    position.left > mapSize.width + 40 ||
    position.top < -40 ||
    position.top > mapSize.height + 40
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
  const mapRef = useRef(null);
  const dragStateRef = useRef(null);
  const [mapSize, setMapSize] = useState(DEFAULT_MAP_SIZE);
  const [manualCenter, setManualCenter] = useState(null);
  const [manualZoom, setManualZoom] = useState(null);
  const visibleLockers = useMemo(() => lockers.filter(isValidCoordinate), [lockers]);
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
  const selectedVisibleLocker =
    selectedLocker &&
    visibleLockers.some((locker) => locker.id === selectedLocker.id) &&
    isValidCoordinate(selectedLocker)
      ? selectedLocker
      : null;

  useEffect(() => {
    if (!mapRef.current) return undefined;

    const updateMapSize = () => {
      const { width, height } = mapRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setMapSize({ width, height });
      }
    };

    updateMapSize();

    const observer = new ResizeObserver(updateMapSize);
    observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, []);

  const shouldFocusSelectedLocker =
    selectedVisibleLocker &&
    !selectedVisibleLocker.isRegionMarker &&
    focusedLockerId === selectedVisibleLocker.id;
  const defaultZoom = shouldFocusSelectedLocker
    ? Math.max(getZoomLevel(visibleLockers), 12)
    : getZoomLevel(visibleLockers);
  const zoom = clampZoom(manualZoom ?? defaultZoom);
  const computedCenter = getMapCenter(visibleLockers, selectedVisibleLocker);
  const center = manualCenter ?? computedCenter;
  const centerPoint = projectCoordinate(center, zoom);
  const tiles = getVisibleTiles(centerPoint, zoom, mapSize);
  const currentLocationPosition = currentLocation
    ? getPointPosition({ lat: currentLocation.lat, lng: currentLocation.lon }, centerPoint, zoom, mapSize)
    : null;
  const statusList = Object.entries(statusStyles);

  useEffect(() => {
    setManualCenter(null);
    setManualZoom(null);
  }, [selectedVisibleLocker?.id, defaultZoom]);

  useEffect(() => {
    if (!currentLocation || !locationFocusToken) return;

    setManualCenter({ lat: currentLocation.lat, lng: currentLocation.lon });
    setManualZoom((activeZoom) => clampZoom(Math.max(activeZoom ?? defaultZoom, 12)));
  }, [currentLocation, defaultZoom, locationFocusToken]);

  function updateZoom(nextZoom, anchorPoint = null) {
    const clampedZoom = clampZoom(nextZoom);
    if (clampedZoom === zoom) return;

    if (anchorPoint) {
      const anchorGeoBefore = unprojectCoordinate(
        {
          x: centerPoint.x + anchorPoint.x - mapSize.width / 2,
          y: centerPoint.y + anchorPoint.y - mapSize.height / 2
        },
        zoom
      );
      const anchorPointAfter = projectCoordinate(anchorGeoBefore, clampedZoom);
      const nextCenterPoint = {
        x: anchorPointAfter.x - anchorPoint.x + mapSize.width / 2,
        y: anchorPointAfter.y - anchorPoint.y + mapSize.height / 2
      };

      setManualCenter(unprojectCoordinate(nextCenterPoint, clampedZoom));
    } else {
      setManualCenter(center);
    }

    setManualZoom(clampedZoom);
  }

  function handleWheel(event) {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const anchorPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    const direction = event.deltaY > 0 ? -1 : 1;

    updateZoom(zoom + direction, anchorPoint);
  }

  function handlePointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("button")) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      centerPoint
    };
  }

  function handlePointerMove(event) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const nextPoint = {
      x: dragState.centerPoint.x - (event.clientX - dragState.startX),
      y: dragState.centerPoint.y - (event.clientY - dragState.startY)
    };

    setManualCenter(unprojectCoordinate(nextPoint, zoom));
  }

  function handlePointerUp(event) {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleLocateClick() {
    if (currentLocation) {
      setManualCenter({ lat: currentLocation.lat, lng: currentLocation.lon });
      setManualZoom((activeZoom) => clampZoom(Math.max(activeZoom ?? defaultZoom, 12)));
      return;
    }

    onUseLocation?.();
  }

  return (
    <div
      ref={mapRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      className="relative min-h-[420px] cursor-grab touch-none overflow-hidden rounded-[2rem] border border-slate-200 bg-civic-50 shadow-sm active:cursor-grabbing"
    >
      <div className="absolute inset-0">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            className="absolute h-64 w-64 select-none"
            draggable="false"
            style={{ left: tile.left, top: tile.top }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/25" />
      </div>

      <div className="absolute left-5 top-5 z-30 max-w-full rounded-[1.5rem] border border-slate-200/80 bg-white/88 px-3 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.10)] backdrop-blur-md">
        <div className="flex max-w-full flex-wrap items-center gap-2">
          {statusList.map(([status, style]) => (
            <div key={status} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5">
              <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
                <span className={`absolute h-4 w-4 rounded-full opacity-30 blur-[3px] ${style.marker}`} />
                <span className={`absolute h-2.5 w-2.5 rounded-full ${style.marker}`} />
              </span>
              <span className="font-display text-xs font-semibold text-slate-700">{t[style.labelKey]}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-display text-[0.65rem] font-bold text-slate-600">
                {visibleStatusCounts[status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-5 top-5 z-30 flex flex-col gap-3">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white/95 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <button
            type="button"
            onClick={() => updateZoom(zoom + 1)}
            className="focus-ring h-11 w-11 text-xl font-black text-civic-700 hover:bg-civic-50 disabled:text-slate-300"
            disabled={zoom >= MAX_ZOOM}
            aria-label={t.zoomIn}
          >
            +
          </button>
          <span className="h-px bg-slate-200" />
          <button
            type="button"
            onClick={() => updateZoom(zoom - 1)}
            className="focus-ring h-11 w-11 text-xl font-black text-civic-700 hover:bg-civic-50 disabled:text-slate-300"
            disabled={zoom <= MIN_ZOOM}
            aria-label={t.zoomOut}
          >
            -
          </button>
        </div>

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

      {visibleLockers.map((locker) => {
        const isSelected = selectedVisibleLocker?.id === locker.id;
        const position = getMarkerPosition(locker, centerPoint, zoom, mapSize);
        const markerLabel = locker.isRegionMarker ? locker.name : formatLockerName(locker, t);

        if (!isMarkerVisible(position, mapSize)) {
          return null;
        }

        return (
          <button
            key={locker.id}
            type="button"
            onClick={() => {
              if (locker.isRegionMarker) {
                onRegionSelect?.(locker.region);
                return;
              }

              onSelect(locker);
            }}
            className={`focus-ring absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-2 shadow-lg ring-1 ring-slate-200 transition hover:scale-105 ${
              isSelected ? "scale-110 ring-4 ring-civic-500/25" : ""
            }`}
            style={{
              left: position.left,
              top: position.top
            }}
            aria-label={locker.isRegionMarker ? locker.name : formatLockerName(locker, t)}
          >
            <span className="flex items-center gap-2">
              <span
                className={`block h-4 w-4 rounded-full ring-4 ring-white ${
                  statusStyles[locker.availabilityStatus].marker
                }`}
              />
              <span className="max-w-[150px] truncate font-display text-xs font-semibold text-slate-700">
                {markerLabel}
              </span>
              {locker.isRegionMarker && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-display text-[0.65rem] font-semibold text-slate-500">
                  {locker.lockerCount}
                </span>
              )}
            </span>
          </button>
        );
      })}

      {currentLocationPosition && isMarkerVisible(currentLocationPosition, mapSize) && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: currentLocationPosition.left,
            top: currentLocationPosition.top
          }}
          aria-hidden="true"
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span className="absolute h-5 w-5 rounded-full bg-rose-500/25" />
            <span className="h-3.5 w-3.5 rounded-full border-2 border-white bg-rose-500 shadow-sm" />
          </span>
        </div>
      )}

      {selectedVisibleLocker && !selectedVisibleLocker.isRegionMarker && (
        <div className="absolute bottom-5 right-5 z-10 max-w-xs rounded-2xl bg-white/95 p-4 text-sm shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <p className="font-display font-semibold text-slate-950">{formatLockerName(selectedVisibleLocker, t)}</p>
          <p className="mt-1 font-soft text-slate-500">
            {selectedVisibleLocker.availableUnits} / {selectedVisibleLocker.totalUnits} ·{" "}
            {formatLandmark(selectedVisibleLocker.nearbyLandmark, t)}
          </p>
        </div>
      )}

      {visibleLockers.some((locker) => locker.isRegionMarker) && (
        <div className="absolute bottom-5 right-5 z-10 max-w-xs rounded-2xl bg-white/95 p-4 font-soft text-sm text-slate-600 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          {t.regionMarkerHint}
        </div>
      )}
    </div>
  );
}
