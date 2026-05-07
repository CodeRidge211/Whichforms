(function() {
    'use strict';

    const translations = {
        en: {
            nav: { codes: 'Codes', brands: 'Brands', symptoms: 'Symptom Checker' },
            hero: { title: 'Check engine light on? Let\\'s diagnose it.', subtitle: 'Access over 2,500 OBD2 diagnostic trouble codes for cars, trucks, and motorcycles. Get severity ratings, common causes, and repair guidance.', placeholder: 'Enter code (e.g. P0300, P0420)', searchButton: 'Diagnose', popular: 'Popular Codes', symptoms: 'Symptom Search' },
            footer: { privacy: 'Privacy', terms: 'Terms', disclosure: 'Affiliate Disclosure', allRights: 'All rights reserved.' }
        },
        es: {
            nav: { codes: 'Códigos', brands: 'Marcas', symptoms: 'Verificador' },
            hero: { title: '¿Se encendió la luz del motor? Diagnostiquémosla.', subtitle: 'Accede a más de 2,500 códigos de diagnóstico OBD2 para autos, camionetas y motorcycles.', placeholder: 'Ingresa el código (ej. P0300)', searchButton: 'Diagnosticar', popular: 'Códigos Populares', symptoms: 'Búsqueda por Síntomas' },
            footer: { privacy: 'Privacidad', terms: 'Términos', disclosure: 'Divulgación', allRights: 'Todos los derechos reservados.' }
        }
    };

    const LANGUAGES = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'es', label: 'Español', flag: '🇪🇸' }
    ];

    let currentLocale = localStorage.getItem('obdvault_lang') || 'en';

    function translatePage() {
        const langData = translations[currentLocale] || translations.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const text = key.split('.').reduce((obj, k) => obj && obj[k], langData);
            if (text) {
                if (el.tagName === 'INPUT' && el.type === 'text') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });
        document.documentElement.lang = currentLocale;
    }

    function initSwitcher() {
        const container = document.createElement('div');
        container.id = 'obd-lang-switcher';
        Object.assign(container.style, {
            position: 'fixed', bottom: '24px', right: '24px', zIndex: '9999',
            fontFamily: 'Inter, sans-serif'
        });

        const current = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0];

        container.innerHTML = `
            <button id=\"obd-lang-btn\" style=\"display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;border:1px solid rgba(0,0,0,0.1);background:rgba(255,255,255,0.9);backdrop-filter:blur(12px);box-shadow:0 4px 20px rgba(0,0,0,0.1);cursor:pointer;font-size:14px;font-weight:600;color:#1f2937;\">
                <span style=\"font-size:18px\">${current.flag}</span>
                <span>${current.label}</span>
                <span style=\"font-size:10px;opacity:0.5\">▼</span>
            </button>
            <div id=\"obd-lang-dropdown\" style=\"display:none;position:absolute;bottom:calc(100% + 12px);right:0;background:white;border:1px solid rgba(0,0,0,0.08);border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.15);min-width:180px;overflow:hidden;\">
                ${LANGUAGES.map(lang => `
                    <button class=\"obd-lang-opt\" data-code=\"${lang.code}\" style=\"display:flex;align-items:center;gap:12px;width:100%;padding:14px 20px;border:none;background:${lang.code === currentLocale ? '#f9fafb' : 'transparent'};cursor:pointer;font-size:14px;text-align:left;color:#1f2937;font-weight:${lang.code === currentLocale ? '700' : '400'};\">
                        <span style=\"font-size:20px\">${lang.flag}</span>
                        <span>${lang.label}</span>
                        ${lang.code === currentLocale ? '<span style=\"margin-left:auto;color:#10b981\">✓</span>' : ''}
                    </button>
                `).join('')}
            </div>
            <style>#obd-lang-btn:hover { transform: scale(1.02); } .obd-lang-opt:hover { background: #f3f4f6 !important; }</style>
        `;

        document.body.appendChild(container);

        const btn = document.getElementById('obd-lang-btn');
        const dropdown = document.getElementById('obd-lang-dropdown');

        btn.onclick = (e) => { e.stopPropagation(); dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none'; };

        document.querySelectorAll('.obd-lang-opt').forEach(opt => {
            opt.onclick = () => { localStorage.setItem('obdvault_lang', opt.dataset.code); location.reload(); };
        });

        document.addEventListener('click', () => { dropdown.style.display = 'none'; });
    }

    document.addEventListener('DOMContentLoaded', () => {
        translatePage();
        initSwitcher();
    });
})();