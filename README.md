# Seoul Easy Locker

대한민국 서울을 방문한 외국인 관광객, 가족 관광객, 대형 짐 이용자를 위한 다국어 공공 물품보관함 안내 데모 웹사이트입니다.

## Concept

- 핵심 데이터 컨셉: 공영 물품보관함 현황 실시간 정보
- 확장 데이터 컨셉: 전국 초정밀 버스 실시간 위치 정보
- 지원 언어: 한국어, English, 中文, 日本語
- 주요 기능: 검색, 관광지 바로가기, 지도형 탐색, 실시간 상태 배지, 정렬, 대형 짐 필터, 버스 정보형 상세 카드

## Run

```bash
npm install
VITE_KAKAO_MAP_APP_KEY=your_kakao_javascript_key
LOCKER_API_KEY=your_public_data_key npm run dev
```

로컬 데모 주소는 기본적으로 `http://127.0.0.1:4173/` 입니다.
