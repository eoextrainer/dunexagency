import React, { useMemo } from 'react';
import { ALL_PROFILES } from './profile-data';
import './App.css';
import './ReviewHub.css';

export default function ReviewHub() {
  const currentLocation = typeof window !== 'undefined' ? window.location : null;
  const homePageUrl = currentLocation ? `${currentLocation.origin}${import.meta.env.BASE_URL}` : import.meta.env.BASE_URL;
  const homeLogo = new URL('../gallery/logo/2.png', import.meta.url).href;

  const links = useMemo(() => {
    const baseLinks = [
      { label: 'EOEX Home', href: homePageUrl, detail: 'Main website root' },
      { label: 'Primary Landing', href: `${homePageUrl}landing`, detail: '/eoexagency/landing' },
      { label: 'Profiles Directory', href: `${homePageUrl}profiles`, detail: '/eoexagency/profiles' },
    ];

    const profileLinks = ALL_PROFILES.map((profile) => ({
      label: profile.roleLabel,
      href: `${homePageUrl}profiles/${profile.slug}`,
      detail: profile.summary,
    }));

    return [...baseLinks, ...profileLinks];
  }, [homePageUrl]);

  return (
    <div className="dunex-site review-hub-page">
      <header className="site-header">
        <nav className="top-nav solid review-top-nav">
          <a href={homePageUrl} className="brand brand-with-logo">
            <img className="brand-logo" src={homeLogo} alt="EOEX logo" />
            <span className="brand-tagline">The Elegance of Excellence</span>
          </a>
          <a href={`${homePageUrl}review`} className="review-badge" aria-current="page">Review Hub</a>
        </nav>
      </header>

      <main className="review-main section">
        <div className="section-heading reveal is-visible">
          <p className="eyebrow">Landing QA Console</p>
          <h2>All Landing Page Routes In One Place</h2>
        </div>

        <div className="review-grid">
          {links.map((item) => (
            <article key={item.href} className="review-card">
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
              <a href={item.href} target="_blank" rel="noreferrer">Open Route</a>
            </article>
          ))}
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand-block">
            <a href={homePageUrl} className="brand brand-with-logo" onClick={(event) => {
              event.preventDefault();
              window.location.assign(homePageUrl);
            }}>
              <img className="brand-logo" src={homeLogo} alt="EOEX logo" />
              <span className="brand-tagline">The Elegance of Excellence</span>
            </a>
          </div>

          <ul className="footer-nav-list">
            <li>
              <a href={`${homePageUrl}#about`} onClick={(event) => {
                event.preventDefault();
                window.location.assign(`${homePageUrl}#about`);
              }}>
                About
              </a>
            </li>
            <li>
              <a href={`${homePageUrl}#masterclasses`} onClick={(event) => {
                event.preventDefault();
                window.location.assign(`${homePageUrl}#masterclasses`);
              }}>
                Masterclasses
              </a>
            </li>
            <li>
              <a href={`${homePageUrl}#contact`} onClick={(event) => {
                event.preventDefault();
                window.location.assign(`${homePageUrl}#contact`);
              }}>
                Contact
              </a>
            </li>
          </ul>

          <div className="footer-socials-block">
            <ul className="footer-social-list">
              <li>
                <a href="https://www.instagram.com/eoex.studio/" target="_blank" rel="noreferrer">@EOEX.STUDIO</a>
              </li>
            </ul>
          </div>
        </div>
        <small>
          <span> © {new Date().getFullYear()} EOEX. Privacy Policy · Terms of Service</span>
        </small>
      </footer>
    </div>
  );
}
