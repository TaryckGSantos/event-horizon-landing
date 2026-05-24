import { createGlowCard, initGlowPointer } from './components/ui/spotlight-card.js'

// Deve coincidir com DURATION em CameraScroll.js (1.2s)
const CAMERA_MS  = 1200
const EXTRA_MS   = 200   // buffer após câmera chegar
const STAGGER_MS = 220   // delay entre cada card
const REVEAL_MS  = 3000
const HIDE_MS    = 250
const EASING     = 'cubic-bezier(0.16, 1, 0.3, 1)'

const CARDS_DATA = [
    {
        title:       'Gravidade',
        description: 'Experiências digitais que atraem atenção sem precisar gritar.'
    },
    {
        title:       'Profundidade',
        description: 'Interfaces visuais com presença, ritmo e atmosfera.'
    },
    {
        title:       'Horizonte',
        description: 'Cada detalhe conduz o usuário para o próximo passo.'
    }
]

function init()
{
    const overlay = document.getElementById('cards-overlay')
    const row     = overlay.querySelector('.cards-row')

    CARDS_DATA.forEach(data => row.appendChild(createGlowCard(data)))
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
