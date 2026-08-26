from pathlib import Path
import json
import re


TRACK_KEYWORDS = {
    'creative': [r'creative', r'brand', r'design', r'stylist', r'editorial', r'collection'],
    'content': [r'video', r'photo', r'production', r'post[- ]production', r'content', r'studio'],
    'talent': [r'talent', r'casting', r'model', r'booker', r'scout', r'agency'],
    'operations': [r'operations', r'sourcing', r'quality', r'logistics', r'supply', r'process'],
    'marketing': [r'marketing', r'pr', r'influencer', r'campaign', r'audience', r'growth'],
    'digital': [r'digital', r'e-commerce', r'ai', r'data', r'asset', r'platform'],
}


def sentence_candidates(text):
    raw_lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    lines = []
    for ln in raw_lines:
        if len(ln) < 55 or len(ln) > 260:
            continue
        if re.match(r'^(SECTION|Document|--- PAGE|===== FILE)', ln, re.I):
            continue
        if re.match(r'^\d+(\.\d+)?$', ln):
            continue
        lines.append(re.sub(r'\s+', ' ', ln))
    return lines


def collect_by_track(lines):
    result = {k: [] for k in TRACK_KEYWORDS}
    seen = {k: set() for k in TRACK_KEYWORDS}

    for line in lines:
        low = line.lower()
        for track, patterns in TRACK_KEYWORDS.items():
            if any(re.search(pat, low) for pat in patterns):
                key = low[:180]
                if key in seen[track]:
                    continue
                seen[track].add(key)
                result[track].append(line)

    return {k: v[:14] for k, v in result.items()}


def main():
    root = Path(__file__).resolve().parents[1]
    corpus_txt = root / 'src' / 'data' / 'eoex_services_corpus.txt'
    landing_txt = root / 'gallery' / 'Landing-Pages' / 'EOEX Landing Pages Code.txt'
    fashiontech_txt = root / 'gallery' / 'Landing-Pages' / 'EOEX FashionTech Research.txt'

    joined = []
    for fp in [corpus_txt, landing_txt, fashiontech_txt]:
        if fp.exists():
            joined.append(fp.read_text(encoding='utf-8', errors='ignore'))

    lines = sentence_candidates('\n'.join(joined))
    grouped = collect_by_track(lines)

    out_js = root / 'src' / 'data' / 'eoexServiceInsights.js'
    out_js.parent.mkdir(parents=True, exist_ok=True)
    out_js.write_text(
        'export const EOEX_SERVICE_INSIGHTS = ' + json.dumps(grouped, ensure_ascii=False, indent=2) + ';\n',
        encoding='utf-8',
    )

    print('output', out_js)
    for key, arr in grouped.items():
        print(key, len(arr))


if __name__ == '__main__':
    main()