from pathlib import Path
import subprocess
import sys


def ensure_pypdf():
    try:
        from pypdf import PdfReader  # noqa: F401
        return
    except Exception:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '--quiet', 'pypdf'])


def main():
    ensure_pypdf()
    from pypdf import PdfReader

    root = Path(__file__).resolve().parents[1]
    pdf_dir = root / 'gallery' / 'Landing-Pages'
    output = root / 'src' / 'data' / 'eoex_services_corpus.txt'
    output.parent.mkdir(parents=True, exist_ok=True)

    blocks = []
    for pdf_path in sorted(pdf_dir.glob('*.pdf')):
        blocks.append(f'===== FILE: {pdf_path.name} =====')
        try:
            reader = PdfReader(str(pdf_path))
            for page_index, page in enumerate(reader.pages, start=1):
                blocks.append(f'--- PAGE {page_index} ---')
                blocks.append(page.extract_text() or '')
        except Exception as err:  # pragma: no cover
            blocks.append(f'[ERROR READING {pdf_path.name}: {err}]')
        blocks.append('')

    output.write_text('\n'.join(blocks), encoding='utf-8')

    lines = output.read_text(encoding='utf-8', errors='ignore').splitlines()
    non_empty = [line for line in lines if line.strip()]
    print(f'corpus_file {output}')
    print(f'total_lines {len(lines)}')
    print(f'nonempty_lines {len(non_empty)}')
    print('sample_first_40_nonempty:')
    for line in non_empty[:40]:
        print(line[:240])


if __name__ == '__main__':
    main()