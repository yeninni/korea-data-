import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const API_BASE = "https://apis.data.go.kr/B551982/psl_v2";

const landmarkCoordinates = [
  { name: "Gwanghwamun", lat: 37.5716, lon: 126.9768 },
  { name: "Myeongdong", lat: 37.5609, lon: 126.9855 },
  { name: "Seoul Station", lat: 37.5547, lon: 126.9706 },
  { name: "Hongdae", lat: 37.5572, lon: 126.9245 },
  { name: "Dongdaemun", lat: 37.5665, lon: 127.0092 },
  { name: "Incheon Airport", lat: 37.4602, lon: 126.4407 }
];

function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function haversineDistanceKm(from, to) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestLandmark(lat, lon) {
  return landmarkCoordinates
    .map((landmark) => ({
      ...landmark,
      distance: haversineDistanceKm({ lat, lon }, landmark)
    }))
    .sort((a, b) => a.distance - b.distance)[0];
}

function formatTime(value) {
  if (!value || value.length < 4) return "Open hours not provided";
  return `${value.slice(0, 2)}:${value.slice(2, 4)}`;
}

function classifyAvailability(availableUnits, totalUnits) {
  if (availableUnits <= 0) return "Full";
  if (totalUnits > 0 && availableUnits / totalUnits <= 0.2) return "Almost Full";
  return "Available";
}

function mapCoordinates(lat, lon) {
  const x = Math.min(88, Math.max(10, 12 + ((lon - 126.75) / 0.32) * 76));
  const y = Math.min(84, Math.max(16, 84 - ((lat - 37.45) / 0.2) * 68));
  return { x, y };
}

function supportedLanguagesFromDetail(detail) {
  const payment = detail?.stlmMnsNm ?? "";
  return [
    "ko",
    "en",
    payment.includes("WeCHat") || payment.includes("UnionPay") ? "zh" : null,
    payment.includes("JCB") ? "ja" : null
  ].filter(Boolean);
}

function normalizeLocker(info, realtime, detail, index) {
  const lat = parseNumber(info.lat);
  const lon = parseNumber(info.lot);
  const availableLarge = parseNumber(realtime?.usePsbltyLrgszStlckCnt);
  const availableMedium = parseNumber(realtime?.usePsbltyMdmszStlckCnt);
  const availableSmall = parseNumber(realtime?.usePsbltySmlszStlckCnt);
  const availableUnits = availableLarge + availableMedium + availableSmall;
  const totalUnits = parseNumber(info.stlckCnt, availableUnits);
  const landmark = nearestLandmark(lat, lon);
  const walkMinutes = Math.max(2, Math.round(landmark.distance * 12));

  return {
    id: info.stlckId,
    name: info.stlckRprsPstnNm,
    district: info.sggNm || info.lclgvNm,
    address: info.fcltRoadNmAddr || info.fcltLotnoAddr,
    latitude: lat,
    longitude: lon,
    availabilityStatus: classifyAvailability(availableUnits, totalUnits),
    availableUnits,
    totalUnits,
    largeLuggage: availableLarge > 0 || detail?.stlckHgtExpln?.includes("대형"),
    price: detail?.utztnCrgExpln?.split("\n").find((line) => line.includes("소형")) || "Price details in public-data detail API",
    openHours: `${formatTime(info.wkdyOperBgngTm)}-${formatTime(info.wkdyOperEndTm)}`,
    nearbyLandmark: landmark.name,
    nearestBusStop: `${landmark.name} area stop`,
    estimatedWalkMinutes: walkMinutes,
    estimatedBusMinutes: Math.max(4, Math.round(walkMinutes * 0.65)),
    supportedLanguages: supportedLanguagesFromDetail(detail),
    busRoutes: ["Public bus"],
    nextBuses: [
      { route: "Public bus", minutes: 4 + (index % 5) },
      { route: "Transfer", minutes: 9 + (index % 7) }
    ],
    coordinatesOnMap: mapCoordinates(lat, lon),
    raw: {
      info,
      realtime,
      detail
    }
  };
}

async function requestPublicData(path, serviceKey, params = {}) {
  const url = new URL(`${API_BASE}/${path}`);
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("pageNo", params.pageNo ?? "1");
  url.searchParams.set("numOfRows", params.numOfRows ?? "500");
  url.searchParams.set("type", "json");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Public-data request failed: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.header?.resultCode !== "K0") {
    throw new Error(payload.header?.resultMsg ?? "Public-data API error");
  }

  const item = payload.body?.item ?? [];
  return Array.isArray(item) ? item : [item];
}

function publicLockerPlugin(env) {
  const serviceKey = env.LOCKER_API_KEY || env.MINWON_API_KEY;

  return {
    name: "public-locker-api",
    configureServer(server) {
      server.middlewares.use("/api/lockers", async (_request, response) => {
        if (!serviceKey) {
          response.statusCode = 500;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({ error: "LOCKER_API_KEY or MINWON_API_KEY is required." }));
          return;
        }

        try {
          const [infoItems, realtimeItems, detailItems] = await Promise.all([
            requestPublicData("locker_info_v2", serviceKey, { numOfRows: "500" }),
            requestPublicData("locker_realtime_use_v2", serviceKey, { numOfRows: "500" }),
            requestPublicData("locker_detail_info_v2", serviceKey, { numOfRows: "800" })
          ]);

          const realtimeById = new Map(realtimeItems.map((item) => [item.stlckId, item]));
          const detailById = new Map(detailItems.map((item) => [item.stlckId, item]));
          const lockers = infoItems
            .filter((item) => item.ctpvNm === "서울특별시")
            .map((item, index) =>
              normalizeLocker(item, realtimeById.get(item.stlckId), detailById.get(item.stlckId), index)
            )
            .filter((locker) => locker.totalUnits > 0)
            .slice(0, 80);

          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(
            JSON.stringify({
              mode: "live",
              source: "공영 물품보관함 현황 실시간 정보",
              retrievedAt: new Date().toISOString(),
              lockers
            })
          );
        } catch (error) {
          response.statusCode = 502;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), publicLockerPlugin(env)],
    server: {
      host: "127.0.0.1",
      port: 4173
    }
  };
});
