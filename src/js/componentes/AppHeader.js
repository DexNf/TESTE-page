import { INDEX, GUIA, INSTI, EMPRESAS, BOLSAS, PSICOLOGIA, SAUDE, LOGO } from "../urls.js"; 

class AppHeader extends HTMLElement {
    constructor() {
        super();

        this.logoPath = LOGO;
        this.indexPath = INDEX;

        this.navLinks = [
            { href: INDEX, key: 'sobre' },
            { href: GUIA, key: 'guia' },
            { href: INSTI, key: 'instituicoes' },
            { href: EMPRESAS, key: 'empresas' },
            { href: BOLSAS, key: 'bolsas' },
            { href: PSICOLOGIA, key: 'psicologia' },
            { href: SAUDE, key: 'saude' }
        ];

        this.languageOptions = [
            { value: 'pt', text: 'Português' },
            { value: 'en', text: 'English' },
            { value: 'es', text: 'Español' },
            { value: 'fr', text: 'Français' },
            { value: 'ar', text: 'العربية' },
            { value: 'de', text: 'Deutsch' },
            { value: 'it', text: 'Italiano' },
            { value: 'ru', text: 'Русский' },
            { value: 'zh', text: '中文' },
            { value: 'ja', text: '日本語' }
        ];
    }

    connectedCallback() {
        this.render();

        // Atualiza a tradução dos textos do header depois da tradução aplicada na página
        document.addEventListener('traducaoAplicada', (event) => {
            this.atualizarTextos(event.detail);
        });

        // Atualiza logo após carregar, com a língua salva (caso já esteja definida)
        const linguaAtual = localStorage.getItem('lingua') || 'pt';
        fetch(`https://abi-frontend-mu.vercel.app/src/json/lang/${linguaAtual}.json`)
            .then(res => res.json())
            .then(traducaoJson => this.atualizarTextos(traducaoJson))
            .catch(() => { /* trata erro se quiser */ });
    }

    atualizarTextos(traducaoJson) {
        // Atualiza os textos dos links de navegação
        this.navLinks.forEach(link => {
            const el = this.querySelector(`[data-key="${link.key}"]`);
            if (el && traducaoJson[link.key]) {
                el.innerHTML = traducaoJson[link.key];
            }
        });

        // Atualiza os botões da área do usuário
        const btnLogin = this.querySelector('#btnLogin');
        if (btnLogin && traducaoJson['loginTitle']) {
            btnLogin.innerHTML = traducaoJson['loginTitle'];
        }

        const btnLogout = this.querySelector('#btnLogout');
        if (btnLogout && traducaoJson['deslogarTitle']) {
            btnLogout.innerHTML = traducaoJson['deslogarTitle'];
        }
    }

    render() {
        const navLinksHtml = this.navLinks.map(link => `
            <li class="nav-item">
                <a class="nav-link" href="${link.href}" data-key="${link.key}"></a>
            </li>
        `).join('');

        const langOptionsHtml = this.languageOptions.map(lang => `
            <option value="${lang.value}">${lang.text}</option>
        `).join('');

        this.innerHTML = `
            <header class="navbar navbar-expand-lg navbar-dark fixed-top app-header-custom">
                <div class="container-fluid">
                    <a class="navbar-brand logo-container-custom" href="${this.indexPath}" aria-label="Logo do Projeto AIB">
                        <img src="${this.logoPath}" alt="Logo AIB" class="app-header-logo-img" />
                        <h1 class="app-header-title">ABI</h1>
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appHeaderNavbarContent" aria-controls="appHeaderNavbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="appHeaderNavbarContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="appHeaderNavLinksContainer">
                            ${navLinksHtml}
                        </ul>
                        <div class="d-flex align-items-center gap-3 ms-lg-auto">
                            <div class="language-selector-wrapper d-flex align-items-center gap-2">
                                <img src="https://flagcdn.com/w40/br.png" alt="Bandeira do idioma" id="bandeira" class="app-header-flag-img" />
                                <select class='form-select form-select-sm' id="select-lingua" name="select-lingua" aria-label="Selecionar idioma">
                                    ${langOptionsHtml}
                                </select>
                            </div>
                            <div class="user-area position-relative">
                                <svg class="user-icon" id="user-icon" role="button" aria-label="Área do usuário" tabindex="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                                <div class="user-dropdown position-absolute bg-white rounded shadow-sm py-1" id="user-dropdown" role="menu" aria-hidden="true">
                                    <button class="dropdown-item" data-key="loginTitle" id="btnLogin" role="menuitem"></button>
                                    <button class="dropdown-item" id="btnLogout" role="menuitem" style="display:none;" data-key="deslogarTitle"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <style>
                /* seu CSS aqui sem mudanças */
            </style>
        `;
    }
}

customElements.define('app-header', AppHeader);
