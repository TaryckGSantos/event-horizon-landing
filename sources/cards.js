import { createGlowCard, initGlowPointer } from './components/ui/spotlight-card.js'

// Deve coincidir com DURATION em CameraScroll.js (1.2s)
const CAMERA_MS  = 1200
const EXTRA_MS   = 200   // buffer após câmera chegar
const STAGGER_MS = 220   // delay entre cada card
const REVEAL_MS  = 3000
const HIDE_MS    = 250
const EASING     = 'cubic-bezier(0.16, 1, 0.3, 1)'

const GRAVIDADE_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6" stroke-dasharray="2 2.5"/><circle cx="12" cy="12" r="10" stroke-dasharray="1.5 3"/></svg>`

const PROFUNDIDADE_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L22 9 12 15 2 9z"/><path d="M2 14l10 6 10-6"/></svg>`

const HORIZONTE_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="2" y1="14" x2="22" y2="14"/><path d="M6 14a6 6 0 0 1 12 0"/></svg>`

const CARDS_DATA = [
    {
        icon:        GRAVIDADE_ICON,
        title:       'Gravidade',
        description: 'Experiências digitais que atraem atenção sem precisar gritar.'
    },
    {
        icon:        PROFUNDIDADE_ICON,
        title:       'Profundidade',
        description: 'Interfaces visuais com presença, ritmo e atmosfera.'
    },
    {
        icon:        HORIZONTE_ICON,
        title:       'Horizonte',
        description: 'Cada detalhe conduz o usuário para o próximo passo.'
    }
]

function init()
{
    const overlay = document.getElementById('cards-overlay')
    const row     = overlay.querySelector('.cards-row')

    CARDS_DATA.forEach((data, i) => {
        row.appendChild(createGlowCard(data))
        if (i < CARDS_DATA.length - 1) {
            const divider = document.createElement('div')
            divider.className = 'card-divider'
            row.appendChild(divider)
        }
    })
    initGlowPointer()

    const getCards = () => [...row.querySelectorAll('.glow-card')]

    // Estado inicial: todos ocultos via clip-path
    getCards().forEach(card => {
        card.style.clipPath = 'inset(0 100% 0 0)'
        card.style.opacity  = '0'
    })

    let revealTimer  = null
    let hideTimer    = null
    let revealed     = false
    let clearClipIds = []

    function reveal()
    {
        clearClipIds.forEach(clearTimeout)
        clearClipIds = []

        revealed = true
        overlay.classList.add('is-visible')

        const cards = getCards()

        // Reset síncrono para o estado inicial (inclui propriedades da animação de saída)
        cards.forEach(card => {
            card.style.transition = 'none'
            card.style.clipPath   = 'inset(0 100% 0 0)'
            card.style.opacity    = '0'
            card.style.filter     = ''

            const icon    = card.querySelector('.card-icon-wrap')
            const content = card.querySelector('.glow-card-content')
            ;[icon, content].forEach(el => {
                if (!el) return
                el.style.transition = 'none'
                el.style.opacity    = ''
            })
        })

        // Força reflow para comprometer o estado inicial antes das transições
        void overlay.offsetHeight

        // Revelação em cortina com stagger
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.style.transition =
                    `clip-path ${REVEAL_MS}ms ${EASING}, ` +
                    `opacity   ${2500}ms ${EASING}`
                card.style.clipPath = 'inset(0 0% 0 0)'
                card.style.opacity  = '1'
            }, i * 800)

            // Remove o clip-path ao final da animação para restaurar renderização simétrica
            clearClipIds.push(setTimeout(() => {
                card.style.clipPath = ''
            }, i * 800 + REVEAL_MS))
        })
    }

    function hide()
    {
        revealed = false

        const cards = getCards()

        cards.forEach(card => {
            card.style.transition = `opacity ${HIDE_MS}ms ease`
            card.style.opacity    = '0'
        })

        hideTimer = setTimeout(() => {
            overlay.classList.remove('is-visible')
            cards.forEach(card => {
                card.style.transition = 'none'
                card.style.clipPath   = 'inset(0 100% 0 0)'
            })
        }, 1500)
    }

    document.addEventListener('cameraPositionChange', (e) => {
        const { index } = e.detail

        clearTimeout(revealTimer)
        clearTimeout(hideTimer)

        if (e.detail.step === 2) {
            // Aguarda câmera chegar + buffer + delay pós-frase
            revealTimer = setTimeout(reveal, CAMERA_MS + EXTRA_MS + 350)
        } else if (revealed) {
            hide()
        }
    })

    document.addEventListener('cardsExit', () => {
        clearTimeout(revealTimer)
        clearTimeout(hideTimer)

        if (!revealed) {
            // Cards não estão visíveis — sinaliza conclusão imediata
            document.dispatchEvent(new CustomEvent('cardsExitDone'))
            return
        }

        const cards = getCards()

        // Passo 1 — fade do conteúdo (ícone + texto)
        cards.forEach(card => {
            const icon    = card.querySelector('.card-icon-wrap')
            const content = card.querySelector('.glow-card-content')
            ;[icon, content].forEach(el => {
                if (!el) return
                el.style.transition = 'opacity 150ms ease'
                el.style.opacity    = '0'
            })
        })

        // Passo 2 — colapso em ordem inversa: direita → centro → esquerda
        const EASING_OUT  = 'cubic-bezier(0.4, 0, 1, 1)'
        const COLLAPSE_MS = 420
        const STAGGER_MS  = 80
        const ORDER       = [2, 1, 0]

        setTimeout(() => {
            ORDER.forEach((cardIdx, i) => {
                const card = cards[cardIdx]
                if (!card) return
                setTimeout(() => {
                    card.style.transition =
                        `clip-path ${COLLAPSE_MS}ms ${EASING_OUT}, ` +
                        `filter    ${COLLAPSE_MS}ms ${EASING_OUT}, ` +
                        `opacity   ${COLLAPSE_MS}ms ${EASING_OUT}`
                    card.style.clipPath = 'inset(50% 50%)'
                    card.style.filter   = 'blur(6px)'
                    card.style.opacity  = '0'
                }, i * STAGGER_MS)
            })

            // Aguarda o último card terminar antes de sinalizar
            const waitMs = STAGGER_MS * (ORDER.length - 1) + COLLAPSE_MS
            setTimeout(() => {
                revealed = false
                overlay.classList.remove('is-visible')
                document.dispatchEvent(new CustomEvent('cardsExitDone'))
            }, waitMs)
        }, 150)
    })
}

init()
