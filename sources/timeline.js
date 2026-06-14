// ─── Tela 2.1 — Linha do Tempo Cósmica ───────────────────────────────────────
// Canvas 2D para linhas + orbes viajantes. Partículas em DOM flutuante.
// window.__timelineCapturing bloqueia CameraScroll durante o scrub interno.

window.__timelineCapturing = false

// ── Dados dos 5 momentos ─────────────────────────────────────────────────────

const DATA = [
    {
        label: 'Big Bang',
        time:  't = 0 · 13,8 bilhões de anos atrás',
        text:  'O universo nasce de uma singularidade infinitamente densa. Em frações de segundo, toda a matéria e energia que existirá um dia é criada.',
        gradient: 'linear-gradient(148deg, rgba(255,128,28,0.46) 0%, rgba(198,48,10,0.30) 54%, rgba(76,5,48,0.20) 100%)',
        iconColor: 'rgba(255,192,80,0.96)',
        icon: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="3.8" fill="currentColor"/>
            <line x1="19" y1="3"  x2="19" y2="9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="19" y1="28.5" x2="19" y2="35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="3"  y1="19" x2="9.5"  y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="28.5" y1="19" x2="35" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="7.8"  y1="7.8"  x2="12.5" y2="12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="25.5" y1="25.5" x2="30.2" y2="30.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="30.2" y1="7.8"  x2="25.5" y2="12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="12.5" y1="25.5" x2="7.8"  y2="30.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`
    },
    {
        label: 'Primeira Luz',
        time:  '200 milhões de anos após o Big Bang',
        text:  'As primeiras estrelas rompem a escuridão cósmica. Gigantes azuis e instáveis, centenas de vezes mais massivas que o Sol, vivem e morrem em explosões colossais.',
        gradient: 'linear-gradient(148deg, rgba(95,158,255,0.42) 0%, rgba(58,78,202,0.26) 54%, rgba(18,8,78,0.20) 100%)',
        iconColor: 'rgba(175,210,255,0.96)',
        icon: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="19,3 23,14 35,14 25.5,21.5 29,32 19,25 9,32 12.5,21.5 3,14 15,14"
                stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
            <circle cx="19" cy="19" r="3.2" fill="currentColor" opacity="0.55"/>
        </svg>`
    },
    {
        label: 'Nosso Sol Nasce',
        time:  '4,6 bilhões de anos atrás',
        text:  'Uma nuvem de gás e poeira colapsa sob sua própria gravidade. No centro, pressão e calor extremos acendem a fusão nuclear — nosso Sol começa a brilhar.',
        gradient: 'linear-gradient(148deg, rgba(255,212,38,0.46) 0%, rgba(220,118,8,0.28) 54%, rgba(78,18,4,0.18) 100%)',
        iconColor: 'rgba(255,228,98,0.96)',
        icon: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="7.5" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="19" cy="19" r="2.8" fill="currentColor" opacity="0.65"/>
            <line x1="19" y1="3"   x2="19" y2="7.5"  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="19" y1="30.5" x2="19" y2="35"  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="3"   y1="19" x2="7.5"  y2="19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="30.5" y1="19" x2="35" y2="19"  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="7.8"  y1="7.8"  x2="11" y2="11"   stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="27"   y1="27"   x2="30.2" y2="30.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="30.2" y1="7.8"  x2="27"   y2="11"   stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="11"   y1="27"   x2="7.8"  y2="30.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    },
    {
        label: 'Vida',
        time:  '3,8 bilhões de anos atrás',
        text:  'Em oceanos primitivos quentes, moléculas simples se organizam em estruturas capazes de se replicar. A química se torna biologia — e o universo começa a se observar.',
        gradient: 'linear-gradient(148deg, rgba(38,198,118,0.36) 0%, rgba(8,118,78,0.22) 54%, rgba(4,38,28,0.18) 100%)',
        iconColor: 'rgba(95,218,158,0.96)',
        icon: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="9.5" stroke="currentColor" stroke-width="1.6"/>
            <circle cx="19" cy="19" r="3.2" stroke="currentColor" stroke-width="1.4"/>
            <circle cx="12.5" cy="10.5" r="2.4" stroke="currentColor" stroke-width="1.3"/>
            <circle cx="25.5" cy="27.5" r="2.4" stroke="currentColor" stroke-width="1.3"/>
            <circle cx="27"   cy="11.5" r="1.7" stroke="currentColor" stroke-width="1.2"/>
            <line x1="19" y1="15.8" x2="14.5" y2="12.2" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
            <line x1="19" y1="22.2" x2="23.5" y2="25.8" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
        </svg>`
    },
    {
        label: 'Você',
        time:  'Agora · 13,8 bilhões de anos depois',
        text:  'Após 13,8 bilhões de anos de evolução cósmica, você chegou até aqui. O universo colapsou estrelas, formou galáxias e cultivou vida complexa — tudo para que você scrollasse até este ponto. Por enquanto.',
        gradient: 'linear-gradient(148deg, rgba(138,78,255,0.46) 0%, rgba(78,28,182,0.28) 54%, rgba(18,4,58,0.20) 100%)',
        iconColor: 'rgba(198,168,255,0.96)',
        icon: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="13" r="5.8" stroke="currentColor" stroke-width="1.8"/>
            <path d="M5.5 35c0-7.456 6.044-13.5 13.5-13.5S32.5 27.544 32.5 35"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    }
]

// Posição base de cada partícula em frações da viewport [x, y]
const BASE_POS = [
    [0.10, 0.40],
    [0.28, 0.57],
    [0.50, 0.46],
    [0.72, 0.38],
    [0.88, 0.55]
]

// Parâmetros de flutuação individuais
const FLOAT_P = BASE_POS.map((_, i) => ({
    sx: 0.26 + i * 0.06,  // velocidade X
    sy: 0.20 + i * 0.05,  // velocidade Y
    px: (i * 1.34) % (Math.PI * 2),
    py: (i * 0.88) % (Math.PI * 2),
    ax: 20 + i * 3.5      // amplitude X em px (dentro da zona de 20%)
}))

const TOTAL = DATA.length

// ── Estado ───────────────────────────────────────────────────────────────────

let isActive       = false
let innerStep      = 0
let openIdx        = -1
let hoverTimer     = null
let wheelLocked    = false

const lineReveal     = new Array(TOTAL - 1).fill(0)
const lineRevealTime = new Array(TOTAL - 1).fill(0)
const screenPos      = BASE_POS.map(() => ({ x: 0, y: 0 }))

let overlay, canvas, ctx, card, scrollHint
let particleEls = []

// ── Inicialização ─────────────────────────────────────────────────────────────

function init() {
    overlay    = document.getElementById('timeline-overlay')
    canvas     = document.getElementById('timeline-canvas')
    ctx        = canvas.getContext('2d')
    scrollHint = document.getElementById('tl-scroll-hint')

    // Criar elemento do card
    card = document.createElement('div')
    card.id        = 'tl-card'
    card.innerHTML = `
        <div id="tl-card-header">
            <div id="tl-card-header-bg"></div>
            <div id="tl-card-icon"></div>
        </div>
        <div id="tl-card-body">
            <p  id="tl-card-time"></p>
            <h3 id="tl-card-title"></h3>
            <p  id="tl-card-text"></p>
        </div>
        <button id="tl-card-close" aria-label="Fechar">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <line x1="1" y1="1" x2="10" y2="10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <line x1="10" y1="1" x2="1" y2="10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
        </button>`
    document.body.appendChild(card)

    document.getElementById('tl-card-close').addEventListener('click', (e) => {
        e.stopPropagation()
        closeCard()
    })

    // Criar partículas
    DATA.forEach((d, i) => {
        const el     = document.createElement('div')
        el.className = 'tl-particle'
        el.style.left = `${BASE_POS[i][0] * 100}%`
        el.style.top  = `${BASE_POS[i][1] * 100}%`

        const sphere     = document.createElement('div')
        sphere.className = 'tl-particle-sphere'
        sphere.style.animationDelay = `${i * 0.62}s`

        const label     = document.createElement('div')
        label.className = 'tl-particle-label'
        label.textContent = d.label

        el.appendChild(sphere)
        el.appendChild(label)
        overlay.insertBefore(el, canvas)
        particleEls.push(el)

        el.addEventListener('click', (e) => {
            e.stopPropagation()
            openIdx === i ? closeCard() : openCard(i)
        })

        el.addEventListener('pointerenter', () => {
            hoverTimer = setTimeout(() => openCard(i), 400)
        })
        el.addEventListener('pointerleave', () => clearTimeout(hoverTimer))
    })

    // Fechar ao clicar fora
    document.addEventListener('click', () => { if (openIdx >= 0) closeCard() })
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCard() })

    // Sincronia do canvas com viewport
    function syncCanvas() {
        canvas.width  = window.innerWidth
        canvas.height = window.innerHeight
    }
    syncCanvas()
    window.addEventListener('resize', syncCanvas)

    // Eventos de câmera
    document.addEventListener('cameraPositionChange', (e) => {
        const { step, dir } = e.detail
        if (step === 1)      showTimeline(dir ?? 1)
        else if (isActive)   forceHide()
    })

    document.addEventListener('timelineExit', () => hideTimeline())

    // Loop de animação
    loop()
}

// ── Loop de animação ─────────────────────────────────────────────────────────

function loop() {
    requestAnimationFrame(loop)
    const t = performance.now() * 0.001

    // Atualiza posições das partículas
    particleEls.forEach((el, i) => {
        const fp = FLOAT_P[i]
        const dx = Math.sin(t * fp.sx + fp.px) * fp.ax
        const dy = Math.sin(t * fp.sy + fp.py) * 30
        el.style.transform = `translate(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px))`
        screenPos[i].x = BASE_POS[i][0] * window.innerWidth  + dx
        screenPos[i].y = BASE_POS[i][1] * window.innerHeight + dy
    })

    drawCanvas(t)
}

// ── Desenho do canvas ─────────────────────────────────────────────────────────

function drawCanvas(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!isActive) return

    const now = performance.now()

    for (let i = 0; i < TOTAL - 1; i++) {
        // Linha i conecta partículas i e i+1; aparece quando ambas estão vivas
        if (innerStep < i + 2) {
            lineReveal[i]     = 0
            lineRevealTime[i] = 0
            continue
        }

        if (lineReveal[i] < 1) {
            if (lineRevealTime[i] === 0) lineRevealTime[i] = now
            lineReveal[i] = Math.min(1, (now - lineRevealTime[i]) / 620)
        }

        const p1 = screenPos[i]
        const p2 = screenPos[i + 1]

        // Ponto final parcial (animação de "desenho" da esquerda para a direita)
        const ex = p1.x + (p2.x - p1.x) * lineReveal[i]
        const ey = p1.y + (p2.y - p1.y) * lineReveal[i]

        // Opacidade pulsante assíncrona por linha
        const pulse = 0.08 + 0.27 * (0.5 + 0.5 * Math.sin(t * 0.75 + i * 1.45))

        const grad = ctx.createLinearGradient(p1.x, p1.y, ex, ey)
        grad.addColorStop(0,   `rgba(95,  45, 198, ${(pulse * 0.58).toFixed(3)})`)
        grad.addColorStop(0.5, `rgba(158, 98, 255, ${pulse.toFixed(3)})`)
        grad.addColorStop(1,   `rgba(95,  45, 198, ${(pulse * 0.58).toFixed(3)})`)

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = grad
        ctx.lineWidth   = 1
        ctx.stroke()

        // Orbe viajante (só quando linha totalmente revelada)
        if (lineReveal[i] >= 1) {
            const speed  = 0.16 + i * 0.028
            const phase  = i * 0.72
            const orbT   = ((t * speed + phase) % 1 + 1) % 1

            const ox = p1.x + (p2.x - p1.x) * orbT
            const oy = p1.y + (p2.y - p1.y) * orbT

            const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, 11)
            glow.addColorStop(0,    'rgba(255, 248, 255, 0.92)')
            glow.addColorStop(0.32, 'rgba(198, 158, 255, 0.52)')
            glow.addColorStop(1,    'rgba(138, 78,  255, 0)')

            ctx.beginPath()
            ctx.arc(ox, oy, 11, 0, Math.PI * 2)
            ctx.fillStyle = glow
            ctx.fill()

            ctx.beginPath()
            ctx.arc(ox, oy, 2.4, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(255, 252, 255, 0.94)'
            ctx.fill()
        }
    }
}

// ── Show / Hide ───────────────────────────────────────────────────────────────

function showTimeline(dir) {
    isActive = true
    overlay.classList.add('is-visible')
    closeCard()

    if (dir >= 0) {
        // Entrando do hero: apenas partícula 1 aparece, captura scrub
        innerStep = 0
        particleEls.forEach(el => el.classList.remove('is-alive'))
        lineReveal.fill(0)
        lineRevealTime.fill(0)

        // Primeira partícula aparece com delay curto
        setTimeout(() => {
            showParticle(0)
            innerStep = 1
        }, 120)

        window.__timelineCapturing = true
        showScrollHint(true)
    } else {
        // Retornando dos cards: todas as partículas visíveis instantaneamente
        lineReveal.fill(1)
        lineRevealTime.fill(performance.now() - 700)

        particleEls.forEach((el) => {
            const sphere = el.querySelector('.tl-particle-sphere')
            sphere.style.transition = 'none'
            void el.offsetHeight
        })
        particleEls.forEach((el, i) => {
            const sphere = el.querySelector('.tl-particle-sphere')
            sphere.style.transform = 'scale(1)'
            sphere.style.opacity   = '1'
            el.classList.add('is-alive')
        })
        requestAnimationFrame(() => {
            particleEls.forEach(el => {
                el.querySelector('.tl-particle-sphere').style.transition = ''
            })
        })

        innerStep = TOTAL
        window.__timelineCapturing = true  // captura scrolls backward
        showScrollHint(false)
    }
}

function showParticle(idx) {
    const el = particleEls[idx]
    if (el) el.classList.add('is-alive')
}

function hideParticle(idx) {
    const el = particleEls[idx]
    if (!el) return
    el.classList.remove('is-alive')
    if (openIdx === idx) closeCard()

    // Reset do reveal das linhas adjacentes
    if (idx < TOTAL - 1) { lineReveal[idx] = 0; lineRevealTime[idx] = 0 }
    if (idx > 0)          { lineReveal[idx - 1] = 0; lineRevealTime[idx - 1] = 0 }
}

function hideTimeline() {
    isActive = false
    overlay.classList.remove('is-visible')
    closeCard()
    showScrollHint(false)
    window.__timelineCapturing = false
    setTimeout(() => document.dispatchEvent(new CustomEvent('timelineExitDone')), 400)
}

function forceHide() {
    isActive = false
    overlay.classList.remove('is-visible')
    closeCard()
    showScrollHint(false)
    window.__timelineCapturing = false
}

// ── Hint de scroll ────────────────────────────────────────────────────────────

function showScrollHint(show) {
    if (!scrollHint) return
    scrollHint.classList.toggle('is-visible', show)
}

// ── Card ──────────────────────────────────────────────────────────────────────

function openCard(idx) {
    if (!particleEls[idx]?.classList.contains('is-alive')) return

    openIdx = idx
    const d = DATA[idx]

    document.getElementById('tl-card-header-bg').style.background = d.gradient
    const iconEl = document.getElementById('tl-card-icon')
    iconEl.innerHTML   = d.icon
    iconEl.style.color = d.iconColor
    document.getElementById('tl-card-time').textContent  = d.time
    document.getElementById('tl-card-title').textContent = d.label
    document.getElementById('tl-card-text').textContent  = d.text

    // Posiciona ao lado da partícula evitando bordas da tela
    const sp  = screenPos[idx]
    const W   = 280
    const H   = 230
    const PAD = 18

    let left = sp.x + 24
    let top  = sp.y - H / 2

    if (left + W > window.innerWidth  - PAD) left = sp.x - W - 24
    if (left < PAD)                           left = PAD
    if (top  < PAD)                           top  = PAD
    if (top  + H > window.innerHeight - PAD)  top  = window.innerHeight - H - PAD

    card.style.left = `${Math.round(left)}px`
    card.style.top  = `${Math.round(top)}px`

    void card.offsetHeight
    card.classList.add('is-open')
}

function closeCard() {
    openIdx = -1
    card?.classList.remove('is-open')
}

// ── Wheel — scrub interno ─────────────────────────────────────────────────────

window.addEventListener('wheel', (e) => {
    if (!isActive) return

    const dir = e.deltaY > 0 ? 1 : -1

    // Re-captura se todas as partículas estão visíveis e usuário scrolla para cima.
    // __timelineCapturing é setado ANTES do listener do CameraScroll no mesmo evento.
    if (dir < 0 && !window.__timelineCapturing && innerStep === TOTAL) {
        window.__timelineCapturing = true
        showScrollHint(false)
        // continua para processar este evento (CameraScroll verá capturing=true)
    }

    if (!window.__timelineCapturing) return

    // Throttle: uma partícula por intervalo
    if (wheelLocked) return
    wheelLocked = true
    setTimeout(() => { wheelLocked = false }, 660)

    if (dir > 0) {
        if (innerStep < TOTAL) {
            showParticle(innerStep)
            innerStep++
            if (innerStep >= TOTAL) {
                // Adia o release para o próximo tick, evitando que CameraScroll
                // processe este mesmo evento wheel (ambos ouvem o mesmo evento).
                setTimeout(() => {
                    window.__timelineCapturing = false
                    showScrollHint(false)
                }, 0)
            }
        }
    } else {
        if (innerStep > 0) {
            innerStep--
            hideParticle(innerStep)
            if (innerStep === 0) {
                setTimeout(() => { window.__timelineCapturing = false }, 0)
            }
        }
    }
}, { passive: true })

// ── Bootstrap ─────────────────────────────────────────────────────────────────

init()
