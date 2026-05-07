'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' }
];

const translations = {
  en: {
    nav: { agencies: 'Agencies', situations: 'Situations', identity: 'Identity', about: 'About' },
    hero: { title: 'The paperwork you need, ', titleAccent: 'explained.', subtitle: 'Stop searching for forms. Get plain English explanations, deadlines, and official download links in one place.', placeholder: 'Search for a form (e.g. W-9, I-485, LLC)', cta: 'Search Forms' },
    sections: { situations: 'Popular Situations', identity: 'Identity & Documents' },
    footer: { privacy: 'Privacy Policy', terms: 'Terms of Service', disclosure: 'Affiliate Disclosure', allRights: 'All rights reserved.', network: 'Network' }
  },
  es: {
    nav: { agencies: 'Agencias', situations: 'Situaciones', identity: 'Identidad', about: 'About' },
    hero: { title: 'El papeleo que necesitas, ', titleAccent: 'explicado.', subtitle: 'Deja de buscar formularios. Obtén explicaciones en lenguaje sencillo, plazos y enlaces oficiales de descarga en un solo lugar.', placeholder: 'Busca un formulario (ej. W-9, I-485, LLC)', cta: 'Buscar Formularios' },
    sections: { situations: 'Situaciones Populares', identity: 'Identidad y Documentos' },
    footer: { privacy: 'Política de Privacidad', terms: 'Términos de Servicio', disclosure: 'Divulgación de Afiliados', allRights: 'Todos los derechos reservados.', network: 'Red' }
  },
  ru: {
    nav: { agencies: 'Агентства', situations: 'Ситуации', identity: 'Личность', about: 'О сайте' },
    hero: { title: 'Документы, которые вам нужны, ', titleAccent: 'объяснены.', subtitle: 'Перестаньте искать формы. Получите понятные объяснения, сроки и ссылки на официальные документы в одном месте.', placeholder: 'Поиск формы (например, W-9, I-485, LLC)', cta: 'Найти формы' },
    sections: { situations: 'Популярные ситуации', identity: 'Личность и документы' },
    footer: { privacy: 'Политика конфиденциальности', terms: 'Условия использования', disclosure: 'Раскрытие информации об аффилированных лицах', allRights: 'Все права защищены.', network: 'Сеть' }
  },
  zh: {
    nav: { agencies: '机构', situations: '情况', identity: '身份', about: '关于' },
    hero: { title: '您需要的文书工作，', titleAccent: '已解释。', subtitle: '不再需要搜索表格。在一个地方获得简单的英文解释、截止日期和官方下载链接。', placeholder: '搜索表格（例如 W-9、I-485、LLC）', cta: '搜索表格' },
    sections: { situations: '常见情况', identity: '身份证明文件' },
    footer: { privacy: '隐私政策', terms: '服务条款', disclosure: '附属机构披露', allRights: '版权所有。', network: '网络' }
  },
  pt: {
    nav: { agencies: 'Agências', situations: 'Situações', identity: 'Identidade', about: 'Sobre' },
    hero: { title: 'A papelada que você precisa, ', titleAccent: 'explicada.', subtitle: 'Pare de procurar formulários. Obtenha explicações em linguagem simples, prazos e links oficiais para download em um só lugar.', placeholder: 'Pesquise um formulário (ex. W-9, I-485, LLC)', cta: 'Pesquisar formulários' },
    sections: { situations: 'Situações populares', identity: 'Identidade e documentos' },
    footer: { privacy: 'Política de Privacidade', terms: 'Termos de Serviço', disclosure: 'Divulgação de Afiliados', allRights: 'Todos os direitos reservados.', network: 'Rede' }
  }
};

export default function Home() {
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [situations, setSituations] = useState([]);
  const [identityDocs, setIdentityDocs] = useState([]);
  const [allForms, setAllForms] = useState([]);
  const searchRef = useRef(null);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    // Load language preference
    const savedLang = localStorage.getItem('whichforms_lang') || 'en';
    setLang(savedLang);
    
    // Load form data from JSON file
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        setSituations(data.situations || []);
        setIdentityDocs(data.identityDocs || []);
        setAllForms([
          ...(data.irsForms || []),
          ...(data.uscisForms || []),
          ...(data.ssaForms || []),
          ...(data.businessForms || [])
        ]);
      })
      .catch(err => console.error('Failed to load form data:', err));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.length < 2) {
      setShowResults(false);
      return;
    }
    
    // Filter forms by name, form number, or description
    const results = allForms.filter(form => 
      form.name.toLowerCase().includes(query) ||
      (form.form_number && form.form_number.toLowerCase().includes(query)) ||
      form.plain_english.toLowerCase().includes(query)
    ).slice(0, 8);
    
    setSearchResults(results);
    setShowResults(true);
  };

  const handleLangChange = (code) => {
    setLang(code);
    localStorage.setItem('whichforms_lang', code);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <Link href='/' className={styles.logo}>
          Which<span>Forms</span>
        </Link>
        <nav className={styles.nav}>
          <a href='#agencies'>{t.nav.agencies}</a>
          <a href='#situations'>{t.nav.situations}</a>
          <a href='#identity'>{t.nav.identity}</a>
        </nav>
        <div className={styles.langSelector}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => handleLangChange(l.code)}
              className={lang === l.code ? styles.langActive : ''}
              title={l.label}
            >
              {l.flag}
            </button>
          ))}
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>{t.hero.title}<span>{t.hero.titleAccent}</span></h1>
          <p className={styles.heroSub}>{t.hero.subtitle}</p>
          
          <div className={styles.searchContainer} ref={searchRef}>
            <input
              type='text'
              className={styles.searchBar}
              placeholder={t.hero.placeholder}
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            />
            <button className={styles.searchBtn} onClick={() => {
              if (searchQuery.length >= 2) setShowResults(true);
              else if (searchQuery.length > 0) {
                const results = allForms.filter(form => 
                  form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (form.form_number && form.form_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  form.plain_english.toLowerCase().includes(searchQuery.toLowerCase())
                ).slice(0, 8);
                setSearchResults(results);
                setShowResults(true);
              }
            }}>{t.hero.cta}</button>
            
            {showResults && searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map(r => (
                  <div key={r.slug} className={styles.searchResultItem}>
                    <div>
                      <h4>{r.form_number ? r.form_number + ': ' : ''}{r.name}</h4>
                      <p>{r.agency}</p>
                    </div>
                    <span>View →</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id='situations' className={styles.section}>
          <h2>{t.sections.situations}</h2>
          <div className={styles.grid}>
            {situations.map(sit => (
              <div key={sit.slug} className={styles.card}>
                <div className={styles.cardTag}>{sit.category}</div>
                <div className={styles.cardTitle}>{sit.title}</div>
                <p className={styles.cardDesc}>{sit.plain_english}</p>
              </div>
            ))}
          </div>
        </section>

        <section id='identity' className={styles.section}>
          <h2>{t.sections.identity}</h2>
          <div className={styles.grid}>
            {identityDocs.map(doc => (
              <div key={doc.slug} className={styles.card}>
                <div className={styles.cardTag}>{doc.category}</div>
                <div className={styles.cardTitle}>{doc.name}</div>
                <p className={styles.cardDesc}>{doc.plain_english}</p>
              </div>
            ))}
          </div>
        </section>

        <section id='agencies' className={styles.section}>
          <h2>Government Agencies</h2>
          <div className={styles.agencyGrid}>
            <a href='https://www.irs.gov/' target='_blank' rel='noopener' className={styles.agencyCard}>
              <span className={styles.agencyEmoji}>🏛️</span>
              <span>IRS</span>
              <span className={styles.agencySub}>Tax Forms</span>
            </a>
            <a href='https://www.uscis.gov/' target='_blank' rel='noopener' className={styles.agencyCard}>
              <span className={styles.agencyEmoji}>🗽</span>
              <span>USCIS</span>
              <span className={styles.agencySub}>Immigration Forms</span>
            </a>
            <a href='https://www.ssa.gov/' target='_blank' rel='noopener' className={styles.agencyCard}>
              <span className={styles.agencyEmoji}>🪪</span>
              <span>SSA</span>
              <span className={styles.agencySub}>Social Security</span>
            </a>
          </div>
        </section>
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
            <a href='https://boringsearch.com' target='_blank' rel='noopener'>Boring Search</a>
            <a href='https://obdvault.com' target='_blank' rel='noopener'>OBD Vault</a>
            <a href='https://faultdeck.com' target='_blank' rel='noopener'>FaultDeck</a>
          </div>
          <p className={styles.footerCopy}>© 2026 WhichForms. {t.footer.allRights}</p>
        </div>
      </footer>
    </>
  );
}