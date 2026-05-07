(function() {
    'use strict';

    const translations = {
        en: {
            "nav": {
                "home": "Home",
                "agencies": "Agencies",
                "situations": "Situations",
                "identity": "Identity",
                "about": "About"
            },
            "hero": {
                "title": "The paperwork you need, <span>explained.</span>",
                "subtitle": "Stop searching for forms. Get plain English explanations, deadlines, and official download links in one place.",
                "placeholder": "Search for a form (e.g. W-9, I-485, LLC)",
                "cta": "Search Forms"
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
                "agencies": "Agencias",
                "situations": "Situaciones",
                "identity": "Identidad",
                "about": "Nosotros"
            },
            "hero": {
                "title": "El papeleo que necesitas, <span>explicado.</span>",
                "subtitle": "Deja de buscar formularios. Obtén explicaciones en lenguaje sencillo, plazos y enlaces oficiales de descarga en un solo lugar.",
                "placeholder": "Busca un formulario (ej. W-9, I-485, LLC)",
                "cta": "Buscar Formularios"
            },
            "footer": {
                "privacy": "Política de Privacidad",
                "terms": "Términos de Servicio",
                "disclosure": "Divulgación de Afiliados",
                "allRights": "Todos los derechos reservados."
            }
        },
        ru: {
            "nav": {
                "home": "Главная",
                "agencies": "Агентства",
                "situations": "Ситуации",
                "identity": "Личность",
                "about": "О нас"
            },
            "hero": {
                "title": "Нужные вам документы, <span>простыми словами.</span>",
                "subtitle": "Перестаньте искать формы. Получите объяснения на понятном языке, сроки и официальные ссылки для скачивания в одном месте.",
                "placeholder": "Поиск формы (например, W-9, I-485, LLC)",
                "cta": "Найти формы"
            },
            "footer": {
                "privacy": "Политика конфиденциальности",
                "terms": "Условия использования",
                "disclosure": "Раскрытие информации",
                "allRights": "Все права защищены."
            }
        },
        zh: {
            "nav": {
                "home": "首页",
                "agencies": "机构",
                "situations": "情境",
                "identity": "身份",
                "about": "关于"
            },
            "hero": {
                "title": "您需要的文书工作，<span>通俗易懂的解释。</span>",
                "subtitle": "停止搜索表格。在一处获取平实英语解释、截止日期和官方下载链接。",
                "placeholder": "搜索表格 (例如 W-9, I-485, LLC)",
                "cta": "搜索表格"
            },
            "footer": {
                "privacy": "隐私政策",
                "terms": "服务条款",
                "disclosure": "附属披露",
                "allRights": "版权所有。"
            }
        },
        pt: {
            "nav": {
                "home": "Início",
                "agencies": "Agências",
                "situations": "Situações",
                "identity": "Identidade",
                "about": "Sobre"
            },
            "hero": {
                "title": "A papelada que você precisa, <span>explicada.</span>",
                "subtitle": "Pare de procurar formulários. Obtenha explicações em linguagem simples, prazos e links oficiais de download em um só lugar.",
                "placeholder": "Pesquisar um formulário (ex: W-9, I-485, LLC)",
                "cta": "Pesquisar Formulários"
            },
            "footer": {
                "privacy": "Política de Privacidade",
                "terms": "Termos de Serviço",
                "disclosure": "Divulgação de Afiliados",
                "allRights": "Todos los direitos reservados."
            }
        }
    };

    const LANGUAGES = [
        { code: 'en', label: 'English',   flag: '🇺🇸' },
        { code: 'es', label: 'Español',   flag: '🇪🇸' },
        { code: 'ru', label: 'Русский',   flag: '🇷🇺' },
        { code: 'zh', label: '中文',      flag: '🇨🇳' },
        { code: 'pt', label: 'Português', flag: '🇧🇷' }
    ];

    let currentLocale = localStorage.getItem('whichforms_lang') || 'en';

    function translatePage() {
        const langData = translations[currentLocale] || translations.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const text = key.split('.').reduce((obj, k) => obj && obj[k], langData);
            if (text) {
                if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
                    el.placeholder = text;
                } else {
                    el.innerHTML = text; // Allow <span> tags
                }
            }
        });
        document.documentElement.lang = currentLocale;
    }

    function initSwitcher() {
        const switcherContainer = document.createElement('div');
        switcherContainer.id = 'wf-lang-switcher';
        Object.assign(switcherContainer.style, {
            position: 'fixed', bottom: '24px', right: '24px', zIndex: '9999',
            fontFamily: "'Inter', sans-serif"
        });

        const current = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0];

        switcherContainer.innerHTML = `
            <button id="wf-lang-btn" style="
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
            <div id="wf-lang-dropdown" class="hidden" style="
                position: absolute; bottom: calc(100% + 12px); right: 0;
                background: white; border: 1px solid rgba(0,0,0,0.08);
                border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                min-width: 180px; overflow: hidden;
            ">
                ${LANGUAGES.map(lang => `
                    <button class="wf-lang-opt" data-code="${lang.code}" style="
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
                #wf-lang-btn:hover { transform: scale(1.02); background: #fff; }
                .wf-lang-opt:hover { background: #f3f4f6 !important; }
            </style>
        `;

        document.body.appendChild(switcherContainer);
        const btn = document.getElementById('wf-lang-btn');
        const dropdown = document.getElementById('wf-lang-dropdown');
        btn.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); };
        document.querySelectorAll('.wf-lang-opt').forEach(opt => {
            opt.onclick = () => {
                localStorage.setItem('whichforms_lang', opt.dataset.code);
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
