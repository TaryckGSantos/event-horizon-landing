const inner = document.getElementById('hero-inner')
if (!inner) throw new Error('hero-inner not found')

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
