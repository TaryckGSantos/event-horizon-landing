// ─── News Portal — Tela 4 (DARK_STEP) ────────────────────────────
// Ativado quando #fade-overlay recebe opacity >= 0.7 (DARK_STEP ativo).
// Usa MutationObserver para detectar mudanças sem tocar em CameraScroll.js.

const NEWS = [
    {
        tag: 'Galáxias',
        title: 'James Webb detecta atmosfera em exoplaneta a 120 anos-luz',
        date: '14 Jun 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'O Telescópio Espacial James Webb confirmou pela primeira vez a presença de uma atmosfera densa e rica em nitrogênio em um exoplaneta situado a aproximadamente 120 anos-luz da Terra, na constelação de Leão. A descoberta, publicada na revista Nature, representa um marco histórico na busca por mundos habitáveis fora do Sistema Solar.',
            'A equipe internacional liderada pela ESA utilizou espectroscopia de transmissão durante três trânsitos consecutivos, identificando assinaturas de vapor d\'água e dióxido de carbono. Segundo os pesquisadores, a composição atmosférica sugere um planeta rochoso com possível atividade vulcânica, abrindo novas questões sobre a origem da vida em sistemas planetários distintos.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Buraco negro supermassivo em colisão observado em tempo real',
        date: '13 Jun 2026',
        icon: 'radiate',
        readTime: 5,
        body: [
            'Astrônomos do Observatório Europeu do Sul (ESO) registraram pela primeira vez uma colisão entre dois buracos negros supermassivos em tempo real, a aproximadamente 900 milhões de anos-luz de distância. O evento, detectado pela rede de radiotelescópios VLBI, emite ondas gravitacionais detectáveis na faixa de nanohertz.',
            'A fusão em andamento produz jatos de plasma relativístico com energias sem precedente nos registros astronômicos. Os dados confirmam previsões do modelo de relatividade geral para sistemas binários compactos e fornecem uma janela única para entender a formação de buracos negros com massas bilhões de vezes superiores à do Sol.'
        ]
    },
    {
        tag: 'Missões',
        title: 'NASA confirma missão tripulada a Europa para 2031',
        date: '12 Jun 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'A NASA anunciou oficialmente a aprovação da missão Europa Pathfinder, que enviará uma tripulação de quatro astronautas à lua de Júpiter em 2031. A nave utilizará propulsão nuclear de pulso de baixa frequência para reduzir o tempo de viagem para 14 meses, contra os seis anos de uma missão química convencional.',
            'O objetivo central é perfurar a crosta de gelo de Europa e amostrar o oceano subsuperficial, onde condições propícias à vida microbiana foram inferidas por sondas anteriores. A missão inclui dois rovers autônomos com capacidade de mergulho a até 400 metros de profundidade sob o gelo.'
        ]
    },
    {
        tag: 'Cosmologia',
        title: 'Astrônomos mapeiam filamento cósmico de 1,4 bilhão de anos-luz',
        date: '11 Jun 2026',
        icon: 'rings',
        readTime: 6,
        body: [
            'Um consórcio de 23 observatórios internacionais publicou o mapeamento completo do filamento cósmico denominado Saraswati II, estendendo-se por 1,4 bilhão de anos-luz — a maior estrutura já cartografada no universo observável. O trabalho envolveu dados de mais de 180.000 galáxias coletados ao longo de sete anos.',
            'A estrutura revela padrões de distribuição de matéria escura consistentes com simulações do modelo ΛCDM, porém com uma densidade central 40% maior do que o esperado. Esse excesso, denominado pelos autores de anomalia de Saraswati, pode requerer ajustes na constante cosmológica ou indicar a presença de partículas de matéria escura ainda não catalogadas.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Pulsar mais rápido já registrado desafia modelos teóricos',
        date: '10 Jun 2026',
        icon: 'radiate',
        readTime: 4,
        body: [
            'O radiotelescópio FAST, na China, identificou um pulsar girando a 1.122 rotações por segundo — 18% acima do recorde anterior e próximo ao limite teórico de ruptura para uma estrela de nêutrons convencional. O objeto, catalogado como PSR J0437-4715B, situa-se a 3.200 anos-luz na direção da constelação de Pícis.',
            'A frequência de rotação extrema sugere que o objeto pode ser uma anã branca ultracompacta em vez de uma estrela de nêutrons, o que contradiria décadas de modelagem de pulsares milissegundos. A equipe propõe observações de raios-X para determinar o raio e a massa do objeto com precisão suficiente para distinguir entre as duas hipóteses.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Cassini revela novos dados sobre o interior de Saturno',
        date: '09 Jun 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'Análises recentes dos dados finais coletados pela sonda Cassini durante sua manobra de mergulho em 2017 revelam que Saturno possui um núcleo difuso de rocha e gelo com cerca de 55 massas terrestres, distribuído ao longo de 60% do raio do planeta. O resultado, obtido via sismologia planetária, contradiz modelos que previam um núcleo sólido compacto.',
            'As oscilações detectadas nos anéis de Saturno funcionaram como um sismógrafo de alta precisão, permitindo inferir a estrutura interna sem acesso direto. A descoberta implica que a diferenciação entre núcleo e manto nos gigantes gasosos é um processo muito mais gradual do que assumido pelos modelos de formação planetária clássicos.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Telescópio chileno encontra planeta com água líquida confirmada',
        date: '08 Jun 2026',
        icon: 'rings',
        readTime: 5,
        body: [
            'O Observatório La Silla, no Chile, confirmou a presença de água líquida estável na superfície de Kepler-442c, um exoplaneta rochoso de 1,3 massas terrestres orbitando uma estrela K a 1.200 anos-luz de distância. A confirmação veio por meio de análise espectroscópica combinada com simulações climáticas de alta resolução.',
            'O planeta orbita na zona habitável conservadora de sua estrela e possui uma atmosfera com pressão superficial estimada em 1,2 atm, composta majoritariamente por nitrogênio e oxigênio molecular. Essa composição é a mais próxima da terrestre já detectada em um exoplaneta, elevando Kepler-442c ao topo da lista de candidatos prioritários para observação pelo ELT.'
        ]
    }
]

const ICONS = {
    rings: `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="8" stroke="rgba(124,58,237,0.8)" stroke-width="1.5"/>
        <ellipse cx="26" cy="26" rx="18" ry="7" stroke="rgba(124,58,237,0.5)" stroke-width="1"/>
        <ellipse cx="26" cy="26" rx="24" ry="10" stroke="rgba(124,58,237,0.3)" stroke-width="1"/>
    </svg>`,
    radiate: `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="5" fill="rgba(124,58,237,0.8)"/>
        <line x1="26" y1="4"  x2="26" y2="14" stroke="rgba(124,58,237,0.6)" stroke-width="1.5"/>
        <line x1="26" y1="38" x2="26" y2="48" stroke="rgba(124,58,237,0.6)" stroke-width="1.5"/>
        <line x1="4"  y1="26" x2="14" y2="26" stroke="rgba(124,58,237,0.6)" stroke-width="1.5"/>
        <line x1="38" y1="26" x2="48" y2="26" stroke="rgba(124,58,237,0.6)" stroke-width="1.5"/>
        <line x1="10" y1="10" x2="17" y2="17" stroke="rgba(124,58,237,0.4)" stroke-width="1.5"/>
        <line x1="35" y1="35" x2="42" y2="42" stroke="rgba(124,58,237,0.4)" stroke-width="1.5"/>
        <line x1="42" y1="10" x2="35" y2="17" stroke="rgba(124,58,237,0.4)" stroke-width="1.5"/>
        <line x1="17" y1="35" x2="10" y2="42" stroke="rgba(124,58,237,0.4)" stroke-width="1.5"/>
    </svg>`,
    orbit: `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="4" fill="rgba(124,58,237,0.9)"/>
        <circle cx="26" cy="26" r="16" stroke="rgba(124,58,237,0.4)" stroke-width="1" stroke-dasharray="3 4"/>
        <circle cx="42" cy="26" r="3" fill="rgba(200,170,255,0.7)"/>
    </svg>`
}

const NAV_ITEMS = ['Início', 'Últimas', 'Galáxias', 'Sistema Solar', 'Exoplanetas', 'Missões', 'Fenômenos', 'Sobre']

// ─── Estado ──────────────────────────────────────────────────────

let isPortalVisible = false
let showTimer = null
let hideTimer = null

// Timers das sequências de animação do modal (para cancelamento)
let openModalTimers = []

// ─── DOM ─────────────────────────────────────────────────────────

function buildPortal() {
    const portal = document.createElement('div')
    portal.id = 'news-portal'
    portal.setAttribute('aria-hidden', 'true')

    portal.innerHTML = `
        ${buildNav()}
        ${buildHamburger()}
        ${buildDrawer()}
        ${buildWidgets()}
        ${buildNewsList()}
        ${buildModal()}
    `

    document.body.appendChild(portal)

    attachNavEvents()
    attachWidgetCounters()
    attachNewsEvents()
    attachModalEvents()
    attachHamburgerEvents()
    attachDrawerEvents()
}

// --item-index alimenta animation-delay escalonado via CSS calc()
function buildNav() {
    const items = NAV_ITEMS.map((name, i) =>
        `<li class="${i === 0 ? 'active' : ''}" style="--item-index: ${i}"><a href="#" data-nav="${name}">${name}</a></li>`
    ).join('')
    return `<nav id="np-nav"><ul>${items}</ul></nav>`
}

function buildHamburger() {
    return `<button id="np-hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
    </button>`
}

function buildDrawer() {
    const items = NAV_ITEMS.map((name, i) =>
        `<li class="${i === 0 ? 'active' : ''}"><a href="#" data-nav-drawer="${name}">${name}</a></li>`
    ).join('')
    return `<div id="np-drawer">
        <div id="np-drawer-bg"></div>
        <div id="np-drawer-panel"><ul>${items}</ul></div>
    </div>`
}

function buildWidgets() {
    return `<div id="np-widgets">
        <div class="np-widget">
            <span class="np-widget-label">Objetos Catalogados</span>
            <span class="np-widget-value" id="np-w-objects">2.847.000</span>
        </div>
        <div class="np-widget">
            <span class="np-widget-label">Missões Ativas</span>
            <span class="np-widget-value">47</span>
        </div>
        <div class="np-widget">
            <span class="np-widget-label">Próximo Evento</span>
            <span class="np-widget-value" id="np-w-countdown">--</span>
            <span class="np-widget-sub">Eclipse Solar</span>
        </div>
        <div class="np-widget">
            <span class="np-widget-label">Temperatura Média</span>
            <span class="np-widget-value">-270.45 C</span>
        </div>
    </div>`
}

// Saturno stroke-only, 20×20px, cor #7C3AED. IDs únicos por item evitam conflito global de máscara.
function saturnSvg(i) {
    const mid = `np-sm-${i}`
    return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<defs><mask id="${mid}">` +
        `<rect width="20" height="20" fill="white"/>` +
        `<circle cx="10" cy="10" r="4.8" fill="black"/>` +
        `</mask></defs>` +
        `<ellipse cx="10" cy="10" rx="9" ry="3" stroke="rgba(124,58,237,0.45)" stroke-width="1.2" mask="url(#${mid})"/>` +
        `<circle cx="10" cy="10" r="4.5" stroke="rgba(124,58,237,0.85)" stroke-width="1.2"/>` +
        `<path d="M 1 11.8 Q 10 14.5 19 11.8" stroke="rgba(124,58,237,0.85)" stroke-width="1.2" fill="none" stroke-linecap="round"/>` +
        `</svg>`
}

// --news-index alimenta animation-delay escalonado via CSS calc()
function buildNewsList() {
    const items = NEWS.map((n, i) => `
        <li class="np-news-item" data-index="${i}" style="--news-index: ${i}">
            <span class="np-news-glow" aria-hidden="true"></span>

            <div class="np-news-item-body">
                <span class="np-news-tag">${n.tag}</span>
                <p class="np-news-title">${n.title}</p>
                <span class="np-news-date">${n.date}</span>
            </div>
            <span class="np-news-arrow">${saturnSvg(i)}</span>
        </li>
    `).join('')
    return `<section id="np-news"><ul class="np-news-list">${items}</ul></section>`
}

function buildModal() {
    return `<div id="np-modal" role="dialog" aria-modal="true">
        <div id="np-modal-card">
            <button id="np-modal-close" aria-label="Fechar">&times;</button>
            <div id="np-modal-img"></div>
            <div id="np-modal-sep"></div>
            <span id="np-modal-tag"></span>
            <h2 id="np-modal-title"></h2>
            <p id="np-modal-meta"></p>
            <div id="np-modal-body"></div>
        </div>
    </div>`
}

// ─── Animação 4: navegação com flash e indicador animado ──────────

function attachNavEvents() {
    document.querySelectorAll('#np-nav a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault()
            const li = a.closest('li')

            // Flash de fundo no item clicado
            li.classList.remove('nav-flash')
            void li.offsetWidth // força reflow para reiniciar a animação
            li.classList.add('nav-flash')
            li.addEventListener('animationend', () => li.classList.remove('nav-flash'), { once: true })

            // Troca o item ativo (o ::before faz scaleY com transition)
            document.querySelectorAll('#np-nav li').forEach(el => el.classList.remove('active'))
            li.classList.add('active')
        })
    })
}

// ─── Hamburguer e drawer mobile ──────────────────────────────────

function attachHamburgerEvents() {
    document.getElementById('np-hamburger').addEventListener('click', () => {
        document.getElementById('np-drawer').classList.add('open')
    })
}

function attachDrawerEvents() {
    document.getElementById('np-drawer-bg').addEventListener('click', () => {
        document.getElementById('np-drawer').classList.remove('open')
    })

    document.querySelectorAll('#np-drawer-panel a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault()
            document.querySelectorAll('#np-drawer-panel li').forEach(li => li.classList.remove('active'))
            a.closest('li').classList.add('active')
            document.getElementById('np-drawer').classList.remove('open')
        })
    })
}

// ─── Widget: contador de objetos ──────────────────────────────────

function attachWidgetCounters() {
    const el = document.getElementById('np-w-objects')
    if (!el) return

    const start = 2847000
    const end   = 2847391
    const dur   = 8000
    let startTime = null

    function tick(ts) {
        if (!startTime) startTime = ts
        const p = Math.min((ts - startTime) / dur, 1)
        const val = Math.floor(start + (end - start) * p)
        el.textContent = val.toLocaleString('pt-BR')
        if (p < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
    startCountdown()
}

// ─── Widget: countdown Eclipse Solar ─────────────────────────────

function startCountdown() {
    const el = document.getElementById('np-w-countdown')
    if (!el) return

    const target = new Date('2026-08-12T17:00:00Z')

    function updateCountdown() {
        const diff = target - Date.now()
        if (diff <= 0) { el.textContent = 'Agora'; return }
        const d = Math.floor(diff / 86400000)
        const h = Math.floor((diff % 86400000) / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        el.textContent = `${String(d).padStart(2,'0')}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`
    }

    updateCountdown()
    setInterval(updateCountdown, 60000)
}

// ─── Notícias: click → modal ──────────────────────────────────────

function attachNewsEvents() {
    document.getElementById('np-news').addEventListener('click', e => {
        const item = e.target.closest('.np-news-item')
        if (!item) return
        const idx = parseInt(item.dataset.index, 10)
        openModal(NEWS[idx])
    })
}

// ─── Animações 2 e 3: abertura e fechamento do modal ─────────────

function openModal(news) {
    const modal = document.getElementById('np-modal')
    const card  = document.getElementById('np-modal-card')
    const img   = document.getElementById('np-modal-img')
    const body  = document.getElementById('np-modal-body')

    // Cancela timers de abertura pendentes (re-abertura rápida)
    openModalTimers.forEach(clearTimeout)
    openModalTimers = []

    // Reseta estado do card para a próxima abertura
    card.classList.remove('np-card-entering', 'np-card-exiting')
    img.classList.remove('np-img-entering')

    // Preenche conteúdo
    document.getElementById('np-modal-tag').textContent   = news.tag
    document.getElementById('np-modal-title').textContent = news.title
    document.getElementById('np-modal-meta').textContent  = `${news.date}  -  ${news.readTime} min de leitura`
    img.style.background = 'linear-gradient(135deg, #1a0533 0%, #0d1f4a 100%)'
    img.innerHTML = ICONS[news.icon] || ''

    // Parágrafos com delay escalonado via CSS custom property
    // Para 1: 60ms (card start) + 220ms = 280ms
    // Para 2: 280ms + 60ms = 340ms
    body.innerHTML = news.body.map((p, i) =>
        `<p style="--para-delay: ${280 + i * 60}ms">${p}</p>`
    ).join('')

    // t=0: abre backdrop (fade 220ms via CSS transition)
    modal.classList.add('open')
    modal.setAttribute('aria-hidden', 'false')

    // t=60ms: card entra (380ms, easing spring)
    openModalTimers.push(setTimeout(() => {
        card.classList.add('np-card-entering')
    }, 60))

    // t=240ms: imagem faz fade in (200ms)
    openModalTimers.push(setTimeout(() => {
        img.classList.add('np-img-entering')
    }, 240))
}

function closeModal() {
    const modal = document.getElementById('np-modal')
    const card  = document.getElementById('np-modal-card')

    if (!modal.classList.contains('open')) return

    // Cancela timers de abertura pendentes
    openModalTimers.forEach(clearTimeout)
    openModalTimers = []

    // Bloqueia interação imediatamente
    modal.style.pointerEvents = 'none'

    // t=0: card faz exit animation (220ms ease-in)
    card.classList.remove('np-card-entering')
    card.classList.add('np-card-exiting')

    // t=220ms: remove .open — backdrop faz fade out via CSS transition (220ms)
    setTimeout(() => {
        modal.classList.remove('open')
        modal.setAttribute('aria-hidden', 'true')
        modal.style.pointerEvents = '' // devolve controle ao CSS (base: pointer-events: none)

        // t=220+250ms: limpa estado do card para próxima abertura
        setTimeout(() => {
            card.classList.remove('np-card-exiting')
            card.classList.remove('np-card-entering')
        }, 250)
    }, 220)
}

function attachModalEvents() {
    const modal = document.getElementById('np-modal')

    document.getElementById('np-modal-close').addEventListener('click', closeModal)

    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal()
    })

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal()
    })
}

// ─── Mostrar / ocultar portal ─────────────────────────────────────

function resetAnimation(el) {
    el.style.animationName = 'none'
    void el.offsetWidth
    el.style.animationName = ''
}

function showPortal() {
    const portal = document.getElementById('news-portal')
    if (!portal) return
    isPortalVisible = true

    // Reinicia animação dos widgets (animação está hardcoded no .np-widget, não no is-visible)
    document.querySelectorAll('.np-widget').forEach(resetAnimation)

    portal.classList.add('is-visible')
    portal.setAttribute('aria-hidden', 'false')
}

function hidePortal() {
    const portal = document.getElementById('news-portal')
    if (!portal) return
    isPortalVisible = false
    closeModal()
    portal.classList.remove('is-visible')
    portal.setAttribute('aria-hidden', 'true')
}

// ─── MutationObserver no #fade-overlay ────────────────────────────

function watchFadeOverlay() {
    const overlay = document.getElementById('fade-overlay')
    if (!overlay) return

    const observer = new MutationObserver(() => {
        const opacity = parseFloat(overlay.style.opacity) || 0

        if (opacity >= 0.7) {
            // Tela 4 ativa — aguarda o fade terminar (~550ms)
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
            if (!isPortalVisible && !showTimer) {
                showTimer = setTimeout(() => {
                    showTimer = null
                    const currentOpacity = parseFloat(document.getElementById('fade-overlay').style.opacity) || 0
                    if (currentOpacity >= 0.7) showPortal()
                }, 550)
            }
        } else {
            // Saiu da Tela 4 — cancela timer pendente e esconde
            if (showTimer) { clearTimeout(showTimer); showTimer = null }
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
            if (isPortalVisible) hidePortal()
        }
    })

    observer.observe(overlay, { attributes: true, attributeFilter: ['style'] })
}

// ─── Init ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    buildPortal()
    watchFadeOverlay()
})
