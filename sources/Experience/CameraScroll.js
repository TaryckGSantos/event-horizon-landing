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

// Mapeamento: scrollStep → índice de posição de câmera
// step 3 = Tela 3 escura — reutiliza câmera do step 2, sem movimento
const STEP_TO_CAM = [0, 1, 2, 2, 3]
const N_STEPS     = STEP_TO_CAM.length   // 5 passos no total

const DURATION     = 1.2
const HERO_EXIT_MS = 620
const DARK_STEP    = 3      // step que representa a Tela 3 escura
const DARK_OPACITY = 0.78   // opacidade do overlay preto na Tela 3 escura
const DARK_LOCK_MS = 600    // ms bloqueados enquanto o overlay anima

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
        if (this.transitioning) return

        const dir      = e.deltaY > 0 ? 1 : -1
        const nextStep = this.scrollStep + dir

        if (nextStep < 0 || nextStep >= N_STEPS) return

        const prevStep   = this.scrollStep
        const nextCamIdx = STEP_TO_CAM[nextStep]

        this.scrollStep    = nextStep
        this.transitioning = true

        // Failsafe: garante que transitioning nunca fica preso indefinidamente
        clearTimeout(this._safetyTimer)
        this._safetyTimer = setTimeout(() => { this.transitioning = false }, 2000)

        // Entrando no DARK_STEP
        if (nextStep === DARK_STEP)
        {
            this._overlay(DARK_OPACITY)

            // Caso 1: vindo da Tela 3 normal para Tela 3 escura
            // Não precisa mover a câmera, apenas escurece.
            if (prevStep < DARK_STEP)
            {
                setTimeout(() => { this.transitioning = false }, DARK_LOCK_MS)
                return
            }

            // Caso 2: vindo da Tela 5 para Tela 3 escura
            // Precisa voltar a câmera para a posição da Tela 3.
            if (prevStep > DARK_STEP)
            {
                this.fromPosition.copy(this.camera.modes.debug.instance.position)
                this.fromTarget.copy(this.camera.modes.debug.orbitControls.target)

                this.toPosition.copy(POSITIONS[STEP_TO_CAM[DARK_STEP]].position)
                this.toTarget.copy(POSITIONS[STEP_TO_CAM[DARK_STEP]].target)

                this.currentIndex = STEP_TO_CAM[DARK_STEP]
                this.cameraActive = false

                this.startCamera()
                return
            }
        }

        // Saindo do DARK_STEP: overlay some primeiro, câmera começa depois
        if (prevStep === DARK_STEP)
        {
            this._overlay(0)
            this.fromPosition.copy(this.camera.modes.debug.instance.position)
            this.fromTarget.copy(this.camera.modes.debug.orbitControls.target)
            this.toPosition.copy(POSITIONS[nextCamIdx].position)
            this.toTarget.copy(POSITIONS[nextCamIdx].target)
            this.currentIndex = nextCamIdx
            this.cameraActive = false
            setTimeout(() => this.startCamera(), 550)
            return
        }

        // Qualquer outro step normal: overlay zerado, câmera começa imediatamente
        this._overlay(0)

        this.fromPosition.copy(this.camera.modes.debug.instance.position)
        this.fromTarget.copy(this.camera.modes.debug.orbitControls.target)
        this.toPosition.copy(POSITIONS[nextCamIdx].position)
        this.toTarget.copy(POSITIONS[nextCamIdx].target)

        this.currentIndex = nextCamIdx
        this.cameraActive = false

        if (prevStep === 0)
        {
            // saindo da Tela 1: texto sai primeiro, câmera espera
            document.dispatchEvent(new CustomEvent('heroExit'))
            setTimeout(() => this.startCamera(), HERO_EXIT_MS)
        }
        else if (prevStep === 1)
        {
            // saindo da Tela 2: cards colapsam primeiro, câmera espera conclusão
            document.dispatchEvent(new CustomEvent('cardsExit'))
            document.addEventListener('cardsExitDone', () => this.startCamera(), { once: true })
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
            detail: { index: this.currentIndex }
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
