(function() {
    'use strict';

    const translations = {
        en: {
            "nav": {
                "home": "Home",
                "business": "Business Records",
                "property": "Property Records",
                "court": "Court Records",
                "people": "People & Identity"
            },
            "hero": {
                "title": "Public data, made findable.",
                "subtitle": "One clean destination for searching across government and public databases that most people don't know exist.",
                "placeholder": "Search public records...",
                "cta": "Quick Search"
            },
            "footer": {
                "privacy": "Privacy Policy",
                "terms": "Terms of Service",
                "disclosure": "Affiliate Disclosure",
                "allRights": "All rights reserved."
            }
        },
        es: {
            "nav": {
                "home": "Inicio",
                "business": "Registros Comerciales",
                "property": "Registros de Propiedad",
                "court": "Registros Judiciales",
                "people": "Personas e Identidad"
            },
            "hero": {
                "title": "Datos públicos, fáciles de encontrar.",
                "subtitle": "Un destino limpio para buscar en bases de datos gubernamentales y públicas que la mayoría de las personas no conoce.",
                "placeholder": "Buscar registros públicos...",
                "cta": "Búsqueda Rápida"
            },
            "footer": {
                "privacy": "Política de Privacidad",
                "terms": "Términos de Servicio",
                "disclosure": "Divulgación de Afiliados",
                "allRights": "Todos los derechos reservados."
            }
        },
        pt: {
            "nav": {
                "home": "Início",
                "business": "Registros Comerciais",
                "property": "Registros de Propriedade",
                "court": "Registros Judiciais",
                "people": "Pessoas e Identidade"
            },
            "hero": {
                "title": "Dados públicos, fáceis de encontrar.",
                "subtitle": "Um destino limpo para pesquisar em bancos de dados governamentais e públicos que a maioria das pessoas não conhece.",
                "placeholder": "Pesquisar registros públicos...",
                "cta": "Busca Rápida"
            },
            "footer": {
                "privacy": "Política de Privacidade",
                "terms": "Termos de Serviço",
                "disclosure": "Divulgação de Afiliados",
                "allRights": "Todos os direitos reservados."
            }
        }
    };

    const LANGUAGES = [
        { code: 'en', label: 'English',   flag: '🇺🇸' },
        { code: 'es', label: 'Español',   flag: '🇪🇸' },
        { code: 'pt', label: 'Português', flag: '🇧🇷' },
    ];

    let currentLocale = localStorage.getItem('boringsearch_lang') || 'en';

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
        const switcherContainer = document.createElement('div');
        switcherContainer.id = 'bs-lang-switcher';
        Object.assign(switcherContainer.style, {
            position: 'fixed', bottom: '24px', right: '24px', zIndex: '9999',
            fontFamily: "'Inter', sans-serif"
        });

        const current = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0];

        switcherContainer.innerHTML = `
            <button id="bs-lang-btn" style="
                display: flex; align-items: center; gap: 8px;
                padding: 10px 18px; border-radius: 999px;
                border: 1px solid rgba(0,0,0,0.1);
                background: rgba(255,255,255,0.9);
                backdrop-filter: blur(12px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                cursor: pointer; font-size: 14px; font-weight: 600;
                color: #1f2937; transition: transform 0.2s;
            ">
                <span style="font-size:18px">${current.flag}</span>
                <span>${current.label}</span>
                <span style="font-size:10px; opacity:0.5">▼</span>
            </button>
            <div id="bs-lang-dropdown" class="hidden" style="
                position: absolute; bottom: calc(100% + 12px); right: 0;
                background: white; border: 1px solid rgba(0,0,0,0.08);
                border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                min-width: 180px; overflow: hidden;
            ">
                ${LANGUAGES.map(lang => `
                    <button class="bs-lang-opt" data-code="${lang.code}" style="
                        display: flex; align-items: center; gap: 12px;
                        width: 100%; padding: 14px 20px; border: none;
                        background: ${lang.code === currentLocale ? '#f9fafb' : 'transparent'};
                        cursor: pointer; font-size: 14px; text-align: left;
                        color: #1f2937; font-weight: ${lang.code === currentLocale ? '700' : '400'};
                    ">
                        <span style="font-size:20px">${lang.flag}</span>
                        <span>${lang.label}</span>
                    </button>
                `).join('')}
            </div>
            <style>
                .hidden { display: none !important; }
                #bs-lang-btn:hover { transform: scale(1.02); background: #fff; }
                .bs-lang-opt:hover { background: #f3f4f6 !important; }
            </style>
        `;

        document.body.appendChild(switcherContainer);
        const btn = document.getElementById('bs-lang-btn');
        const dropdown = document.getElementById('bs-lang-dropdown');
        btn.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); };
        document.querySelectorAll('.bs-lang-opt').forEach(opt => {
            opt.onclick = () => {
                localStorage.setItem('boringsearch_lang', opt.dataset.code);
                location.reload();
            };
        });
        document.addEventListener('click', () => dropdown.classList.add('hidden'));
    }

    document.addEventListener('DOMContentLoaded', () => {
        translatePage();
        initSwitcher();
    });

})();
