from __future__ import annotations

import json
import os
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


API_BASE = "https://apis.data.go.kr/B551982/cso_v2"
PORT = 4173
CACHE_TTL_SECONDS = 60
PROJECT_ROOT = Path(__file__).resolve().parent
CACHE: dict[str, object] = {"expires_at": 0, "payload": None}


def build_api_url(path: str, service_key: str, extra_params: dict[str, object]) -> str:
    params = {
        "serviceKey": service_key,
        "pageNo": 1,
        "type": "json",
        **extra_params,
    }
    return f"{API_BASE}/{path}?{urllib.parse.urlencode(params)}"


def fetch_json(url: str) -> dict[str, object]:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def get_live_payload() -> dict[str, object]:
    service_key = os.environ.get("MINWON_API_KEY", "").strip()
    if not service_key:
        raise RuntimeError("환경변수 MINWON_API_KEY 가 설정되지 않았습니다.")

    now = time.time()
    if CACHE["payload"] and now < CACHE["expires_at"]:
        return CACHE["payload"]  # type: ignore[return-value]

    offices = fetch_json(
        build_api_url("cso_info_v2", service_key, {"numOfRows": 200})
    )
    waits = fetch_json(
        build_api_url("cso_realtime_v2", service_key, {"numOfRows": 500})
    )

    payload = {
        "retrievedAt": datetime.now(timezone.utc).isoformat(),
        "offices": offices.get("body", {}).get("items", {}).get("item", []),
        "waits": waits.get("body", {}).get("items", {}).get("item", []),
    }

    CACHE["payload"] = payload
    CACHE["expires_at"] = now + CACHE_TTL_SECONDS
    return payload


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_ROOT), **kwargs)

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/minwon-data":
            self.handle_live_data()
            return

        if parsed.path == "/health":
            self.send_json({"ok": True})
            return

        super().do_GET()

    def handle_live_data(self) -> None:
        try:
            payload = get_live_payload()
        except Exception as error:  # noqa: BLE001
            self.send_json(
                {"error": str(error)},
                status=HTTPStatus.INTERNAL_SERVER_ERROR,
            )
            return

        self.send_json(payload)

    def send_json(self, payload: dict[str, object], status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", PORT), AppHandler)
    print(f"Serving on http://127.0.0.1:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
