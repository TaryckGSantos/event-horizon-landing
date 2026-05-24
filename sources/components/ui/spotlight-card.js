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

export function createGlowCard({ title, description, width = 300 })
{
    const card = document.createElement('div')
    card.className = 'glow-card'
    card.style.width = `${width}px`

    const content = document.createElement('div')
    content.className = 'glow-card-content'
    content.innerHTML = `
        <h3 class="card-title">${title}</h3>
        <p  class="card-desc">${description}</p>
    `

    const deco = document.createElement('div')
    deco.className = 'card-deco'

    card.appendChild(deco)
    card.appendChild(content)
    return card
}

export function initGlowPointer()
{
    document.addEventListener('pointermove', (e) =>
    {
        const cx = e.clientX
        const cy = e.clientY

        document.querySelectorAll('.glow-card').forEach(card =>
        {
            const rect = card.getBoundingClientRect()

            // Posição local: pode ser negativa (fora à esquerda/cima) ou > dimensão (fora à direita/baixo)
            const localX = cx - rect.left
            const localY = cy - rect.top

            // Distância euclideana do cursor até o ponto mais próximo do card
            const dx   = Math.max(rect.left - cx, 0, cx - rect.right)
            const dy   = Math.max(rect.top  - cy, 0, cy - rect.bottom)
            const dist = Math.sqrt(dx * dx + dy * dy)

            const opacity = dist < PROXIMITY_PX
                ? (1 - dist / PROXIMITY_PX).toFixed(3)
                : '0'

            card.style.setProperty('--mouse-x',    `${localX.toFixed(1)}px`)
            card.style.setProperty('--mouse-y',    `${localY.toFixed(1)}px`)
            card.style.setProperty('--glow-opacity', opacity)
        })
    })
}
