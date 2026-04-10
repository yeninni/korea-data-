import { lockers as mockLockers } from "../data/lockers";

const liveLockerEndpoint = `${import.meta.env.BASE_URL}api/lockers`;
const snapshotLockerEndpoint = `${import.meta.env.BASE_URL}lockers.json`;

function withMockSizeAvailability(locker) {
  if (locker.sizeAvailability) {
    return locker;
  }

  const baseTotal = Math.max(locker.availableUnits, 3);
  const small = Math.max(1, Math.round(baseTotal * 0.4));
  const medium = Math.max(0, Math.round(baseTotal * 0.35));
  const remaining = Math.max(0, locker.availableUnits - small - medium);
  const large = locker.largeLuggage ? Math.max(1, remaining) : 0;

  const adjustedSmall = Math.min(small, locker.availableUnits);
  const adjustedMedium = Math.min(medium, Math.max(0, locker.availableUnits - adjustedSmall));
  const adjustedLarge = Math.max(0, locker.availableUnits - adjustedSmall - adjustedMedium);

  return {
    ...locker,
    sizeAvailability: {
      small: adjustedSmall,
      medium: adjustedMedium,
      large: locker.largeLuggage ? adjustedLarge : 0
    }
  };
}

function mergeDemoCoverage(liveLockers) {
  const existingLandmarks = new Set(liveLockers.map((locker) => locker.nearbyLandmark));
  const hasLiveGyeonggi = liveLockers.some((locker) => locker.region === "Gyeonggi");
  const supplementalLockers = mockLockers
    .filter((locker) => {
      if (locker.region === "Gyeonggi") {
        return !hasLiveGyeonggi;
      }

      return true;
    })
    .filter((locker) => !existingLandmarks.has(locker.nearbyLandmark))
    .map((locker) => ({
      ...withMockSizeAvailability(locker),
      id: `demo-${locker.id}`,
      mode: "demo"
    }));

  return [...liveLockers.map(withMockSizeAvailability), ...supplementalLockers];
}

export async function fetchLockerStatus() {
  const endpointCandidates = import.meta.env.PROD
    ? [snapshotLockerEndpoint, liveLockerEndpoint]
    : [liveLockerEndpoint, snapshotLockerEndpoint];
  let payload = null;

  for (const endpoint of endpointCandidates) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) continue;
      payload = await response.json();
      break;
    } catch {
      // Try the next available endpoint.
    }
  }

  if (!payload) {
    throw new Error("Locker public-data API is not available.");
  }

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
    lockers: mockLockers.map(withMockSizeAvailability),
    retrievedAt: new Date().toISOString()
  };
}
