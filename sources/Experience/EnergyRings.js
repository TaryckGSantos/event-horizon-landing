import * as THREE from 'three'
import Experience from './Experience.js'

import vertexShader from './shaders/energyRings/vertex.glsl'
import fragmentShader from './shaders/energyRings/fragment.glsl'

const FLOW_OPACITY = 0.22  // 0–1 — aumentar para glow mais visível
const FLOW_SCALE   = 12    // unidades de mundo — aumentar para expandir

export default class EnergyRings
{
    constructor()
    {
        this.experience = new Experience()
        this.scenes     = this.experience.scenes
        this.time       = this.experience.time
        this.camera     = this.experience.camera

        this.setMesh()
    }

    setMesh()
    {
        this.geometry = new THREE.PlaneGeometry(1, 1)

        this.material = new THREE.RawShaderMaterial({
            glslVersion: THREE.GLSL3,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
            transparent: true,
            uniforms:
            {
                uTime:    { value: 0 },
                uOpacity: { value: FLOW_OPACITY }
            },
            vertexShader,
            fragmentShader
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.scale.set(FLOW_SCALE, FLOW_SCALE, FLOW_SCALE)
        this.mesh.frustumCulled = false

        this.scenes.space.add(this.mesh)
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed
        this.mesh.lookAt(this.camera.instance.position)
    }
}
