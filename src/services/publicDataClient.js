import { lockers as mockLockers } from "../data/lockers";

export async function fetchLockerStatus() {
  const response = await fetch("/api/lockers");

  if (!response.ok) {
    throw new Error("Locker public-data API is not available.");
  }

  return response.json();
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
