const origins = {
  gangnam: {
    label: "강남 업무권역",
    lat: 37.4979,
    lon: 127.0276
  },
  gwanghwamun: {
    label: "광화문 업무권역",
    lat: 37.5726,
    lon: 126.9769
  },
  yeouido: {
    label: "여의도 업무권역",
    lat: 37.5251,
    lon: 126.9242
  }
};

const serviceProfiles = {
  resident: {
    label: "주민등록 등·초본",
    processing: 8,
    keywords: ["등본", "초본", "주민등록", "통합증명", "제증명", "민원발급", "증명서", "소량민원", "통합민원"]
  },
  seal: {
    label: "인감 및 제증명",
    processing: 10,
    keywords: ["인감", "제증명", "민원발급", "증명서", "소량민원", "통합민원"]
  },
  business: {
    label: "사업자·인허가",
    processing: 14,
    keywords: ["사업", "통신판매", "건설업", "공장등록", "임대사업", "인허가", "법정민원", "민원접수", "등록면허세"]
  },
  family: {
    label: "가족관계 신고·증명",
    processing: 12,
    keywords: ["가족관계", "출생", "혼인", "이혼", "사망", "개명", "등록신고", "가압관계", "혼인•사망"]
  }
};

const plannerForm = document.querySelector("#planner-form");
const recommendationList = document.querySelector("#recommendation-list");
const summaryText = document.querySelector("#summary-text");
const avgWait = document.querySelector("#avgWait");
const fastestTotal = document.querySelector("#fastestTotal");
const successRate = document.querySelector("#successRate");
const officeCount = document.querySelector("#office-count");
const dataUpdated = document.querySelector("#data-updated");
const headerStatus = document.querySelector("#header-status");
const dataMessage = document.querySelector("#data-message");
const detailTitle = document.querySelector("#detail-title");
const detailDescription = document.querySelector("#detail-description");
const reasonChips = document.querySelector("#reason-chips");
const timeline = document.querySelector("#timeline");

let liveDataset = null;
let latestResults = [];
let selectedId = null;

function toMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTimeString(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = String(Math.floor(normalized / 60)).padStart(2, "0");
  const minutes = String(normalized % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatTimeStamp(timestamp) {
  if (!timestamp || timestamp.length < 12) return "실시간 갱신 시각 미확인";
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hour = timestamp.slice(8, 10);
  const minute = timestamp.slice(10, 12);
  return `${year}.${month}.${day} ${hour}:${minute} 기준`;
}

function formatServerTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "갱신 시각 확인 전";
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")} 수집`;
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

function estimateTravelMinutes(distanceKm) {
  return Math.max(8, Math.min(65, Math.round(9 + distanceKm * 3.8)));
}

function statusClass(minutesLeft) {
  if (minutesLeft >= 10) return "status-good";
  if (minutesLeft >= 0) return "status-warn";
  return "status-risk";
}

function normalizeTaskName(taskName) {
  return (taskName || "").replace(/\s+/g, "").toLowerCase();
}

function getTaskMatchScore(taskName, serviceType) {
  const normalized = normalizeTaskName(taskName);
  if (!normalized) return -1;

  const profile = serviceProfiles[serviceType];
  let bestScore = -1;

  profile.keywords.forEach((keyword, index) => {
    if (normalized.includes(keyword.replace(/\s+/g, "").toLowerCase())) {
      bestScore = Math.max(bestScore, 100 - index);
    }
  });

  return bestScore;
}

function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isOpenDuringWindow(office, departureMinutes, deadlineMinutes) {
  const start = toMinutes(`${office.wkdyOperBgngTm.slice(0, 2)}:${office.wkdyOperBgngTm.slice(2, 4)}`);
  const end = toMinutes(`${office.wkdyOperEndTm.slice(0, 2)}:${office.wkdyOperEndTm.slice(2, 4)}`);
  return departureMinutes >= start && deadlineMinutes <= end + 120;
}

function getPriorityBonus(priority, minutesLeft, waitMinutes) {
  if (priority === "speed") {
    return Math.max(0, 28 - waitMinutes) + Math.max(0, minutesLeft / 2);
  }

  if (priority === "certainty") {
    return Math.max(0, minutesLeft + 20);
  }

  return Math.max(0, 16 + minutesLeft / 2 - waitMinutes / 3);
}

function aggregateDataset(dataset, serviceType) {
  const officeMap = new Map();
  const waitMap = new Map();

  dataset.offices.forEach((office) => {
    officeMap.set(office.csoSn, office);
  });

  dataset.waits.forEach((item) => {
    const current = waitMap.get(item.csoSn) || [];
    current.push(item);
    waitMap.set(item.csoSn, current);
  });

  const offices = [];

  officeMap.forEach((office, officeId) => {
    const waitItems = waitMap.get(officeId) || [];
    const matchedTasks = waitItems
      .map((item) => ({
        ...item,
        matchScore: getTaskMatchScore(item.taskNm, serviceType)
      }))
      .filter((item) => item.matchScore >= 0)
      .sort((left, right) => {
        if (right.matchScore !== left.matchScore) return right.matchScore - left.matchScore;
        return parseNumber(left.wtngCnt) - parseNumber(right.wtngCnt);
      });

    offices.push({
      ...office,
      waitItems,
      matchedTask: matchedTasks[0] || null
    });
  });

  return offices;
}

function buildNarrative(item, formValues) {
  const timeOutcome =
    item.minutesLeft >= 0
      ? `${formValues.returnDeadline} 전 복귀 가능성이 높습니다.`
      : `${formValues.returnDeadline} 전 복귀가 빠듯할 수 있습니다.`;

  return `${item.csoNm}은 현재 ${item.taskLabel} 창구 대기인원이 ${item.waitCount}명으로 낮은 편이며, 이동 예상 ${item.travelMinutes}분을 감안해도 ${timeOutcome}`;
}

function calculateRecommendations(formValues) {
  if (!liveDataset) return [];

  const departureMinutes = toMinutes(formValues.departureTime);
  const deadlineMinutes = toMinutes(formValues.returnDeadline);
  const availableWindow = deadlineMinutes - departureMinutes;
  const origin = origins[formValues.origin];
  const profile = serviceProfiles[formValues.serviceType];

  const candidates = aggregateDataset(liveDataset, formValues.serviceType)
    .map((office) => {
      const lat = parseNumber(office.lat, NaN);
      const lon = parseNumber(office.lot, NaN);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

      const distanceKm = haversineDistanceKm(origin, { lat, lon });
      const travelMinutes = estimateTravelMinutes(distanceKm);
      const matchedTask = office.matchedTask;
      const waitCount = parseNumber(matchedTask?.wtngCnt, matchedTask ? 0 : 3);
      const waitMinutes = Math.max(2, waitCount * 4);
      const serviceScore = matchedTask ? matchedTask.matchScore : -20;
      const totalMinutes = travelMinutes * 2 + waitMinutes + profile.processing;
      const minutesLeft = availableWindow - totalMinutes;
      const openBonus = isOpenDuringWindow(office, departureMinutes, deadlineMinutes) ? 14 : -40;
      const priorityBonus = getPriorityBonus(formValues.priority, minutesLeft, waitMinutes);
      const score =
        140 -
        distanceKm * 2.2 -
        totalMinutes * 1.1 +
        serviceScore +
        openBonus +
        priorityBonus;

      return {
        ...office,
        distanceKm,
        travelMinutes,
        waitCount,
        waitMinutes,
        totalMinutes,
        minutesLeft,
        score: Math.round(score),
        taskLabel: matchedTask?.taskNm || "유사 민원 창구",
        taskUpdatedAt: matchedTask?.totDt || office.totCrtrYmd
      };
    })
    .filter(Boolean)
    .filter((office) => office.distanceKm <= 38)
    .filter((office) => office.score > 20)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((office, index) => ({
      ...office,
      rank: index + 1,
      narrative: buildNarrative(office, formValues)
    }));

  return candidates;
}

function renderSummary(results, formValues) {
  if (!results.length) {
    summaryText.textContent = "현재 조건에서 추천 가능한 민원실을 찾지 못했습니다.";
    avgWait.textContent = "-";
    fastestTotal.textContent = "-";
    successRate.textContent = "0%";
    return;
  }

  const averageWaitMinutes = Math.round(
    results.reduce((sum, item) => sum + item.waitMinutes, 0) / results.length
  );
  const fastest = Math.min(...results.map((item) => item.totalMinutes));
  const feasibleCount = results.filter((item) => item.minutesLeft >= 0).length;
  const percentage = Math.round((feasibleCount / results.length) * 100);

  summaryText.textContent = `${origins[formValues.origin].label}에서 ${
    serviceProfiles[formValues.serviceType].label
  } 기준으로, 실시간 대기현황과 이동 예상시간을 반영한 상위 후보입니다.`;
  avgWait.textContent = `${averageWaitMinutes}분`;
  fastestTotal.textContent = `${fastest}분`;
  successRate.textContent = `${percentage}%`;
}

function renderRecommendations(results) {
  recommendationList.innerHTML = results
    .map(
      (item) => `
        <article class="recommendation-card ${
          item.csoSn === selectedId ? "active" : ""
        }" data-id="${item.csoSn}">
          <div class="card-rank">${item.rank}</div>
          <h3>${item.csoNm}</h3>
          <div class="card-meta">
            <span class="meta-pill">${item.taskLabel}</span>
            <span class="meta-pill">예상 이동 ${item.travelMinutes}분</span>
            <span class="meta-pill">${item.roadNmAddr || item.lotnoAddr}</span>
          </div>
          <p>${item.narrative}</p>
          <div class="score-row">
            <div>
              <span>실시간 대기</span>
              <strong>${item.waitCount}명</strong>
            </div>
            <div>
              <span>예상 총 소요</span>
              <strong>${item.totalMinutes}분</strong>
            </div>
            <div>
              <span>복귀 여유</span>
              <strong class="${statusClass(item.minutesLeft)}">${
                item.minutesLeft >= 0 ? `+${item.minutesLeft}분` : `${item.minutesLeft}분`
              }</strong>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderDetail(item, departureTime) {
  detailTitle.textContent = `${item.csoNm} 상세 분석`;
  detailDescription.textContent = `${item.taskLabel} 기준 실시간 대기인원은 ${item.waitCount}명이며, 최근 수집시각은 ${formatTimeStamp(
    item.taskUpdatedAt
  )}입니다. 예상 이동시간 ${item.travelMinutes}분과 처리시간을 합치면 총 ${item.totalMinutes}분 내 처리가 가능할 것으로 판단했습니다.`;

  const reasons = [
    `${item.taskLabel} 창구 매칭`,
    `실시간 대기 ${item.waitCount}명`,
    `예상 이동 ${item.travelMinutes}분`,
    item.minutesLeft >= 0 ? "점심시간 내 복귀 가능성 높음" : "복귀 마감 시각 재확인 필요"
  ];

  reasonChips.innerHTML = reasons
    .map((text) => `<span class="reason-chip">${text}</span>`)
    .join("");

  const departureMinutes = toMinutes(departureTime);
  const steps = [
    {
      time: departureTime,
      title: "업무지 출발",
      text: `${item.csoNm} 민원실로 이동 시작`
    },
    {
      time: toTimeString(departureMinutes + item.travelMinutes),
      title: "민원실 도착",
      text: `${item.taskLabel} 창구 방문`
    },
    {
      time: toTimeString(departureMinutes + item.travelMinutes + item.waitMinutes),
      title: "대기 완료",
      text: `실시간 대기 기준 약 ${item.waitMinutes}분 후 접수 예상`
    },
    {
      time: toTimeString(
        departureMinutes + item.travelMinutes + item.waitMinutes + serviceProfiles[document.querySelector("#serviceType").value].processing
      ),
      title: "민원 처리 완료",
      text: `${serviceProfiles[document.querySelector("#serviceType").value].label} 처리 완료 예상`
    },
    {
      time: toTimeString(departureMinutes + item.totalMinutes),
      title: "업무지 복귀",
      text:
        item.minutesLeft >= 0
          ? `${item.minutesLeft}분 여유를 두고 복귀 예상`
          : `${Math.abs(item.minutesLeft)}분 초과 가능성`
    }
  ];

  timeline.innerHTML = steps
    .map(
      (step) => `
        <div class="timeline-item">
          <div class="timeline-time">${step.time}</div>
          <div class="timeline-content">
            <div class="timeline-title">${step.title}</div>
            <div class="timeline-text">${step.text}</div>
          </div>
        </div>
      `
    )
    .join("");
}

function updateUI(formValues) {
  latestResults = calculateRecommendations(formValues);
  selectedId = latestResults[0]?.csoSn || null;
  renderSummary(latestResults, formValues);
  renderRecommendations(latestResults);

  if (latestResults[0]) {
    renderDetail(latestResults[0], formValues.departureTime);
  } else {
    detailTitle.textContent = "추천 가능한 민원실이 없습니다.";
    detailDescription.textContent = "출발 권역 또는 민원 종류를 바꾸면 다른 후보를 확인할 수 있습니다.";
    reasonChips.innerHTML = "";
    timeline.innerHTML = "";
  }
}

function currentFormValues() {
  return {
    origin: document.querySelector("#origin").value,
    serviceType: document.querySelector("#serviceType").value,
    departureTime: document.querySelector("#departureTime").value,
    returnDeadline: document.querySelector("#returnDeadline").value,
    priority: document.querySelector("#priority").value
  };
}

async function loadLiveDataset() {
  headerStatus.textContent = "실시간 데이터 조회 중";
  dataMessage.hidden = true;

  try {
    const response = await fetch("/api/minwon-data");
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "실시간 데이터를 불러오지 못했습니다.");
    }

    liveDataset = payload;
    officeCount.textContent = `민원실 ${payload.offices.length}곳 분석`;
    dataUpdated.textContent = formatServerTime(payload.retrievedAt);
    headerStatus.textContent = "실시간 데이터 연결 완료";
    updateUI(currentFormValues());
  } catch (error) {
    headerStatus.textContent = "실시간 데이터 연결 실패";
    dataMessage.hidden = false;
    dataMessage.textContent = `실시간 데이터 연결에 실패했습니다. ${error.message}`;
    summaryText.textContent = "서버 연결 상태를 확인한 뒤 다시 시도해주세요.";
  }
}

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateUI(currentFormValues());
});

recommendationList.addEventListener("click", (event) => {
  const card = event.target.closest(".recommendation-card");
  if (!card) return;

  selectedId = card.dataset.id;
  renderRecommendations(latestResults);

  const selectedItem = latestResults.find((item) => item.csoSn === selectedId);
  if (!selectedItem) return;

  renderDetail(selectedItem, document.querySelector("#departureTime").value);
});

loadLiveDataset();
