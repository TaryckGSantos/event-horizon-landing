import BlackHole from './BlackHole.js'
import Experience from './Experience.js'
import Stars from './Stars.js'
import Spaceship from './Spaceship.js'
import NebulaGlow from './NebulaGlow.js'
import EnergyRings from './EnergyRings.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scenes = this.experience.scenes
        this.resources = this.experience.resources

        this.blackHole   = new BlackHole()
        this.stars       = new Stars()
        this.nebulaGlow  = new NebulaGlow()
        this.energyRings = new EnergyRings()
        // this.resources.on('groupEnd', (_group) =>
        // {
        //     if(_group.name === 'base')
        //     {
        //         this.spaceship = new Spaceship()
        //     }
        // })
    }

    resize()
    {        
        if(this.blackHole)
            this.blackHole.resize()
    }

    update()
    {
        if(this.blackHole)
            this.blackHole.update()

        if(this.stars)
            this.stars.update()

        if(this.nebulaGlow)
            this.nebulaGlow.update()

        if(this.energyRings)
            this.energyRings.update()

        // if(this.spaceship)
        //     this.spaceship.update()
    }

    destroy()
    {
    }
}