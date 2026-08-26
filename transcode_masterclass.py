#!/usr/bin/env python3
"""Mobile-first optimizer for gallery/masterclass videos.

- Keeps a per-file backup as *.original.mp4.
- Rebuilds the active *.mp4 from the backup each run (avoids cumulative loss).
- Uses H.264 main profile, lower bitrate, 24 fps, short GOP, faststart, no audio.
"""

import glob
import os
import subprocess
from pathlib import Path


def bytes_to_human(value: int) -> str:
    if value >= 1024 * 1024:
        return f"{value / (1024 * 1024):.2f} MB"
    if value >= 1024:
        return f"{value / 1024:.2f} KB"
    return f"{value} B"


def main() -> int:
    root = Path("gallery/masterclass")
    candidates = sorted(
        Path(p)
        for p in glob.glob(str(root / "*.mp4"))
        if not p.endswith(".original.mp4") and not p.endswith(".tmp.mp4") and not p.endswith(".optimized.tmp.mp4")
    )

    if not candidates:
        print("No target videos found in gallery/masterclass.")
        return 0

    summary = []

    for target in candidates:
        backup = target.with_name(f"{target.stem}.original.mp4")
        temp = target.with_name(f"{target.stem}.optimized.tmp.mp4")

        if not backup.exists():
            backup.write_bytes(target.read_bytes())

        old_size = backup.stat().st_size

        cmd = [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(backup),
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "28",
            "-maxrate",
            "1000k",
            "-bufsize",
            "2000k",
            "-r",
            "24",
            "-g",
            "24",
            "-keyint_min",
            "24",
            "-sc_threshold",
            "0",
            "-tune",
            "fastdecode",
            "-profile:v",
            "main",
            "-level",
            "3.1",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-an",
            str(temp),
        ]

        subprocess.run(cmd, check=True)
        new_size = temp.stat().st_size
        os.replace(temp, target)

        reduction = ((old_size - new_size) / old_size * 100.0) if old_size else 0.0
        summary.append((target.name, old_size, new_size, reduction))

    print("file,old_size,new_size,reduction_pct")
    for file_name, old_size, new_size, reduction in summary:
        print(
            f"{file_name},{bytes_to_human(old_size)},{bytes_to_human(new_size)},{reduction:.2f}%"
        )

    sample = root / "EOEX-masterclass-Lyon2026-1.mp4"
    if sample.exists():
        probe_cmd = [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=codec_name,avg_frame_rate,bit_rate",
            "-of",
            "default=noprint_wrappers=1",
            str(sample),
        ]
        print("\nSample ffprobe (EOEX-masterclass-Lyon2026-1.mp4):")
        subprocess.run(probe_cmd, check=True)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
