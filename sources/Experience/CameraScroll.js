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

const DURATION     = 1.2
const HERO_EXIT_MS = 620  // aguarda o texto sair antes de mover a câmera

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

        this.currentIndex    = 0
        this.transitioning   = false  // trava novos eventos de scroll
        this.cameraActive    = false  // lerp da câmera está rodando
        this.transitionStart = 0

        this.fromPosition = POSITIONS[0].position.clone()
        this.fromTarget   = POSITIONS[0].target.clone()
        this.toPosition   = POSITIONS[0].position.clone()
        this.toTarget     = POSITIONS[0].target.clone()

        window.addEventListener('wheel', (e) => this.onWheel(e), { passive: true })

        this.time.on('tick.cameraScroll', () => this.update())
    }

    onWheel(e)
    {
        if(this.transitioning) return

        const dir  = e.deltaY > 0 ? 1 : -1
        const next = this.currentIndex + dir

        if(next < 0 || next >= POSITIONS.length) return

        this.fromPosition.copy(this.camera.modes.debug.instance.position)
        this.fromTarget.copy(this.camera.modes.debug.orbitControls.target)

        this.toPosition.copy(POSITIONS[next].position)
        this.toTarget.copy(POSITIONS[next].target)

        const prevIndex    = this.currentIndex
        this.currentIndex  = next
        this.transitioning = true
        this.cameraActive  = false

        if(prevIndex === 0)
        {
            // saindo da posição 0: texto sai primeiro, câmera espera
            document.dispatchEvent(new CustomEvent('heroExit'))
            setTimeout(() => this.startCamera(), HERO_EXIT_MS)
        }
        else if(prevIndex === 1)
        {
            // saindo da posição 1: cards colapsam primeiro, câmera espera conclusão
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
        if(!this.cameraActive) return

        const raw = (this.time.elapsed - this.transitionStart) / DURATION
        const t   = Math.min(raw, 1)
        const s   = easeInOut(t)

        this.camera.modes.debug.instance.position.lerpVectors(this.fromPosition, this.toPosition, s)
        this.camera.modes.debug.orbitControls.target.lerpVectors(this.fromTarget, this.toTarget, s)
        this.camera.modes.debug.orbitControls.update()

        if(t >= 1)
        {
            this.cameraActive  = false
            this.transitioning = false

            // câmera chegou à posição 0: texto reaparece
            if(this.currentIndex === 0)
            {
                document.dispatchEvent(new CustomEvent('heroEnter'))
            }
        }
    }
}
