(function() {
    'use strict';

    const translations = {
        en: {
            "nav": {
                "home": "Home",
                "pdfTools": "PDF Tools",
                "templates": "Templates",
                "privacy": "Privacy & Security"
            },
            "hero": {
                "title": "Pure Utility. <br>No Bloat.",
                "subtitle": "100% free web utilities that run entirely in your browser. No signups, no data storage, just plain tools.",
                "badge": "Secure & Cloud-Free"
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
                "pdfTools": "Herramientas PDF",
                "templates": "Plantillas",
                "privacy": "Privacidad y Seguridad"
            },
            "hero": {
                "title": "Utilidad Pura. <br>Sin Relleno.",
                "subtitle": "Utilidades web 100% gratuitas que se ejecutan completamente en tu navegador. Sin registros, sin almacenamiento de datos, solo herramientas puras.",
                "badge": "Seguro y Sin Nube"
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
                "pdfTools": "Ferramentas PDF",
                "templates": "Modelos",
                "privacy": "Privacidade e Segurança"
            },
            "hero": {
                "title": "Utilidade Pura. <br>Sem Excesso.",
                "subtitle": "Utilitários web 100% gratuitos que rodam inteiramente no seu navegador. Sem cadastros, sem armazenamento de dados, apenas ferramentas puras.",
                "badge": "Seguro e Sem Nuvem"
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

    let currentLocale = localStorage.getItem('plaintools_lang') || 'en';

    function translatePage() {
        const langData = translations[currentLocale] || translations.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const text = key.split('.').reduce((obj, k) => obj && obj[k], langData);
            if (text) {
                el.innerHTML = text;
            }
        });
        document.documentElement.lang = currentLocale;
    }

    function initSwitcher() {
        const switcherContainer = document.createElement('div');
        switcherContainer.id = 'pt-lang-switcher';
        Object.assign(switcherContainer.style, {
            position: 'fixed', bottom: '24px', right: '24px', zIndex: '9999',
            fontFamily: "'Outfit', sans-serif"
        });

        const current = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0];

        switcherContainer.innerHTML = `
            <button id="pt-lang-btn" style="
                display: flex; align-items: center; gap: 8px;
                padding: 10px 18px; border-radius: 999px;
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(15, 23, 42, 0.8);
                backdrop-filter: blur(12px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                cursor: pointer; font-size: 14px; font-weight: 600;
                color: #fff; transition: transform 0.2s;
            ">
                <span style="font-size:18px">${current.flag}</span>
                <span>${current.label}</span>
                <span style="font-size:10px; opacity:0.5">▼</span>
            </button>
            <div id="pt-lang-dropdown" class="hidden" style="
                position: absolute; bottom: calc(100% + 12px); right: 0;
                background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
                border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                min-width: 180px; overflow: hidden;
            ">
                ${LANGUAGES.map(lang => `
                    <button class="pt-lang-opt" data-code="${lang.code}" style="
                        display: flex; align-items: center; gap: 12px;
                        width: 100%; padding: 14px 20px; border: none;
                        background: ${lang.code === currentLocale ? 'rgba(56, 189, 248, 0.1)' : 'transparent'};
                        cursor: pointer; font-size: 14px; text-align: left;
                        color: #fff; font-weight: ${lang.code === currentLocale ? '700' : '400'};
                    ">
                        <span style="font-size:20px">${lang.flag}</span>
                        <span>${lang.label}</span>
                    </button>
                `).join('')}
            </div>
            <style>
                .hidden { display: none !important; }
                #pt-lang-btn:hover { transform: scale(1.02); background: #1e293b; }
                .pt-lang-opt:hover { background: rgba(56, 189, 248, 0.05) !important; color: #38bdf8 !important; }
            </style>
        `;

        document.body.appendChild(switcherContainer);
        const btn = document.getElementById('pt-lang-btn');
        const dropdown = document.getElementById('pt-lang-dropdown');
        btn.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); };
        document.querySelectorAll('.pt-lang-opt').forEach(opt => {
            opt.onclick = () => {
                localStorage.setItem('plaintools_lang', opt.dataset.code);
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
