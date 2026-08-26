import React, { useMemo } from 'react';
import { LANDING_DOCUMENTS, LANDING_NAV } from './landing-documents';
import './LandingDocPage.css';

function splitIntoSections(lines) {
  const sections = [];
  let current = { title: 'Document Start', lines: [] };

  lines.forEach((line, index) => {
    const normalized = line.trim();
    const isHeader = /^SECTION\s+\d+/i.test(normalized) || /^Document\s+\d+/i.test(normalized);

    if (isHeader && current.lines.length) {
      sections.push(current);
      current = { title: normalized, lines: [] };
    }

    current.lines.push({ n: index + 1, text: line });
  });

  if (current.lines.length || !sections.length) {
    sections.push(current);
  }

  return sections;
}

export default function LandingDocPage({ docKey }) {
  const doc = LANDING_DOCUMENTS[docKey] || LANDING_DOCUMENTS['careers-1'];
  const lineCount = doc.lines.length;
  const nonEmptyCount = doc.lines.filter((line) => line.trim()).length;

  const sections = useMemo(() => splitIntoSections(doc.lines), [doc.lines]);

  return (
    <div className="doc-page-shell">
      <header className="doc-header">
        <a className="doc-brand" href={doc.homeUrl}>
          <img src="/eoexagency/gallery/logo/2.png" alt="EOEX logo" />
          <div>
            <strong>EOEX</strong>
            <span>The Elegance of Excellence</span>
          </div>
        </a>

        <nav className="doc-nav" aria-label="Landing pages">
          {LANDING_NAV.map((item) => (
            <a key={item.href} href={item.href} className={item.href.endsWith(doc.slug) ? 'active' : ''}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="doc-main">
        <section className="hero-card">
          <p className="kicker">EOEX Career Intelligence</p>
          <h1>{doc.title}</h1>
          <p>{doc.subtitle}</p>
          <div className="meta-row">
            <span>Source: {doc.sourcePath}</span>
            <span>Total lines: {lineCount}</span>
            <span>Non-empty lines: {nonEmptyCount}</span>
          </div>
        </section>

        <section className="content-card">
          {nonEmptyCount === 0 ? (
            <p className="empty-state">This source file contains only whitespace lines. Every line has still been loaded and counted.</p>
          ) : (
            sections.map((section, idx) => (
              <details key={`${section.title}-${idx}`} open={idx === 0} className="doc-section">
                <summary>{section.title} ({section.lines.length} lines)</summary>
                <div className="line-grid">
                  {section.lines.map((line) => (
                    <div key={line.n} className="line-row">
                      <span className="line-no">{line.n}</span>
                      <span className="line-text">{line.text.length ? line.text : ' '}</span>
                    </div>
                  ))}
                </div>
              </details>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
