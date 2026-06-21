// ─── APOD — Tela 3.2 (Astronomy Picture of the Day) ────────────────────────
// Ativado via evento cameraPositionChange com step === 4.
// A chamada à API ocorre uma vez, na primeira vez que a tela entra em foco.

const APOD_STEP = 4
const API_KEY   = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const APOD_URL  = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`

// Duração exata da transição de #apod-bg (transition: opacity 0.55s ease)
const BG_FADE_MS = 550

const MONTHS_PT = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
]

function formatDate(iso) {
    try {
        const [y, m, d] = iso.split('-').map(Number)
        return `${d} de ${MONTHS_PT[m - 1]} de ${y}`
    } catch (_) {
        return iso
    }
}

// ─── State ────────────────────────────────────────────────────────────────────
let currentHdurl  = ''
let currentTitle  = ''

// ─── DOM factory ─────────────────────────────────────────────────────────────

const TELESCOPE_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="2.5" stroke="rgba(167,139,250,0.7)" stroke-width="1.2"/>
    <circle cx="7" cy="7" r="5.5" stroke="rgba(167,139,250,0.35)" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="7" y1="1" x2="7" y2="0" stroke="rgba(167,139,250,0.55)" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="12.5" y1="7" x2="13.5" y2="7" stroke="rgba(167,139,250,0.55)" stroke-width="1.2" stroke-linecap="round"/>
</svg>`

const PLAY_ICON = `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="26" r="24" stroke="rgba(167,139,250,0.4)" stroke-width="1.5"/>
    <polygon points="22,18 36,26 22,34" fill="rgba(167,139,250,0.85)"/>
</svg>`

// SVG × minimalista — peso visual médio, sem artefatos de renderização de texto
const CLOSE_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1.5" y1="1.5" x2="12.5" y2="12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="12.5" y1="1.5" x2="1.5" y2="12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>`

function buildOverlay() {
    // ── Background escuro ─────────────────────────────────────────────────────
    const bg = document.createElement('div')
    bg.id = 'apod-bg'
    document.body.appendChild(bg)

    // ── Card overlay ──────────────────────────────────────────────────────────
    const el = document.createElement('div')
    el.id = 'apod-overlay'
    el.setAttribute('aria-hidden', 'true')
    el.innerHTML = `
        <div id="apod-badge">${TELESCOPE_ICON} NASA · Astronomy Picture of the Day</div>
        <div id="apod-card">
            <div id="apod-image-wrap"></div>
            <div id="apod-info">
                <div id="apod-meta">
                    <span id="apod-date"></span>
                    <span id="apod-copyright"></span>
                </div>
                <h2 id="apod-title"></h2>
                <div id="apod-explanation"></div>
            </div>
        </div>
    `
    document.body.appendChild(el)

    // ── Lightbox ──────────────────────────────────────────────────────────────
    const lb = document.createElement('div')
    lb.id = 'apod-lightbox'
    lb.setAttribute('role', 'dialog')
    lb.setAttribute('aria-modal', 'true')
    lb.setAttribute('aria-label', 'Imagem em tela cheia')
    lb.innerHTML = `
        <button id="apod-lb-close" aria-label="Fechar">${CLOSE_ICON}</button>
        <img id="apod-lightbox-img" alt="" />
    `
    document.body.appendChild(lb)

    // ── Fechar lightbox — três mecanismos (Correção 1) ────────────────────────
    document.getElementById('apod-lb-close').addEventListener('click', (e) => {
        e.stopPropagation()
        closeLightbox()
    })

    lb.addEventListener('click', (e) => {
        // Fecha ao clicar no backdrop (área fora da imagem)
        if (e.target === lb || e.target.id === 'apod-lightbox') closeLightbox()
    })

    document.getElementById('apod-lightbox-img').addEventListener('click', (e) => {
        // Clique na imagem não fecha o lightbox
        e.stopPropagation()
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox()
    })

    // Impede que scroll dentro do lightbox propague para CameraScroll
    lb.addEventListener('wheel', (e) => e.stopPropagation(), { passive: false })
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function openLightbox() {
    if (!currentHdurl) return
    const lb  = document.getElementById('apod-lightbox')
    const img = document.getElementById('apod-lightbox-img')
    if (!lb || !img) return

    img.src = currentHdurl
    img.alt = currentTitle

    // Reset sem transição, depois anima entrada
    lb.style.transition = 'none'
    lb.style.opacity    = '0'
    lb.style.transform  = 'scale(0.95)'
    lb.style.pointerEvents = 'none'
    void lb.offsetHeight  // força reflow

    lb.classList.add('is-open')
    lb.style.transition    = 'opacity 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1)'
    lb.style.opacity       = '1'
    lb.style.transform     = 'scale(1)'
    lb.style.pointerEvents = 'all'
}

function closeLightbox() {
    const lb = document.getElementById('apod-lightbox')
    if (!lb || !lb.classList.contains('is-open')) return

    // Bloqueia novos cliques imediatamente
    lb.style.pointerEvents = 'none'

    // Animação de saída: 200ms ease-in (Correção 1)
    lb.style.transition = 'opacity 0.2s ease-in, transform 0.2s ease-in'
    lb.style.opacity    = '0'
    lb.style.transform  = 'scale(0.95)'

    // Aguarda a animação terminar antes de limpar estado
    const cleanup = () => {
        lb.classList.remove('is-open')
        lb.style.transition    = ''
        lb.style.opacity       = ''
        lb.style.transform     = ''
        lb.style.pointerEvents = ''
    }

    lb.addEventListener('transitionend', cleanup, { once: true })
    setTimeout(cleanup, 220)  // fallback caso transitionend não dispare
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function showSkeleton() {
    const wrap = document.getElementById('apod-image-wrap')
    if (!wrap) return

    wrap.innerHTML = ''
    wrap.classList.add('apod-skel')
    wrap.classList.remove('apod-has-image')

    document.getElementById('apod-date').textContent      = ''
    document.getElementById('apod-copyright').textContent = ''
    document.getElementById('apod-title').textContent     = ''
    document.getElementById('apod-explanation').innerHTML = `
        <div class="apod-skel-text">
            <div class="apod-skel apod-skel-title"></div>
            <div class="apod-skel apod-skel-line"></div>
            <div class="apod-skel apod-skel-line"></div>
            <div class="apod-skel apod-skel-line"></div>
            <div class="apod-skel apod-skel-line"></div>
            <div class="apod-skel apod-skel-line"></div>
        </div>
    `
    document.getElementById('apod-overlay').classList.add('apod-loading')
}

// ─── Render ──────────────────────────────────────────────────────────────────

function renderApod(data) {
    const overlay = document.getElementById('apod-overlay')
    const wrap    = document.getElementById('apod-image-wrap')
    if (!overlay || !wrap) return

    wrap.classList.remove('apod-skel')
    overlay.classList.remove('apod-loading')

    document.getElementById('apod-date').textContent = formatDate(data.date)

    const copy = (data.copyright || '').replace(/\n/g, ' ').trim()
    document.getElementById('apod-copyright').textContent = copy ? `© ${copy}` : ''

    document.getElementById('apod-title').textContent       = data.title || ''
    document.getElementById('apod-explanation').textContent = data.explanation || ''

    currentTitle = data.title || ''

    if (data.media_type === 'video') {
        currentHdurl = ''
        wrap.classList.remove('apod-has-image')
        const href = data.hdurl || data.url || '#'
        wrap.innerHTML = `<a id="apod-video-btn" href="${href}" target="_blank" rel="noopener noreferrer">
            ${PLAY_ICON}
            <span>Assistir no YouTube</span>
        </a>`
    } else {
        const src = data.hdurl || data.url || ''
        currentHdurl = src
        wrap.classList.add('apod-has-image')
        wrap.innerHTML = `<img id="apod-img" src="${src}" alt="${data.title || 'APOD'}" class="loading" />`

        const img = wrap.querySelector('#apod-img')
        if (img) {
            img.addEventListener('load',  () => img.classList.remove('loading'), { once: true })
            img.addEventListener('error', () => renderError('img-error'), { once: true })
        }

        wrap.addEventListener('click', openLightbox)
    }
}

function renderError(origin) {
    const wrap    = document.getElementById('apod-image-wrap')
    const overlay = document.getElementById('apod-overlay')
    if (!wrap || !overlay) return

    currentHdurl = ''
    wrap.classList.remove('apod-skel', 'apod-has-image')
    overlay.classList.remove('apod-loading')

    wrap.innerHTML = `<div style="
        width:100%; height:100%;
        background: radial-gradient(ellipse at 50% 50%, rgba(50,15,100,0.6) 0%, rgba(3,1,12,0.9) 70%);
        display:flex; align-items:center; justify-content:center;
    ">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="10" stroke="rgba(124,58,237,0.4)" stroke-width="1.5"/>
            <circle cx="32" cy="32" r="22" stroke="rgba(124,58,237,0.2)" stroke-width="1" stroke-dasharray="3 4"/>
            <circle cx="32" cy="32" r="30" stroke="rgba(124,58,237,0.1)" stroke-width="1"/>
        </svg>
    </div>`

    document.getElementById('apod-date').textContent      = ''
    document.getElementById('apod-copyright').textContent = ''
    document.getElementById('apod-title').textContent     = 'Cosmos em Pausa'
    document.getElementById('apod-explanation').textContent =
        'O observatório está temporariamente offline. Volte em breve.'
}

// ─── Fetch ───────────────────────────────────────────────────────────────────

let fetchDone = false

async function fetchApod() {
    if (fetchDone) return
    fetchDone = true
    try {
        const res = await fetch(APOD_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        renderApod(data)
    } catch (_) {
        renderError('fetch-catch')
    }
}

// ─── Show / hide ──────────────────────────────────────────────────────────────

let isApodVisible  = false
let wheelHandler   = null
let cardTriggerTimer = null

function showApod() {
    const overlay = document.getElementById('apod-overlay')
    const bg      = document.getElementById('apod-bg')
    if (!overlay || isApodVisible) return
    isApodVisible = true

    overlay.setAttribute('aria-hidden', 'false')

    // Correção 4 — card começa invisível e aparece após o fundo terminar de escurecer
    overlay.style.transition   = 'none'
    overlay.style.opacity      = '0'
    overlay.style.transform    = 'translateY(16px)'
    overlay.style.pointerEvents = 'none'

    // #apod-bg é transparente — usado apenas para temporizar a entrada do card
    // via transitionend. O escurecimento real é feito pelo #fade-overlay (CameraScroll).
    if (bg) bg.classList.add('is-visible')

    // Registra wheel handler antes de habilitar pointer-events no card
    const info = document.getElementById('apod-info')
    if (info) {
        wheelHandler = e => {
            e.stopPropagation()
            e.preventDefault()
            info.scrollTop += e.deltaY
        }
        info.addEventListener('wheel', wheelHandler, { passive: false })
    }

    // Dispara o card após o fundo terminar (transitionend ou fallback por setTimeout)
    let cardTriggered = false
    const triggerCard = () => {
        if (cardTriggered) return
        cardTriggered = true
        clearTimeout(cardTriggerTimer)
        overlay.style.transition    = 'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)'
        overlay.style.opacity       = '1'
        overlay.style.transform     = 'translateY(0)'
        overlay.style.pointerEvents = 'all'
    }

    if (bg) bg.addEventListener('transitionend', triggerCard, { once: true })
    cardTriggerTimer = setTimeout(triggerCard, BG_FADE_MS + 30)

    fetchApod()
}

function hideApod() {
    const overlay = document.getElementById('apod-overlay')
    const bg      = document.getElementById('apod-bg')
    if (!overlay || !isApodVisible) return
    isApodVisible = false

    clearTimeout(cardTriggerTimer)

    if (bg) bg.classList.remove('is-visible')
    overlay.setAttribute('aria-hidden', 'true')
    // Inline styles foram já zerados pelo apodExit handler; limpa o restante
    overlay.style.pointerEvents = ''
    overlay.style.transition    = ''
    overlay.style.opacity       = ''
    overlay.style.transform     = ''

    const info = document.getElementById('apod-info')
    if (info && wheelHandler) {
        info.removeEventListener('wheel', wheelHandler)
        wheelHandler = null
    }
}

// ─── Events ───────────────────────────────────────────────────────────────────

document.addEventListener('cameraPositionChange', (e) => {
    const { step } = e.detail
    if (step === APOD_STEP) {
        showApod()
    } else {
        if (isApodVisible) hideApod()
    }
})

document.addEventListener('apodExit', () => {
    // O #fade-overlay (gerenciado por CameraScroll) é a única fonte de
    // escurecimento. Este handler só anima a saída do card de conteúdo —
    // nunca toca em opacidade de fundo/overlay.
    if (!isApodVisible) {
        document.dispatchEvent(new CustomEvent('apodExitDone'))
        return
    }

    closeLightbox()
    clearTimeout(cardTriggerTimer)

    const overlay = document.getElementById('apod-overlay')
    const bg      = document.getElementById('apod-bg')

    if (overlay) {
        overlay.style.transition    = 'opacity 0.28s ease-in, transform 0.28s ease-in'
        overlay.style.opacity       = '0'
        overlay.style.transform     = 'translateY(-10px)'
        overlay.style.pointerEvents = 'none'
    }

    if (bg) {
        bg.style.transition = 'opacity 0.28s ease-in'
        bg.style.opacity    = '0'
    }

    setTimeout(() => {
        hideApod()
        if (bg) {
            bg.style.transition = ''
            bg.style.opacity    = ''
        }
        document.dispatchEvent(new CustomEvent('apodExitDone'))
    }, 300)
})

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    buildOverlay()
    showSkeleton()
})
