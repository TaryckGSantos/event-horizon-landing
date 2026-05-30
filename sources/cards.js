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

    let revealTimer = null
    let hideTimer   = null
    let revealed    = false

    function reveal()
    {
        revealed = true
        overlay.classList.add('is-visible')

        const cards = getCards()

        // Reset síncrono para o estado inicial
        cards.forEach(card => {
            card.style.transition = 'none'
            card.style.clipPath   = 'inset(0 100% 0 0)'
            card.style.opacity    = '0'
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

        if (index === 1) {
            // Aguarda câmera chegar + buffer
            revealTimer = setTimeout(reveal, CAMERA_MS + EXTRA_MS)
        } else if (revealed) {
            hide()
        }
    })
}

init()
