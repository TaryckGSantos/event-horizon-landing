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
// X em zonas exclusivas por partícula; Y aleatório dentro de [0.50, 0.92]
const BASE_POS = [
    [0.10, 0.50 + Math.random() * 0.42],
    [0.28, 0.50 + Math.random() * 0.42],
    [0.50, 0.50 + Math.random() * 0.42],
    [0.72, 0.50 + Math.random() * 0.42],
    [0.88, 0.50 + Math.random() * 0.42]
]

// Parâmetros de flutuação individuais
// Y: fase e amplitude aleatórias independentes — partículas podem coincidir verticalmente
const FLOAT_P = BASE_POS.map((_, i) => ({
    sx: 0.26 + i * 0.06,
    sy: 0.15 + Math.random() * 0.18,
    px: (i * 1.34) % (Math.PI * 2),
    py: Math.random() * Math.PI * 2,
    ax: 20 + i * 3.5,
    ay: 18 + Math.random() * 24
}))

const TOTAL = DATA.length

// ── Estado ───────────────────────────────────────────────────────────────────

let isActive           = false
let innerStep          = 0
let openIdx            = -1
let hoverTimer         = null
let wheelLocked        = false
let firstParticleTimer = null

const linePhase     = new Array(TOTAL - 1).fill('hidden')
const lineAnimT     = new Array(TOTAL - 1).fill(0)
const lineOrbOffset = new Array(TOTAL - 1).fill(0)
const screenPos      = BASE_POS.map(() => ({ x: 0, y: 0 }))

const particleAlive   = new Array(TOTAL).fill(false)
const particleRotA    = new Array(TOTAL).fill(0)
const particleHoverLp = new Array(TOTAL).fill(0)
const particleHovered = new Array(TOTAL).fill(false)

let overlay, canvas, ctx, card, scrollHint
let particleEls = []

function easeOutCubic(t)   { return 1 - Math.pow(1 - t, 3) }
function easeOutQuart(t)   { return 1 - Math.pow(1 - t, 4) }
function easeInExpo(t)     { return t === 0 ? 0 : Math.pow(2, 10 * t - 10) }
function easeInQuart(t)    { return t * t * t * t }
function easeOutElastic(t) {
    if (t === 0 || t === 1) return t
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1
}

const particlePhase = new Array(TOTAL).fill('idle')
const particleAnimT = new Array(TOTAL).fill(0)

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

        const label     = document.createElement('div')
        label.className = 'tl-particle-label'
        label.textContent = d.label

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
        const { step } = e.detail
        if (step === 1)      showTimeline()
        else if (isActive)   forceHide()
    })

    document.addEventListener('timelineExit', () => hideTimeline())

    window.addEventListener('mousemove', (e) => {
        if (!isActive) return
        for (let i = 0; i < TOTAL; i++) {
            if (!particleAlive[i]) { particleHovered[i] = false; continue }
            const dx = e.clientX - screenPos[i].x
            const dy = e.clientY - screenPos[i].y
            particleHovered[i] = dx * dx + dy * dy <= 484
        }
    }, { passive: true })
    window.addEventListener('mouseleave', () => {
        for (let i = 0; i < TOTAL; i++) particleHovered[i] = false
    })

    // Loop de animação
    loop()
}

// ── Loop de animação ─────────────────────────────────────────────────────────

function loop() {
    requestAnimationFrame(loop)
    const t = performance.now() * 0.001

    // Atualiza posições das partículas
    const minY = window.innerHeight * 0.50
    const maxY = window.innerHeight * 0.92
    particleEls.forEach((el, i) => {
        const fp     = FLOAT_P[i]
        const dx     = Math.sin(t * fp.sx + fp.px) * fp.ax
        const baseY  = BASE_POS[i][1] * window.innerHeight
        const rawDy  = Math.sin(t * fp.sy + fp.py) * fp.ay
        const finalY = Math.min(Math.max(baseY + rawDy, minY), maxY)
        const dy     = finalY - baseY
        el.style.transform = `translate(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px))`
        screenPos[i].x = BASE_POS[i][0] * window.innerWidth + dx
        screenPos[i].y = finalY
    })

    const nowMs = performance.now()
    for (let i = 0; i < TOTAL; i++) {
        if (!particleAlive[i]) continue
        const ph      = particlePhase[i]
        const elapsed = nowMs - particleAnimT[i]
        if (ph === 'entering') {
            const p     = Math.min(elapsed / 900, 1)
            const speed = 0.045 + (0.008 - 0.045) * easeOutCubic(p)
            particleRotA[i] += speed
            if (p >= 1) particlePhase[i] = 'idle'
        } else if (ph === 'exiting') {
            const p     = Math.min(elapsed / 650, 1)
            const speed = 0.008 + (0.07 - 0.008) * p
            particleRotA[i] += speed
        } else {
            const target = particleHovered[i] ? 1 : 0
            particleHoverLp[i] += (target - particleHoverLp[i]) * 0.12
            particleRotA[i] += 0.008 + particleHoverLp[i] * 0.016
        }
    }

    for (let li = 0; li < TOTAL - 1; li++) {
        const pA  = particlePhase[li]
        const pB  = particlePhase[li + 1]
        const lph = linePhase[li]
        const anyExiting = (particleAlive[li] && pA === 'exiting') ||
                           (particleAlive[li + 1] && pB === 'exiting')

        if (lph === 'hidden') {
            if (particleAlive[li] && particleAlive[li + 1] && pA === 'idle' && pB === 'idle') {
                linePhase[li] = 'entering'
                lineAnimT[li] = nowMs
            }
        } else if (lph === 'entering') {
            if (anyExiting) {
                linePhase[li] = 'exiting'
                lineAnimT[li] = nowMs
            } else if (nowMs - lineAnimT[li] >= 1600) {
                const speed = 0.16 + li * 0.028
                lineOrbOffset[li] = -(((t * speed + li * 0.72) % 1 + 1) % 1)
                linePhase[li] = 'idle'
            }
        } else if (lph === 'idle') {
            if (anyExiting) {
                linePhase[li] = 'exiting'
                lineAnimT[li] = nowMs
            }
        } else if (lph === 'exiting') {
            if (nowMs - lineAnimT[li] >= 400) {
                linePhase[li] = 'hidden'
            }
        }
    }

    drawCanvas(t)
}

// ── Desenho do canvas ─────────────────────────────────────────────────────────

function drawCanvas(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!isActive) return

    const now = performance.now()

    for (let i = 0; i < TOTAL - 1; i++) {
        const lph = linePhase[i]
        if (lph === 'hidden') continue

        const p1      = screenPos[i]
        const p2      = screenPos[i + 1]
        const elapsed = now - lineAnimT[i]
        const dx      = p2.x - p1.x
        const dy      = p2.y - p1.y
        const lineLen = Math.sqrt(dx * dx + dy * dy) || 1

        ctx.save()
        ctx.setLineDash([])

        if (lph === 'entering') {
            const tN = Math.min(elapsed / 1600, 1)
            const e  = easeOutQuart(tN)
            const cx = p1.x + dx * e
            const cy = p1.y + dy * e

            // Linha permanente — dois passes
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(cx, cy)
            ctx.strokeStyle = 'rgba(150,100,240,0.15)'
            ctx.lineWidth   = 1
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(cx, cy)
            ctx.strokeStyle = 'rgba(200,160,255,0.08)'
            ctx.lineWidth   = 0.5
            ctx.stroke()

            // Fase de chegada: quando tN > 0.85 o cometa "explode"
            const arrivalT   = tN > 0.85 ? (tN - 0.85) / 0.15 : 0
            const trailAlpha = 1 - arrivalT

            // Rastro camada 1 — suave, 70px
            const te1  = Math.max(0, e - 70 / lineLen)
            const tx10 = p1.x + dx * te1
            const ty10 = p1.y + dy * te1
            if (te1 < e) {
                const trail1 = ctx.createLinearGradient(tx10, ty10, cx, cy)
                trail1.addColorStop(0.0, 'rgba(190,140,255,0)')
                trail1.addColorStop(1.0, `rgba(190,140,255,${(0.45 * trailAlpha).toFixed(3)})`)
                ctx.beginPath()
                ctx.moveTo(tx10, ty10)
                ctx.lineTo(cx, cy)
                ctx.strokeStyle = trail1
                ctx.lineWidth   = 2.5
                ctx.stroke()
            }

            // Rastro camada 2 — brilhante, 22px
            const te2  = Math.max(0, e - 22 / lineLen)
            const tx20 = p1.x + dx * te2
            const ty20 = p1.y + dy * te2
            if (te2 < e) {
                const trail2 = ctx.createLinearGradient(tx20, ty20, cx, cy)
                trail2.addColorStop(0.0, 'rgba(240,210,255,0)')
                trail2.addColorStop(1.0, `rgba(255,255,255,${(0.95 * trailAlpha).toFixed(3)})`)
                ctx.beginPath()
                ctx.moveTo(tx20, ty20)
                ctx.lineTo(cx, cy)
                ctx.strokeStyle = trail2
                ctx.lineWidth   = 1.5
                ctx.stroke()
            }

            // Núcleo — expande e some na fase de chegada
            const headR     = 9 + arrivalT * 9
            const headAlpha = 1 - arrivalT
            const head = ctx.createRadialGradient(cx, cy, 0, cx, cy, headR)
            head.addColorStop(0.0, `rgba(255,255,255,${headAlpha.toFixed(3)})`)
            head.addColorStop(0.4, `rgba(220,180,255,${(0.8 * headAlpha).toFixed(3)})`)
            head.addColorStop(1.0, 'rgba(220,180,255,0)')
            ctx.beginPath()
            ctx.arc(cx, cy, headR, 0, Math.PI * 2)
            ctx.fillStyle = head
            ctx.fill()

        } else if (lph === 'idle') {
            const pulse = 0.08 + 0.27 * (0.5 + 0.5 * Math.sin(t * 0.75 + i * 1.45))
            const grad  = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            grad.addColorStop(0,   `rgba(95,  45, 198, ${(pulse * 0.58).toFixed(3)})`)
            grad.addColorStop(0.5, `rgba(158, 98, 255, ${pulse.toFixed(3)})`)
            grad.addColorStop(1,   `rgba(95,  45, 198, ${(pulse * 0.58).toFixed(3)})`)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = grad
            ctx.lineWidth   = 1
            ctx.stroke()

            const orbT = ((t * (0.16 + i * 0.028) + lineOrbOffset[i] + i * 0.72) % 1 + 1) % 1
            const ox   = p1.x + dx * orbT
            const oy   = p1.y + dy * orbT
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

        } else if (lph === 'exiting') {
            ctx.globalAlpha = Math.max(0, 1 - elapsed / 400)

            const pulse = 0.08 + 0.27 * (0.5 + 0.5 * Math.sin(t * 0.75 + i * 1.45))
            const grad  = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            grad.addColorStop(0,   `rgba(95,  45, 198, ${(pulse * 0.58).toFixed(3)})`)
            grad.addColorStop(0.5, `rgba(158, 98, 255, ${pulse.toFixed(3)})`)
            grad.addColorStop(1,   `rgba(95,  45, 198, ${(pulse * 0.58).toFixed(3)})`)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = grad
            ctx.lineWidth   = 1
            ctx.stroke()

            const orbT = ((t * (0.16 + i * 0.028) + lineOrbOffset[i] + i * 0.72) % 1 + 1) % 1
            const ox   = p1.x + dx * orbT
            const oy   = p1.y + dy * orbT
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

        ctx.restore()
    }

    for (let i = 0; i < TOTAL; i++) {
        if (particleAlive[i]) drawSpiral(i, now)
    }
}

function drawSpiral(i, now) {
    const px    = screenPos[i].x
    const py    = screenPos[i].y
    const lp    = particleHoverLp[i]
    const rot   = particleRotA[i]
    const ph    = particlePhase[i]
    const cycle = (2.8 - lp * 1.4) * 1000

    let glowR       = 18 + lp * 10
    let glowOp      = 0.25
    let coreR       = 2.5 + lp * 1.5
    let arcScaleExt = 1, arcScaleMid = 1, arcScaleInt = 1
    let arcOp       = 0.85 + lp * 0.15
    let showArcs    = true
    let showRings   = true
    let flashR      = 0, flashOp = 0

    if (ph === 'entering') {
        const elapsed   = now - particleAnimT[i]
        const P1_END    = 150
        const TOTAL_DUR = 900

        if (elapsed < P1_END) {
            // Phase 1: flash burst + nucleus only
            const p  = elapsed / P1_END
            const pe = easeOutQuart(p)
            flashR    = 55 - 27 * pe
            flashOp   = 0.9
            glowR     = 0
            glowOp    = 0
            coreR     = 8.75
            showArcs  = false
            showRings = false
        } else {
            // Phase 2: gravitational collapse
            const p2  = Math.min((elapsed - P1_END) / (TOTAL_DUR - P1_END), 1)
            const p2e = easeOutCubic(p2)
            const s   = 3.8 - 2.8 * p2e
            arcScaleExt = arcScaleMid = arcScaleInt = s
            const arcOpRaw = Math.max(0, elapsed - P1_END - 80) / ((TOTAL_DUR - P1_END) - 80)
            arcOp     = Math.min(1, easeOutCubic(arcOpRaw))
            glowR     = 44 - (44 - (18 + lp * 10)) * p2e
            glowOp    = 0.65 - 0.40 * p2e
            coreR     = Math.max(0.1, 8.75 + ((2.5 + lp * 1.5) - 8.75) * easeOutElastic(p2))
            showRings = p2 > 0.55
        }
    } else if (ph === 'exiting') {
        const elapsed = now - particleAnimT[i]
        const DUR     = 650
        const p       = Math.min(elapsed / DUR, 1)
        if (p >= 1) {
            particleAlive[i] = false
            particlePhase[i] = 'idle'
            return
        }
        arcScaleExt = Math.max(0, 1 - easeInExpo(p))
        arcScaleMid = Math.max(0, 1 - easeInExpo(Math.min(Math.max((p - 0.10) / 0.90, 0), 1)))
        arcScaleInt = Math.max(0, 1 - easeInExpo(Math.min(Math.max((p - 0.20) / 0.80, 0), 1)))
        coreR       = Math.max(0, (2.5 + lp * 1.5) * (1 - easeInQuart(p)))
        glowR       = (18 + lp * 10) * (1 - p)
        glowOp      = 0.25 * (1 - p)
        showRings   = false
        if (p > 0.82) {
            const fP = (p - 0.82) / 0.18
            flashOp  = fP * 0.75
            flashR   = 10 * fP
        }
    }

    ctx.save()
    ctx.translate(px, py)

    // Layer 4: background glow
    if (glowR > 0.5) {
        const bg = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR)
        bg.addColorStop(0, `rgba(154,108,240,${glowOp.toFixed(3)})`)
        bg.addColorStop(1, 'rgba(154,108,240,0)')
        ctx.beginPath()
        ctx.arc(0, 0, glowR, 0, Math.PI * 2)
        ctx.fillStyle = bg
        ctx.fill()
    }

    // Flash burst (enter phase 1 / exit implosion)
    if (flashR > 0.5 && flashOp > 0) {
        const fl = ctx.createRadialGradient(0, 0, 0, 0, 0, flashR)
        fl.addColorStop(0, `rgba(255,240,255,${flashOp.toFixed(3)})`)
        fl.addColorStop(1, 'rgba(255,240,255,0)')
        ctx.beginPath()
        ctx.arc(0, 0, flashR, 0, Math.PI * 2)
        ctx.fillStyle = fl
        ctx.fill()
    }

    // Layer 3: sonar rings
    if (showRings) {
        const ringDelays = [0, 900, 1800]
        for (let r = 0; r < 3; r++) {
            const rPhase = ((now - ringDelays[r]) % cycle + cycle) % cycle
            const prog   = rPhase / cycle
            const ringR  = 4 + prog * 34
            const opa    = (1 - Math.abs(prog * 2 - 1)) * 0.75
            ctx.save()
            ctx.globalAlpha = opa
            ctx.beginPath()
            ctx.arc(0, 0, ringR, 0, Math.PI * 2)
            ctx.strokeStyle = 'rgba(170,120,250,0.55)'
            ctx.lineWidth   = 1.5
            ctx.setLineDash([])
            ctx.stroke()
            ctx.restore()
        }
    }

    // Layer 1: arcs
    if (showArcs) {
        const rExt = 9 * arcScaleExt
        if (rExt > 0.2) {
            ctx.save()
            ctx.rotate(rot)
            const sExt = (2 * Math.PI * rExt) / 4
            ctx.setLineDash([sExt * 0.65, sExt * 0.35])
            ctx.beginPath()
            ctx.arc(0, 0, rExt, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(220,190,255,${arcOp.toFixed(3)})`
            ctx.lineWidth   = 1.2
            ctx.stroke()
            ctx.setLineDash([])
            ctx.restore()
        }

        const rMid = 6 * arcScaleMid
        if (rMid > 0.2) {
            ctx.save()
            ctx.rotate(rot * 1.5 + Math.PI / 3)
            const sMid = (2 * Math.PI * rMid) / 4
            ctx.setLineDash([sMid * 0.65, sMid * 0.35])
            ctx.beginPath()
            ctx.arc(0, 0, rMid, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(180,140,255,${(0.7 + lp * 0.3).toFixed(3)})`
            ctx.lineWidth   = 1.0
            ctx.stroke()
            ctx.setLineDash([])
            ctx.restore()
        }

        const rInt = 3 * arcScaleInt
        if (rInt > 0.2) {
            ctx.save()
            ctx.rotate(-rot * 2.25)
            ctx.setLineDash([])
            ctx.beginPath()
            ctx.arc(0, 0, rInt, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(255,240,255,${(0.8 + lp * 0.2).toFixed(3)})`
            ctx.lineWidth   = 1.0
            ctx.stroke()
            ctx.restore()
        }
    }

    // Layer 2: central nucleus
    if (coreR > 0.2) {
        const core = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR)
        core.addColorStop(0, '#ffffff')
        core.addColorStop(1, 'rgba(200,170,255,0.9)')
        ctx.beginPath()
        ctx.arc(0, 0, coreR, 0, Math.PI * 2)
        ctx.fillStyle = core
        ctx.fill()
    }

    ctx.restore()
}

// ── Show / Hide ───────────────────────────────────────────────────────────────

function resetParticles() {
    if (firstParticleTimer) { clearTimeout(firstParticleTimer); firstParticleTimer = null }
    innerStep = 0
    linePhase.fill('hidden')
    lineAnimT.fill(0)
    lineOrbOffset.fill(0)
    closeCard()
    particleEls.forEach((el) => {
        const sphere = el.querySelector('.tl-particle-sphere')
        if (sphere) {
            sphere.style.transition = 'none'
            sphere.style.transform  = 'scale(0)'
            sphere.style.opacity    = '0'
        }
        el.classList.remove('is-alive')
    })
    if (particleEls.length) void particleEls[0].offsetHeight
    particleEls.forEach((el) => {
        const sphere = el.querySelector('.tl-particle-sphere')
        if (sphere) sphere.style.transition = ''
    })
    particleAlive.fill(false)
    particleHoverLp.fill(0)
    particleHovered.fill(false)
    particlePhase.fill('idle')
    particleAnimT.fill(0)
}

function showTimeline() {
    isActive = true
    overlay.classList.add('is-visible')
    resetParticles()

    firstParticleTimer = setTimeout(() => {
        firstParticleTimer = null
        if (isActive && innerStep === 0) {
            showParticle(0)
            innerStep = 1
        }
    }, 900)

    window.__timelineCapturing = true
    showScrollHint(true)
}

function showParticle(idx) {
    const el = particleEls[idx]
    if (!el) return
    el.classList.add('is-alive')
    particleAlive[idx]   = true
    particleHoverLp[idx] = 0
    particleHovered[idx] = false
    particlePhase[idx]   = 'entering'
    particleAnimT[idx]   = performance.now()
}

function hideParticle(idx) {
    const el = particleEls[idx]
    if (!el) return
    el.classList.remove('is-alive')
    particleHoverLp[idx] = 0
    particleHovered[idx] = false
    if (openIdx === idx) closeCard()
    if (particleAlive[idx]) {
        particlePhase[idx] = 'exiting'
        particleAnimT[idx] = performance.now()
    }
}

function hideTimeline() {
    isActive = false
    overlay.classList.remove('is-visible')
    showScrollHint(false)
    window.__timelineCapturing = false
    resetParticles()
    setTimeout(() => document.dispatchEvent(new CustomEvent('timelineExitDone')), 400)
}

function forceHide() {
    isActive = false
    overlay.classList.remove('is-visible')
    showScrollHint(false)
    window.__timelineCapturing = false
    resetParticles()
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
    const GAP = 24
    const PAD = 12

    // Horizontal: direita por padrão, flip para esquerda se não couber
    let left = sp.x + GAP
    if (left + W > window.innerWidth - PAD) left = sp.x - W - GAP
    left = Math.max(PAD, Math.min(left, window.innerWidth - W - PAD))

    // Vertical: tenta centrar na partícula
    let top = sp.y - H / 2
    if (top < PAD)                           top = sp.y + GAP       // ultrapassa topo → abre para baixo
    if (top + H > window.innerHeight - PAD)  top = sp.y - H - GAP   // ultrapassa fundo → abre para cima
    top = Math.max(PAD, Math.min(top, window.innerHeight - H - PAD))

    card.style.left = `${Math.round(left)}px`
    card.style.top  = `${Math.round(top)}px`

    void card.offsetHeight
    card.classList.add('is-open')

    // Validação pós-renderização com getBoundingClientRect
    requestAnimationFrame(() => {
        const r  = card.getBoundingClientRect()
        let cx = parseFloat(card.style.left)
        let cy = parseFloat(card.style.top)
        if (r.right  > window.innerWidth  - PAD) cx -= r.right  - (window.innerWidth  - PAD)
        if (r.bottom > window.innerHeight - PAD) cy -= r.bottom - (window.innerHeight - PAD)
        if (r.left   < PAD)                      cx += PAD - r.left
        if (r.top    < PAD)                      cy += PAD - r.top
        card.style.left = `${Math.round(cx)}px`
        card.style.top  = `${Math.round(cy)}px`
    })
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
                // 660 ms = mesmo intervalo do wheelLocked: garante que o gesto
                // atual do trackpad se esgota antes de liberar o CameraScroll.
                // Com setTimeout(0) o próximo evento do mesmo gesto disparava
                // a transição 2.1→2.2 antes que o usuário iniciasse um novo scroll.
                setTimeout(() => {
                    window.__timelineCapturing = false
                    showScrollHint(false)
                }, 660)
            }
        }
    } else {
        if (innerStep > 0) {
            innerStep--
            hideParticle(innerStep)
            if (innerStep === 0) {
                if (firstParticleTimer) { clearTimeout(firstParticleTimer); firstParticleTimer = null }
                setTimeout(() => { window.__timelineCapturing = false }, 0)
            }
        } else {
            if (firstParticleTimer) { clearTimeout(firstParticleTimer); firstParticleTimer = null }
            window.__timelineCapturing = false
        }
    }
}, { passive: true })

// ── Bootstrap ─────────────────────────────────────────────────────────────────

init()
