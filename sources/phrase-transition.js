import { animate, stagger } from 'framer-motion/dom'

const CAMERA_MS     = 1200
const EXTRA_MS      = 200
const CHAR_DURATION = 0.5
const STAGGER_DELAY = 0.04

const container = document.getElementById('phrase-transition')
const textEl    = container.querySelector('.phrase-text')

// Split text into individual character spans
const text = textEl.textContent
textEl.innerHTML = [...text].map(char =>
    `<span class="phrase-char">${char === ' ' ? ' ' : char}</span>`
).join('')

const chars = [...textEl.querySelectorAll('.phrase-char')]

// Start all chars invisible
chars.forEach(c => { c.style.opacity = '0' })

// Total exit duration: last char exits first (delay=0), first char exits last
const EXIT_TOTAL_MS = (chars.length - 1) * STAGGER_DELAY * 1000 + CHAR_DURATION * 1000 + 80

let isVisible    = false
let atCamIndex2  = false
let revealTimer  = null
let inDarkStep   = false
let inApodStep   = false

const DARK_STEP = 5
const APOD_STEP = 4

function show() {
    if (!atCamIndex2) return
    isVisible = true
    animate(
        chars,
        { opacity: [0, 1], filter: ['blur(10px)', 'blur(0px)'], y: [20, 0] },
        { duration: CHAR_DURATION, delay: stagger(STAGGER_DELAY), ease: 'easeOut' }
    )
}

function hide(onDone) {
    if (!isVisible && !onDone) return
    isVisible = false
    animate(
        chars,
        { opacity: [1, 0], filter: ['blur(0px)', 'blur(10px)'], y: [0, -20] },
        { duration: CHAR_DURATION, delay: stagger(STAGGER_DELAY, { from: 'last' }), ease: 'easeIn' }
    )
    if (onDone) setTimeout(onDone, EXIT_TOTAL_MS)
}

document.addEventListener('cameraPositionChange', (e) => {
    const { index, step } = e.detail
    clearTimeout(revealTimer)

    const prev  = atCamIndex2
    atCamIndex2 = (index === 2)

    if (atCamIndex2) {
        if (step === DARK_STEP) {
            inDarkStep = true
        } else if (step === APOD_STEP) {
            // Tela APOD — não exibe a frase; registra passagem para reexibir ao voltar
            inApodStep = true
            if (isVisible) hide()
        } else if (inDarkStep || inApodStep || !prev) {
            // Voltando do DARK ou APOD para a frase, ou entrada normal vinda da tela 2
            inDarkStep = false
            inApodStep = false
            revealTimer = setTimeout(show, CAMERA_MS + EXTRA_MS)
        }
    } else if (isVisible) {
        hide()
    }
})

document.addEventListener('phraseExit', () => {
    clearTimeout(revealTimer)
    atCamIndex2 = false

    if (!isVisible) {
        document.dispatchEvent(new CustomEvent('phraseExitDone'))
        return
    }

    hide(() => document.dispatchEvent(new CustomEvent('phraseExitDone')))
})
