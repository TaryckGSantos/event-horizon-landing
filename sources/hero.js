const inner  = document.getElementById('hero-inner')
const heroEl = document.getElementById('hero')

if(!inner)  throw new Error('hero-inner not found')
if(!heroEl) throw new Error('hero not found')

const MAX_X = 3     // px máx deslocamento horizontal
const MAX_Y = 2     // px máx deslocamento vertical
const EASE  = 0.06  // lerp — menor = mais suave

let targetX = 0, targetY  = 0
let currentX = 0, currentY = 0

window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2
    const ny = (e.clientY / window.innerHeight - 0.5) * 2
    targetX = nx * MAX_X
    targetY = ny * MAX_Y
})

;(function loop() {
    currentX += (targetX - currentX) * EASE
    currentY += (targetY - currentY) * EASE
    inner.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`
    requestAnimationFrame(loop)
})()

// ─── Visibilidade do hero por posição de câmera ───────────────

document.addEventListener('heroExit', () => {
    heroEl.style.transition =
        'opacity 0.55s cubic-bezier(0.4, 0, 0.6, 1), ' +
        'transform 0.55s cubic-bezier(0.4, 0, 0.6, 1)'
    heroEl.classList.add('hero-away')
})

document.addEventListener('heroEnter', () => {
    const title    = document.getElementById('hero-title')
    const line     = document.getElementById('hero-line')
    const subtitle = document.getElementById('hero-subtitle')

    // Enquanto o parent ainda está oculto (hero-away = opacity:0),
    // reseta a animation de cada filho para que o browser a reinicie do zero.
    ;[title, line, subtitle].forEach(el => { el.style.animation = 'none' })
    void heroEl.offsetHeight  // força reflow — confirma o reset antes do próximo passo
    ;[title, line, subtitle].forEach(el => { el.style.animation = '' }) // CSS rule re-aplica → heroReveal reinicia

    // Exibe o parent imediatamente (sem transição): as animations dos filhos
    // criam o stagger idêntico ao page load (delay 0.5s / 0.85s / 1.2s).
    heroEl.style.transition = 'none'
    void heroEl.offsetHeight
    heroEl.classList.remove('hero-away')
})
