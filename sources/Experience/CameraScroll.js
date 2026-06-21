import * as THREE from 'three'
import Experience from './Experience.js'

const POSITIONS = [
    {
        position: new THREE.Vector3( 3.9393,  1.2809,  3.6708),
        target:   new THREE.Vector3(-0.1285,  0.8954, -0.1786)
    },
    {
        position: new THREE.Vector3(-0.1174, -1.2934,  6.0414),
        target:   new THREE.Vector3(-0.0025, -1.2799, -1.7929)
    },
    {
        position: new THREE.Vector3( 0.1127,  2.3284,  7.1234),
        target:   new THREE.Vector3(-0.0025, -1.2799, -1.7929)
    },
    {
        position: new THREE.Vector3( 0.1110,  0.5809,  0.6001),
        target:   new THREE.Vector3(-0.0025, -1.2799, -1.7929)
    }
]

// Steps:
//  0 → cam 0: Hero (tela 1)
//  1 → cam 1: Linha do tempo (tela 2.1)
//  2 → cam 1: Cards (tela 2.2) — mesma câmera, sem movimento
//  3 → cam 2: Buraco negro limpo + frase (tela 3.1)
//  4 → cam 2: APOD (tela 3.2) — mesma câmera, sem movimento
//  5 → cam 2: Fade de entrada (tela 3.3) — DARK_STEP
//  6 → cam 3: Portal de notícias (tela 3.4)
const STEP_TO_CAM = [0, 1, 1, 2, 2, 2, 3]
const N_STEPS     = STEP_TO_CAM.length  // 7

const DURATION     = 1.2
const HERO_EXIT_MS = 620
const DARK_STEP    = 5
const DARK_OPACITY = 0.78
const DARK_LOCK_MS = 600
// Fallback para 'portalExitDone' — espelha PORTAL_EXIT_MS (400ms, transition
// de #news-portal em news-portal.css) + buffer de 30ms, igual ao padrão do APOD.
const PORTAL_EXIT_FALLBACK_MS = 430

function easeInOut(t)
{
    return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2
}

export default class CameraScroll
{
    constructor()
    {
        this.experience = new Experience()
        this.camera     = this.experience.camera
        this.time       = this.experience.time

        this.scrollStep      = 0
        this.currentIndex    = 0
        this.transitioning   = false
        this.cameraActive    = false
        this.transitionStart = 0
        this.scrollDir       = 1

        this.fromPosition = POSITIONS[0].position.clone()
        this.fromTarget   = POSITIONS[0].target.clone()
        this.toPosition   = POSITIONS[0].position.clone()
        this.toTarget     = POSITIONS[0].target.clone()

        window.addEventListener('wheel', (e) => this.onWheel(e), { passive: true })

        this.time.on('tick.cameraScroll', () => this.update())
    }

    _overlay(opacity)
    {
        const el = document.getElementById('fade-overlay')
        if (!el) return
        el.style.transition = 'opacity 0.55s ease'
        el.style.opacity    = opacity
    }

    onWheel(e)
    {
        if (this.transitioning)            return
        if (window.__timelineCapturing)    return   // timeline controla o scroll

        const dir      = e.deltaY > 0 ? 1 : -1
        this.scrollDir = dir
        const nextStep = this.scrollStep + dir

        if (nextStep < 0 || nextStep >= N_STEPS) return

        const prevStep   = this.scrollStep
        const nextCamIdx = STEP_TO_CAM[nextStep]

        this.scrollStep    = nextStep
        this.transitioning = true

        clearTimeout(this._safetyTimer)
        this._safetyTimer = setTimeout(() => { this.transitioning = false }, 2500)

        // ── Step 3 → 4 (frase → APOD): mesma câmera, sem movimento ────────────
        if (prevStep === 3 && nextStep === 4)
        {
            document.dispatchEvent(new CustomEvent('phraseExit'))
            let phraseExitHandled = false
            const finishPhraseExit = () => {
                if (phraseExitHandled) return
                phraseExitHandled = true
                clearTimeout(phraseExitFallback)
                document.removeEventListener('phraseExitDone', finishPhraseExit)
                setTimeout(() => {
                    this._overlay(DARK_OPACITY)
                    this.currentIndex  = 2
                    this.transitioning = false
                    document.dispatchEvent(new CustomEvent('cameraPositionChange', {
                        detail: { index: 2, step: 4, dir: this.scrollDir }
                    }))
                }, 500)
            }
            const phraseExitFallback = setTimeout(finishPhraseExit, 1300)
            document.addEventListener('phraseExitDone', finishPhraseExit)
            return
        }

        // ── Step 4 → 3 (APOD → frase): mesma câmera, sem movimento ────────────
        if (prevStep === 4 && nextStep === 3)
        {
            this._overlay(0)
            document.dispatchEvent(new CustomEvent('apodExit'))
            document.addEventListener('apodExitDone', () => {
                this.currentIndex  = 2
                this.transitioning = false
                document.dispatchEvent(new CustomEvent('cameraPositionChange', {
                    detail: { index: 2, step: 3, dir: this.scrollDir }
                }))
            }, { once: true })
            return
        }

        // ── Entrando no DARK_STEP ──────────────────────────────────────────────
        if (nextStep === DARK_STEP)
        {
            if (prevStep < DARK_STEP)
            {
                // Vindo do APOD (tela 3.2) → o fundo já está em DARK_OPACITY desde a
                // entrada do APOD (3.1→3.2) e não deve ser tocado. Apenas remove o
                // card do APOD da tela.
                document.dispatchEvent(new CustomEvent('apodExit'))
                const finish = () => {
                    setTimeout(() => { this.transitioning = false }, DARK_LOCK_MS)
                    // Nenhum outro evento anuncia a chegada ao DARK_STEP (a câmera não
                    // se move aqui) — dispara cameraPositionChange para que scripts como
                    // news-portal.js saibam que o step mudou de fato.
                    document.dispatchEvent(new CustomEvent('cameraPositionChange', {
                        detail: { index: this.currentIndex, step: DARK_STEP, dir: this.scrollDir }
                    }))
                }
                const fadeFallback = setTimeout(finish, 2200)
                document.addEventListener('apodExitDone', () => {
                    clearTimeout(fadeFallback)
                    finish()
                }, { once: true })
                return
            }

            // Vindo de baixo (portal) → portal sai antes de mover a câmera de volta
            if (prevStep > DARK_STEP)
            {
                document.dispatchEvent(new CustomEvent('portalExit'))
                let portalExitHandled = false
                const moveCameraBack = () => {
                    if (portalExitHandled) return
                    portalExitHandled = true
                    clearTimeout(portalExitFallback)
                    document.removeEventListener('portalExitDone', moveCameraBack)
                    this.fromPosition.copy(this.camera.modes.debug.instance.position)
                    this.fromTarget.copy(this.camera.modes.debug.orbitControls.target)
                    this.toPosition.copy(POSITIONS[STEP_TO_CAM[DARK_STEP]].position)
                    this.toTarget.copy(POSITIONS[STEP_TO_CAM[DARK_STEP]].target)
                    this.currentIndex = STEP_TO_CAM[DARK_STEP]
                    this.cameraActive = false
                    this.startCamera()
                    setTimeout(() => this._overlay(DARK_OPACITY), DURATION * 1000 + 500)
                }
                const portalExitFallback = setTimeout(moveCameraBack, PORTAL_EXIT_FALLBACK_MS)
                document.addEventListener('portalExitDone', moveCameraBack)
                return
            }
        }

        // ── Step 5 → 4 (DARK_STEP → APOD): overlay não muda ─────────────────
        if (prevStep === DARK_STEP && nextStep === 4)
        {
            document.dispatchEvent(new CustomEvent('portalExit'))
            let portalExitHandled = false
            const showApodAgain = () => {
                if (portalExitHandled) return
                portalExitHandled = true
                clearTimeout(portalExitFallback)
                document.removeEventListener('portalExitDone', showApodAgain)
                // #fade-overlay permanece em DARK_OPACITY — não é tocado nesta transição.
                // Apenas o card do APOD reaparece.
                this.currentIndex  = 2
                this.transitioning = false
                document.dispatchEvent(new CustomEvent('cameraPositionChange', {
                    detail: { index: 2, step: 4, dir: this.scrollDir }
                }))
            }
            const portalExitFallback = setTimeout(showApodAgain, PORTAL_EXIT_FALLBACK_MS)
            document.addEventListener('portalExitDone', showApodAgain)
            return
        }

        // ── Saindo do DARK_STEP ───────────────────────────────────────────────
        // O portal vive no próprio DARK_STEP — precisa sair (animação de saída,
        // ~400ms) antes que o overlay comece a clarear ou a câmera se mova.
        if (prevStep === DARK_STEP)
        {
            document.dispatchEvent(new CustomEvent('portalExit'))
            let portalExitHandled = false
            const finishExit = () => {
                if (portalExitHandled) return
                portalExitHandled = true
                clearTimeout(portalExitFallback)
                document.removeEventListener('portalExitDone', finishExit)
                this._overlay(0)
                this.fromPosition.copy(this.camera.modes.debug.instance.position)
                this.fromTarget.copy(this.camera.modes.debug.orbitControls.target)
                this.toPosition.copy(POSITIONS[nextCamIdx].position)
                this.toTarget.copy(POSITIONS[nextCamIdx].target)
                this.currentIndex = nextCamIdx
                this.cameraActive = false
                setTimeout(() => this.startCamera(), 1050)
            }
            const portalExitFallback = setTimeout(finishExit, PORTAL_EXIT_FALLBACK_MS)
            document.addEventListener('portalExitDone', finishExit)
            return
        }

        // ── Step 1 → 2 (timeline → cards): mesma câmera, sem movimento ────────
        if (prevStep === 1 && nextStep === 2)
        {
            this._overlay(0)
            document.dispatchEvent(new CustomEvent('timelineExit'))
            document.addEventListener('timelineExitDone', () => {
                this.currentIndex  = 1
                this.transitioning = false
                document.dispatchEvent(new CustomEvent('cameraPositionChange', {
                    detail: { index: 1, step: 2, dir: this.scrollDir }
                }))
            }, { once: true })
            return
        }

        // ── Step 2 → 1 (cards → timeline): mesma câmera, sem movimento ────────
        if (prevStep === 2 && nextStep === 1)
        {
            this._overlay(0)
            document.dispatchEvent(new CustomEvent('cardsExit'))
            document.addEventListener('cardsExitDone', () => {
                this.currentIndex  = 1
                this.transitioning = false
                document.dispatchEvent(new CustomEvent('cameraPositionChange', {
                    detail: { index: 1, step: 1, dir: this.scrollDir }
                }))
            }, { once: true })
            return
        }

        // ── Qualquer outro step normal: overlay zerado, câmera começa ─────────
        this._overlay(0)

        this.fromPosition.copy(this.camera.modes.debug.instance.position)
        this.fromTarget.copy(this.camera.modes.debug.orbitControls.target)
        this.toPosition.copy(POSITIONS[nextCamIdx].position)
        this.toTarget.copy(POSITIONS[nextCamIdx].target)

        this.currentIndex = nextCamIdx
        this.cameraActive = false

        if (prevStep === 0)
        {
            // Hero → timeline: texto sai, câmera espera
            document.dispatchEvent(new CustomEvent('heroExit'))
            setTimeout(() => this.startCamera(), HERO_EXIT_MS)
        }
        else if (prevStep === 1)
        {
            // Timeline → hero (backward): timeline sai, câmera espera
            document.dispatchEvent(new CustomEvent('timelineExit'))
            document.addEventListener('timelineExitDone', () => this.startCamera(), { once: true })
        }
        else if (prevStep === 2)
        {
            // Cards → tela 3: cards colapsam, câmera espera
            document.dispatchEvent(new CustomEvent('cardsExit'))
            document.addEventListener('cardsExitDone', () => this.startCamera(), { once: true })
        }
        else if (prevStep === 3)
        {
            // Tela 3 (frase) → cards (backward): frase sai, câmera espera
            document.dispatchEvent(new CustomEvent('phraseExit'))
            const fallback = setTimeout(() => this.startCamera(), 2000)
            document.addEventListener('phraseExitDone', () => {
                clearTimeout(fallback)
                this.startCamera()
            }, { once: true })
        }
        else
        {
            this.startCamera()
        }
    }

    startCamera()
    {
        this.transitionStart = this.time.elapsed
        this.cameraActive    = true

        document.dispatchEvent(new CustomEvent('cameraPositionChange', {
            detail: { index: this.currentIndex, step: this.scrollStep, dir: this.scrollDir }
        }))
    }

    update()
    {
        if (!this.cameraActive) return

        const raw = (this.time.elapsed - this.transitionStart) / DURATION
        const t   = Math.min(raw, 1)
        const s   = easeInOut(t)

        this.camera.modes.debug.instance.position.lerpVectors(this.fromPosition, this.toPosition, s)
        this.camera.modes.debug.orbitControls.target.lerpVectors(this.fromTarget, this.toTarget, s)
        this.camera.modes.debug.orbitControls.update()

        if (t >= 1)
        {
            this.cameraActive  = false
            this.transitioning = false

            if (this.currentIndex === 0)
            {
                document.dispatchEvent(new CustomEvent('heroEnter'))
            }
        }
    }
}
