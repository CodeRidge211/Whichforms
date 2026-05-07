(function() {
    'use strict';

    // ── TRANSLATIONS ──────────────────────────────────
    const translations = {
        en: {
            "nav": {
                "home": "Home",
                "brands": "Brands",
                "categories": "Categories",
                "symptomChecker": "Symptom Checker"
            },
            "hero": {
                "title": "Something's broken. Let's figure out why.",
                "subtitle": "Instantly diagnose appliance, HVAC, and electronics error codes with DIY fix guides.",
                "hasCode": "I have an error code",
                "hasCodeDesc": "Type in your code, get the answer instantly.",
                "noCode": "I don't have a code",
                "noCodeDesc": "Symptom checker walks you to the solution.",
                "placeholder": "Enter error code (e.g. F3 E2)",
                "searchButton": "Search"
            },
            "footer": {
                "tagline": "Helping you diagnose and fix what's broken.",
                "privacy": "Privacy Policy",
                "terms": "Terms of Service",
                "disclosure": "Affiliate Disclosure",
                "allRights": "All rights reserved."
            }
        },
        es: {
            "nav": {
                "home": "Inicio",
                "brands": "Marcas",
                "categories": "Categorías",
                "symptomChecker": "Verificador de Síntomas"
            },
            "hero": {
                "title": "Algo está roto. Averigüemos por qué.",
                "subtitle": "Diagnostica instantáneamente códigos de error de electrodomésticos, HVAC y electrónica con guías de reparación.",
                "hasCode": "Tengo un código de error",
                "hasCodeDesc": "Escribe tu código y obtén la respuesta al instante.",
                "noCode": "No tengo un código",
                "noCodeDesc": "El verificador de síntomas te lleva a la solución.",
                "placeholder": "Ingresa el código de error (ej. F3 E2)",
                "searchButton": "Buscar"
            },
            "footer": {
                "tagline": "Ayudándote a diagnosticar y reparar lo que está roto.",
                "privacy": "Política de Privacidad",
                "terms": "Términos de Servicio",
                "disclosure": "Divulgación de Afiliados",
                "allRights": "Todos los derechos reservados."
            }
        },
        pt: {
            "nav": {
                "home": "Início",
                "brands": "Marcas",
                "categories": "Categorias",
                "symptomChecker": "Verificador de Sintomas"
            },
            "hero": {
                "title": "Algo está quebrado. Vamos descobrir por quê.",
                "subtitle": "Diagnostique instantaneamente códigos de erro de eletrodomésticos, HVAC e eletrônicos com guias de reparo.",
                "hasCode": "Tenho um código de erro",
                "hasCodeDesc": "Digite seu código e obtenha a resposta instantaneamente.",
                "noCode": "Não tenho um código",
                "noCodeDesc": "O verificador de sintomas te leva à solução.",
                "placeholder": "Digite o código de erro (ex. F3 E2)",
                "searchButton": "Pesquisar"
            },
            "footer": {
                "tagline": "Ajudando você a diagnosticar e consertar o que está quebrado.",
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

    let currentLocale = localStorage.getItem('faultdeck_lang') || 'en';

    // ── CORE LOGIC ────────────────────────────────────
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
        switcherContainer.id = 'fd-lang-switcher';
        Object.assign(switcherContainer.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: '9999',
            fontFamily: "'Inter', sans-serif"
        });

        const current = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0];

        switcherContainer.innerHTML = `
            <button id="fd-lang-btn" style="
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
            <div id="fd-lang-dropdown" class="hidden" style="
                position: absolute; bottom: calc(100% + 12px); right: 0;
                background: white; border: 1px solid rgba(0,0,0,0.08);
                border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                min-width: 180px; overflow: hidden;
            ">
                ${LANGUAGES.map(lang => `
                    <button class="fd-lang-opt" data-code="${lang.code}" style="
                        display: flex; align-items: center; gap: 12px;
                        width: 100%; padding: 14px 20px; border: none;
                        background: ${lang.code === currentLocale ? '#f9fafb' : 'transparent'};
                        cursor: pointer; font-size: 14px; text-align: left;
                        color: #1f2937; font-weight: ${lang.code === currentLocale ? '700' : '400'};
                    ">
                        <span style="font-size:20px">${lang.flag}</span>
                        <span>${lang.label}</span>
                        ${lang.code === currentLocale ? '<span style="margin-left:auto; color:#10b981">✓</span>' : ''}
                    </button>
                `).join('')}
            </div>
            <style>
                .hidden { display: none !important; }
                #fd-lang-btn:hover { transform: scale(1.02); background: #fff; }
                .fd-lang-opt:hover { background: #f3f4f6 !important; }
            </style>
        `;

        document.body.appendChild(switcherContainer);

        const btn = document.getElementById('fd-lang-btn');
        const dropdown = document.getElementById('fd-lang-dropdown');

        btn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        };

        document.querySelectorAll('.fd-lang-opt').forEach(opt => {
            opt.onclick = () => {
                const newCode = opt.dataset.code;
                localStorage.setItem('faultdeck_lang', newCode);
                location.reload();
            };
        });

        document.addEventListener('click', () => dropdown.classList.add('hidden'));
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        translatePage();
        initSwitcher();
    });

})();
