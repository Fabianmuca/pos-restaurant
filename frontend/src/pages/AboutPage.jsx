import { useEffect, useRef } from 'react';

const AboutPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleScroll = () => {
      hero.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: '🪑', title: 'Menaxhim Tavolinash', desc: 'Shiko statusin e çdo tavoline në kohë reale. Ndërroji lehtë kamarierët dhe menaxho kapacitetin pa mundim.' },
    { icon: '📋', title: 'Menaxhim Menuje', desc: 'Shto, edito ose largo artikuj. Organizoi sipas kategorive: ushqim, pije dhe ëmbëlsirë.' },
    { icon: '👨‍🍳', title: 'Panel Kuzhine', desc: 'Kuzhina merr porositë menjëherë dhe ndryshon statusin pa nevojë për komunikim verbal.' },
    { icon: '💳', title: 'Pagesa Fleksibël', desc: 'Prano pagesa me cash ose kartë. Historiku i plotë i çdo transaksioni të ruajtur automatikisht.' },
    { icon: '🧾', title: 'Printim Faturash', desc: 'Fatura standarte POS 80mm e gatshme me një klik. Printo direkt pas çdo porosie apo pagese.' },
    { icon: '👥', title: 'Role & Leje', desc: 'Admin, kamarier dhe arkadar — çdo rol ka akses vetëm te funksionet e veta për siguri maksimale.' },
  ];

  const stats = [
    { num: '500+', label: 'Porosi të processuara' },
    { num: '50+',  label: 'Klientë të kënaqur' },
    { num: '99.9%', label: 'Uptime i garantuar' },
    { num: '24/7', label: 'Suport teknik' },
  ];

  const contacts = [
    { icon: '📍', title: 'Adresa',        value: 'Rruga Ali Demi, Tiranë, Shqipëri' },
    { icon: '📞', title: 'Telefon',       value: '+355 69 412 3870' },
    { icon: '✉️', title: 'Email',         value: 'info@barpos.al' },
    { icon: '🕐', title: 'Orari i Zyrës', value: 'E Hënë – E Premte: 09:00 – 17:00' },
    { icon: '📅', title: 'Themeluar',     value: '2026, Tiranë' },
  ];

  return (
    <div className="about-page">
      {/* ── Hero ── */}
      <div className="about-hero" ref={heroRef}>
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <span className="about-hero-tag">Që nga viti 2026</span>
          <h1 className="about-hero-title">BarPOS</h1>
          <p className="about-hero-subtitle">
            Sistemi modern i menaxhimit për bare &amp; restorante
          </p>
        </div>
      </div>

      <div className="about-body">
        {/* ── Kush jemi ── */}
        <section className="about-section about-intro-section">
          <div className="about-section-inner about-intro-grid">
            <div className="about-text-block">
              <h2 className="about-section-title">Kush jemi ne?</h2>
              <p className="about-desc">
                <strong>BarPOS</strong> është një platformë e avancuar Point-of-Sale e
                krijuar posaçërisht për industrinë e gastronomisë shqiptare. Me një ekip
                të apasionuar pas teknologjisë dhe hospitalitetit, kemi ndërtuar një
                zgjidhje gjithëpërfshirëse që lejon adminët, kamarierët dhe arkatarët të
                punojnë me efikasitet maksimal — nga menaxhimi i tavolinave deri te
                printimi i faturave.
              </p>
              <p className="about-desc">
                Platforma jonë ndërton urën ndërmjet kuzhinës dhe sallës, duke siguruar
                që çdo porosi të arrijë në kohë dhe çdo pagesë të procesohet pa probleme.
                Infrastruktura cloud-based garanton disponueshmëri të plotë edhe në orët
                e pikut.
              </p>
            </div>
            <div className="about-stats-grid">
              {stats.map((s, i) => (
                <div className="about-stat-card" key={i}>
                  <span className="about-stat-num">{s.num}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Karakteristikat ── */}
        <section className="about-section about-features-section">
          <div className="about-section-inner">
            <h2 className="about-section-title about-center">Çfarë ofron BarPOS?</h2>
            <div className="about-features-grid">
              {features.map((f, i) => (
                <div className="about-feature-card" key={i}>
                  <span className="about-feature-icon">{f.icon}</span>
                  <h3 className="about-feature-title">{f.title}</h3>
                  <p className="about-feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Kontakti ── */}
        <section className="about-section about-contact-section">
          <div className="about-section-inner about-contact-grid">
            <div>
              <h2 className="about-section-title">Na Kontaktoni</h2>
              <p className="about-desc" style={{ marginBottom: 32 }}>
                Jemi të gatshëm t'ju ndihmojmë me instalimin, trajnimin e stafit dhe çdo
                pyetje teknike. Na shkruani ose vizitoni zyrat tona në Tiranë.
              </p>
              <div className="about-contact-list">
                {contacts.map((c, i) => (
                  <div className="about-contact-item" key={i}>
                    <span className="about-contact-icon">{c.icon}</span>
                    <div>
                      <strong>{c.title}</strong>
                      <p>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-map-placeholder">
              <span className="about-map-icon">🗺️</span>
              <p style={{ fontWeight: 600 }}>Rruga Ali Demi</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: 4 }}>Tiranë, Shqipëri</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
