'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const translations = {
  en: {
    nav: { title: 'IsPermitRequired', tagline: 'Know before you build' },
    hero: { title: 'Do you need a permit?', subtitle: 'Get instant answers about building permits for any project in any US location.', cta: 'Check Permit Requirements' },
    locations: { label: 'Select Location', placeholder: 'Choose a state...' },
    projects: { label: 'Project Type', subtitle: 'What are you planning to build or renovate?' },
    result: {
      yes: { title: '✅ Permit Required', desc: 'A building permit is required for this project in this location.' },
      no: { title: '❌ No Permit Needed', desc: 'This project typically does not require a permit in this location.' },
      maybe: { title: '⚠️ May Require Permit', desc: 'Permit requirements vary. Check local requirements below.' }
    },
    details: { requirements: 'Requirements', exceptions: 'Exceptions', cost: 'Estimated Permit Cost', time: 'Processing Time', apply: 'Apply for Permit', source: 'Source' },
    footer: { privacy: 'Privacy Policy', terms: 'Terms of Service', disclosure: 'Affiliate Disclosure', allRights: 'All rights reserved.', network: 'Network' }
  },
  es: {
    nav: { title: 'IsPermitRequired', tagline: 'Sepa antes de construir' },
    hero: { title: '¿Necesitas un permiso?', subtitle: 'Obtén respuestas instantáneas sobre permisos de construcción para cualquier proyecto en cualquier lugar de EE.UU.', cta: 'Verificar Requisitos' },
    locations: { label: 'Seleccionar Ubicación', placeholder: 'Elige un estado...' },
    projects: { label: 'Tipo de Proyecto', subtitle: '¿Qué planeas construir o renovar?' },
    result: {
      yes: { title: '✅ Permiso Requerido', desc: 'Se requiere un permiso de construcción para este proyecto en esta ubicación.' },
      no: { title: '❌ No se Necesita Permiso', desc: 'Este proyecto típicamente no requiere un permiso en esta ubicación.' },
      maybe: { title: '⚠️ Puede Requerir Permiso', desc: 'Los requisitos varían. Consulta los requisitos locales a continuación.' }
    },
    details: { requirements: 'Requisitos', exceptions: 'Excepciones', cost: 'Costo Estimado', time: 'Tiempo de Procesamiento', apply: 'Solicitar Permiso', source: 'Fuente' },
    footer: { privacy: 'Política de Privacidad', terms: 'Términos de Servicio', disclosure: 'Divulgación de Afiliados', allRights: 'Todos los derechos reservados.', network: 'Red' }
  }
};

// Fallback data for demo purposes
const FALLBACK_DATA = {
  'California+roofing': { requires_permit: true, requirements: 'Standard permit required for roof replacement. Tear-off requires additional debris handling documentation.', exceptions: 'Shingle-over permitted in some counties if existing roof is in good condition.', estimated_cost_range: '$500-$2,000', processing_time: '3-14 days', application_url: 'https://www.bsa.ca.gov/', source: 'California Building Standards' },
  'California+deck': { requires_permit: true, requirements: 'Building permit required for decks over 30 inches from grade. Structural calculations required.', exceptions: 'Ground-level decks under 200 sq ft may be exempt.', estimated_cost_range: '$500-$1,500', processing_time: '10-30 days', application_url: 'https://www.bsa.ca.gov/', source: 'California Building Standards' },
  'California+solar': { requires_permit: true, requirements: 'Electrical and building permits required. Utility interconnection application required.', exceptions: 'Expedited review for certain low-capacity systems.', estimated_cost_range: '$500-$2,500', processing_time: '7-30 days', application_url: 'https://www.cpuc.ca.gov/', source: 'California PUC' },
  'California+adu': { requires_permit: true, requirements: 'Pre-approved ADU plans available. Must comply with local zoning and building codes.', exceptions: 'Junior ADUs have streamlined requirements.', estimated_cost_range: '$2,000-$10,000', processing_time: '60-180 days', application_url: 'https://hcd.ca.gov/', source: 'California HCD' },
  'California+fence': { requires_permit: false, requirements: 'No state permit required. Front: 42 inches max, Side/Rear: 6 feet max.', exceptions: 'Historic districts may have additional requirements.', estimated_cost_range: '$0-$200', processing_time: 'Varies by locality', application_url: null, source: 'Local jurisdiction' },
  'California+pool': { requires_permit: true, requirements: 'Building, electrical, and plumbing permits required. Enclosure/barrier mandatory.', exceptions: 'Above-ground pools under 24 inches may be exempt.', estimated_cost_range: '$1,000-$5,000', processing_time: '30-90 days', application_url: 'https://www.cpuc.ca.gov/', source: 'California Health' },
  'New York+roofing': { requires_permit: true, requirements: 'Work permit required for any roof replacement. FDNY coordination for buildings over 75 feet.', exceptions: 'Minor repairs under 10 squares may be exempt.', estimated_cost_range: '$800-$3,000', processing_time: '5-21 days', application_url: 'https://www1.nyc.gov/site/buildings/', source: 'NYC DOB' },
  'Texas+roofing': { requires_permit: false, requirements: 'No state-level permit required. Most counties and cities handle independently.', exceptions: 'HOA restrictions may apply in deed-restricted communities.', estimated_cost_range: '$0-$500', processing_time: 'Varies by locality', application_url: null, source: 'Local jurisdiction' },
  'Florida+roofing': { requires_permit: true, requirements: 'Required for all re-roofing projects. Must submit wind mitigation form.', exceptions: 'Reroofing over existing roof prohibited in hurricane zones.', estimated_cost_range: '$400-$1,500', processing_time: '3-10 days', application_url: 'https://www.myflorlicense.com/', source: 'Florida DBPR' },
  'Washington+deck': { requires_permit: true, requirements: 'Building permit required. Structural engineer stamp required for decks over 30 inches.', exceptions: 'Free-standing decks under 200 sq ft have simplified requirements.', estimated_cost_range: '$400-$1,200', processing_time: '10-25 days', application_url: 'https://lni.wa.gov/', source: 'WA L&I' },
  'Arizona+solar': { requires_permit: true, requirements: 'Electrical permit required. Most jurisdictions have expedited solar permit processes.', exceptions: 'Some municipalities have blanket permits for residential under 10kW.', estimated_cost_range: '$200-$800', processing_time: '3-14 days', application_url: 'https://az.gov/', source: 'Arizona state' },
};

const LOCATIONS = [
  'California', 'New York', 'Texas', 'Florida', 'Washington', 
  'Arizona', 'New Jersey', 'Virginia', 'Colorado', 'Oregon',
  'Georgia', 'North Carolina', 'Michigan', 'Ohio', 'Pennsylvania'
];

const PROJECT_TYPES = [
  { slug: 'roofing', name: 'Roofing', icon: '🏠', desc: 'Replace or repair your roof' },
  { slug: 'deck', name: 'Deck Construction', icon: '🔨', desc: 'Build a new deck or patio' },
  { slug: 'solar', name: 'Solar Installation', icon: '☀️', desc: 'Install solar panels' },
  { slug: 'adu', name: 'ADU', icon: '🏢', desc: 'Accessory dwelling unit' },
  { slug: 'fence', name: 'Fence Installation', icon: '🪵', desc: 'Install a fence or gate' },
  { slug: 'pool', name: 'Pool Installation', icon: '🏊', desc: 'In-ground or above-ground pool' },
  { slug: 'renovation', name: 'Home Renovation', icon: '🔧', desc: 'Kitchen, bathroom, or major remodel' },
  { slug: 'commercial', name: 'Commercial', icon: '🏬', desc: 'Business or commercial project' },
];

export default function Home() {
  const [lang, setLang] = useState('en');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('ispermitrequired_lang') || 'en';
    setLang(savedLang);
  }, []);

  const handleLangChange = (code) => {
    setLang(code);
    localStorage.setItem('ispermitrequired_lang', code);
  };

  const checkPermit = async () => {
    if (!selectedLocation || !selectedProject) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/check-permit?location=${encodeURIComponent(selectedLocation)}&project=${encodeURIComponent(selectedProject)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      // Use fallback data
      const key = `${selectedLocation}+${selectedProject}`;
      const fallback = FALLBACK_DATA[key];
      if (fallback) {
        setResult({ ...fallback, location: selectedLocation, project_type: selectedProject });
      } else {
        setResult({ requires_permit: null, requirements: 'Contact your local building department for specific requirements.', exceptions: '', estimated_cost_range: 'Varies', processing_time: 'Contact local authority', application_url: null, source: 'Local jurisdiction' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getResultClass = () => {
    if (!result) return '';
    if (result.requires_permit === true) return styles.resultYes;
    if (result.requires_permit === false) return styles.resultNo;
    return styles.resultMaybe;
  };

  return (
    <>
      <Head>
        <title>IsPermitRequired | Building Permit Checker</title>
        <meta name='description' content='Instantly check if you need a building permit for any project. Roofing, decks, solar, ADUs, and more across all US states.' />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandTitle}>IsPermit<span>Required</span></span>
            <span className={styles.brandTag}>{t.nav.tagline}</span>
          </div>
          <div className={styles.langSelector}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => handleLangChange(l.code)}
                className={lang === l.code ? styles.langActive : ''}
              >
                {l.flag}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.subtitle}</p>
        </section>

        <section className={styles.checker}>
          <div className={styles.selectGroup}>
            <label>{t.locations.label}</label>
            <select 
              value={selectedLocation} 
              onChange={(e) => { setSelectedLocation(e.target.value); setResult(null); }}
              className={styles.select}
            >
              <option value=''>{t.locations.placeholder}</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className={styles.projectGrid}>
            <label>{t.projects.label}</label>
            <p className={styles.projectSubtitle}>{t.projects.subtitle}</p>
            <div className={styles.projects}>
              {PROJECT_TYPES.map(p => (
                <button
                  key={p.slug}
                  onClick={() => { setSelectedProject(p.slug); setResult(null); }}
                  className={`${styles.projectBtn} ${selectedProject === p.slug ? styles.projectActive : ''}`}
                >
                  <span className={styles.projectIcon}>{p.icon}</span>
                  <span className={styles.projectName}>{p.name}</span>
                  <span className={styles.projectDesc}>{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={checkPermit} 
            disabled={!selectedLocation || !selectedProject || loading}
            className={styles.checkBtn}
          >
            {loading ? 'Checking...' : t.hero.cta}
          </button>
        </section>

        {result && (
          <section className={`${styles.result} ${getResultClass()}`}>
            <div className={styles.resultHeader}>
              {result.requires_permit === true && <h2>{t.result.yes.title}</h2>}
              {result.requires_permit === false && <h2>{t.result.no.title}</h2>}
              {result.requires_permit === null && <h2>{t.result.maybe.title}</h2>}
              <p>{result.requires_permit === true ? t.result.yes.desc : result.requires_permit === false ? t.result.no.desc : t.result.maybe.desc}</p>
            </div>

            <div className={styles.resultDetails}>
              {result.requirements && (
                <div className={styles.detailCard}>
                  <h4>{t.details.requirements}</h4>
                  <p>{result.requirements}</p>
                </div>
              )}
              
              {result.exceptions && (
                <div className={styles.detailCard}>
                  <h4>{t.details.exceptions}</h4>
                  <p>{result.exceptions}</p>
                </div>
              )}

              <div className={styles.detailGrid}>
                {result.estimated_cost_range && (
                  <div className={styles.detailItem}>
                    <span>{t.details.cost}</span>
                    <strong>{result.estimated_cost_range}</strong>
                  </div>
                )}
                {result.processing_time && (
                  <div className={styles.detailItem}>
                    <span>{t.details.time}</span>
                    <strong>{result.processing_time}</strong>
                  </div>
                )}
              </div>

              {result.application_url && (
                <a href={result.application_url} target='_blank' rel='noopener noreferrer' className={styles.applyBtn}>
                  {t.details.apply} →
                </a>
              )}

              {result.source && (
                <p className={styles.source}>Source: {result.source}</p>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <a href='/privacy.html'>{t.footer.privacy}</a>
            <a href='/terms.html'>{t.footer.terms}</a>
            <a href='/affiliate.html'>{t.footer.disclosure}</a>
          </div>
          <div className={styles.footerNetwork}>
            <span>{t.footer.network}:</span>
            <a href='https://obdvault.com' target='_blank' rel='noopener'>OBD Vault</a>
            <a href='https://faultdeck.com' target='_blank' rel='noopener'>FaultDeck</a>
            <a href='https://boringsearch.com' target='_blank' rel='noopener'>Boring Search</a>
          </div>
          <p>© 2026 IsPermitRequired. {t.footer.allRights}</p>
        </div>
      </footer>
    </>
  );
}