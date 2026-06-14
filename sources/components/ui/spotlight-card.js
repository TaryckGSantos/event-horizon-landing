/**
 * GlowCard — vanilla JS/CSS, sem React, sem Tailwind.
 *
 * Correção central: cada card recebe coordenadas LOCAIS via getBoundingClientRect().
 * A fonte de luz é independente por card. Não há coordenada global compartilhada.
 *
 * Variáveis CSS por card:
 *   --mouse-x       posição local do cursor no eixo X do card (pode ser negativa)
 *   --mouse-y       posição local do cursor no eixo Y do card (pode ser negativa)
 *   --glow-opacity  0–1 baseado na distância do cursor ao card
 */

// Distância máxima fora do card onde o glow ainda aparece (px)
const PROXIMITY_PX = 94

export function createGlowCard({ title, description, icon = '', width = 300 })
{
    const card = document.createElement('div')
    card.className = 'glow-card'
    card.style.width = `${width}px`

    const deco = document.createElement('div')
    deco.className = 'card-deco'

    const iconWrap = document.createElement('div')
    iconWrap.className = 'card-icon-wrap'
    iconWrap.innerHTML = icon

    const content = document.createElement('div')
    content.className = 'glow-card-content'
    content.innerHTML = `
        <h3 class="card-title">${title}</h3>
        <p  class="card-desc">${description}</p>
    `

    card.appendChild(deco)
    card.appendChild(iconWrap)
    card.appendChild(content)
    return card
}

export function initGlowPointer()
{
    const cards = document.querySelectorAll('.glow-card')

    // Invalida coordenadas derivadas do layout anterior. O próximo pointermove
    // sempre mede novamente cada card com getBoundingClientRect().
    const ro = new ResizeObserver((entries) => {
        entries.forEach(({ target: card }) => {
            card.style.removeProperty('--mouse-x')
            card.style.removeProperty('--mouse-y')
            card.style.removeProperty('--glow-opacity')
        })
    })

    cards.forEach(card => ro.observe(card))

    document.addEventListener('pointermove', (e) =>
    {
        const cx = e.clientX
        const cy = e.clientY

        cards.forEach(card =>
        {
            // Sempre fresh — nunca usar rect cacheado fora deste handler
            const rect = card.getBoundingClientRect()

            // Guard: card ainda não foi renderizado / está oculto sem dimensões
            if (rect.width === 0 || rect.height === 0) return

            // Posição local: pode ser negativa (fora à esquerda/cima) ou > dimensão (fora à direita/baixo)
            const localX = cx - rect.left
            const localY = cy - rect.top

            // Distância euclideana do cursor até o ponto mais próximo do card.
            const dx   = Math.max(rect.left - cx, 0, cx - rect.right)
            const dy   = Math.max(rect.top  - cy, 0, cy - rect.bottom)
            const dist = Math.sqrt(dx * dx + dy * dy)

            const opacity = dist < PROXIMITY_PX
                ? (1 - dist / PROXIMITY_PX).toFixed(3)
                : '0'

            card.style.setProperty('--mouse-x',      `${localX.toFixed(1)}px`)
            card.style.setProperty('--mouse-y',      `${localY.toFixed(1)}px`)
            card.style.setProperty('--glow-opacity', opacity)
        })
    })

    // ── Rastro dissolvente ────────────────────────────────────────
    const overlay = document.getElementById('cards-overlay')
    if (!overlay) return

    const canvas = document.createElement('canvas')
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:5;'
    overlay.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    const TRAIL_MAX      = 20
    const TRAIL_DURATION = 900
    const trail          = []
    let curX = -1000, curY = -1000, overCard = false

    function syncSize() {
        canvas.width  = overlay.offsetWidth
        canvas.height = overlay.offsetHeight
    }
    syncSize()
    new ResizeObserver(syncSize).observe(overlay)

    document.addEventListener('pointermove', (e) =>
    {
        const hit = [...cards].some(c => {
            const r = c.getBoundingClientRect()
            return e.clientX >= r.left && e.clientX <= r.right &&
                   e.clientY >= r.top  && e.clientY <= r.bottom
        })

        const base = overlay.getBoundingClientRect()
        curX     = e.clientX - base.left
        curY     = e.clientY - base.top
        overCard = hit

        if (hit) {
            if (trail.length >= TRAIL_MAX) trail.shift()
            trail.push({ x: curX, y: curY, t: performance.now() })
        }
    })

    function draw()
    {
        const now = performance.now()
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        while (trail.length && now - trail[0].t > TRAIL_DURATION) trail.shift()

        trail.forEach(p => {
            const age    = (now - p.t) / TRAIL_DURATION   // 0 = recente → 1 = expirado
            const alpha  = (1 - age) * 0.5
            const radius = (1 - age) * 18
            if (radius < 0.5) return

            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
            g.addColorStop(0, `rgba(180,140,255,${alpha.toFixed(3)})`)
            g.addColorStop(1, 'rgba(180,140,255,0)')
            ctx.beginPath()
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
            ctx.fillStyle = g
            ctx.fill()
        })

        if (overCard) {
            ctx.beginPath()
            ctx.arc(curX, curY, 3, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(255,255,255,0.7)'
            ctx.fill()
        }

        requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)

    document.addEventListener('cardsExit', () => {
        trail.length = 0
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        overCard = false
        cards.forEach(c => c.style.cursor = 'auto')
    })

    document.addEventListener('cameraPositionChange', (e) => {
        if (e.detail.step === 2) {
            cards.forEach(c => c.style.removeProperty('cursor'))
        }
    })
}
