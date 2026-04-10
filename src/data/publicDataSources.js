export const publicDataSources = [
  {
    name: "Public Locker Real-time Status Information",
    provider: "Korea Local Information Research & Development Institute",
    role: "Core concept data source for locker location, size, and real-time availability.",
    localized: {
      ko: {
        name: "공영 물품보관함 실시간 현황 정보",
        provider: "한국지역정보개발원",
        role: "보관함 위치, 규모, 실시간 이용 가능 수량을 구성하는 핵심 개념 데이터입니다."
      },
      zh: {
        name: "公共储物柜实时状态信息",
        provider: "韩国地方信息开发院",
        role: "用于提供储物柜位置、规模和实时可用数量等核心信息。"
      },
      ja: {
        name: "公共ロッカー リアルタイム状況情報",
        provider: "韓国地域情報開発院",
        role: "ロッカーの位置、規模、リアルタイム空き数を構成する中核データです。"
      }
    }
  },
  {
    name: "Nationwide Ultra-precision Bus Real-time Location Information",
    provider: "Public data platform dataset",
    role: "Planned integration for nearby stop, bus arrival, and estimated travel time.",
    localized: {
      ko: {
        name: "전국 초정밀 버스 실시간 위치 정보",
        provider: "공공데이터포털 데이터셋",
        role: "향후 주변 정류장, 버스 도착 정보, 예상 이동 시간을 함께 제공하기 위해 연계할 예정인 데이터입니다."
      },
      zh: {
        name: "全国高精度公共交通实时位置信息",
        provider: "公共数据门户数据集",
        role: "计划接入附近站点、到站信息和预计移动时间等公共交通数据。"
      },
      ja: {
        name: "全国超精密バス リアルタイム位置情報",
        provider: "公共データポータル データセット",
        role: "周辺停留所、バス到着情報、予想到着時間を連携する予定のデータです。"
      }
    }
  }
];
