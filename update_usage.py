#!/usr/bin/env python3
"""Muse の使用量を取得して usage.json を生成する。
取得・解析に失敗した場合はファイルを更新しない（前回値を保持する）。"""
import json, re, subprocess, sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

OUT = Path(__file__).parent / "usage.json"
JST = timezone(timedelta(hours=9))

def main() -> int:
    r = subprocess.run(["subscription-status", "status"], capture_output=True, text=True, timeout=60)
    text = r.stdout or ""
    m_pct = re.search(r"Usage:\s*(\d+)%\s*of weekly limit", text)
    m_reset = re.search(r"Weekly limit resets\s+(\w+ \d+) at (\d+):(\d+) (AM|PM) JST", text)
    m_plan = re.search(r"on the (\w+) subscription", text)
    if not (m_pct and m_reset):
        print("parse failed:", text[:200], file=sys.stderr)
        return 1
    used = int(m_pct.group(1))
    now = datetime.now(JST)
    mon = datetime.strptime(m_reset.group(1), "%b %d").replace(year=now.year)
    hh = int(m_reset.group(2)) % 12 + (12 if m_reset.group(4) == "PM" else 0)
    reset = mon.replace(hour=hh, minute=int(m_reset.group(3)), tzinfo=JST)
    if reset < now - timedelta(days=1):
        reset = reset.replace(year=now.year + 1)
    data = {
        "plan": m_plan.group(1) if m_plan else "",
        "used_percent": used,
        "remaining_percent": 100 - used,
        "reset_at": reset.isoformat(),
        "reset_display": reset.strftime("%m/%d %H:%M"),
        "updated_at": now.isoformat(),
        "updated_display": now.strftime("%m/%d %H:%M"),
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2))
    print(json.dumps(data, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    sys.exit(main())
