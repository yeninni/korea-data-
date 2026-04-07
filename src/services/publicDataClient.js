import { lockers as mockLockers } from "../data/lockers";

function mergeDemoCoverage(liveLockers) {
  const existingLandmarks = new Set(liveLockers.map((locker) => locker.nearbyLandmark));
  const supplementalLockers = mockLockers
    .filter((locker) => !existingLandmarks.has(locker.nearbyLandmark))
    .map((locker) => ({
      ...locker,
      id: `demo-${locker.id}`,
      mode: "demo"
    }));

  return [...liveLockers, ...supplementalLockers];
}

export async function fetchLockerStatus() {
  const response = await fetch("/api/lockers");

  if (!response.ok) {
    throw new Error("Locker public-data API is not available.");
  }

  const payload = await response.json();

  return {
    ...payload,
    lockers: mergeDemoCoverage(payload.lockers)
  };
}

export async function fetchBusRealtimeLocation() {
  return {
    source: "전국 초정밀 버스 실시간 위치 정보",
    mode: "mock",
    message: "Connect nearby stop, next bus, and estimated travel time data here."
  };
}

export function getMockLockerPayload() {
  return {
    mode: "mock",
    source: "demo fallback",
    lockers: mockLockers,
    retrievedAt: new Date().toISOString()
  };
}
