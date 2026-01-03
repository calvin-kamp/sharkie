import { assets } from '@root/utils/assets'
import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'

/**
 * @TODO add methods for attacks + animation 
 * type AttackType = 'bubble' | 'bubble-poisoned' | 'slam'
 */

export class Player extends MovableObject {

    private imagesSwim: string[]
    private imagesIdle: string[]
    private imagesLongIdle: string[]
    private currentImage: number = 0

    world: undefined

    private rightKeyPressed: boolean
    private leftKeyPressed: boolean
    private topKeyPressed: boolean
    private bottomKeyPressed: boolean

    constructor(config: MovableObjectConfig) {
        super(config)

        this.rightKeyPressed = false
        this.leftKeyPressed = false
        this.topKeyPressed = false
        this.bottomKeyPressed = false

        this.imagesSwim = [
            assets.player.state('swim-2.png', 'swim'),
            assets.player.state('swim-3.png', 'swim'),
            assets.player.state('swim-5.png', 'swim'),
            assets.player.state('swim-6.png', 'swim'),
        ]

        this.imagesIdle = [
            assets.player.state('idle-1.png', 'idle'),
            assets.player.state('idle-2.png', 'idle'),
            assets.player.state('idle-3.png', 'idle'),
            assets.player.state('idle-4.png', 'idle'),
            assets.player.state('idle-5.png', 'idle'),
            assets.player.state('idle-6.png', 'idle'),
            assets.player.state('idle-7.png', 'idle'),
            assets.player.state('idle-8.png', 'idle'),
            assets.player.state('idle-9.png', 'idle'),
            assets.player.state('idle-10.png', 'idle'),
            assets.player.state('idle-11.png', 'idle'),
            assets.player.state('idle-12.png', 'idle'),
            assets.player.state('idle-13.png', 'idle'),
            assets.player.state('idle-14.png', 'idle'),
            assets.player.state('idle-15.png', 'idle'),
            assets.player.state('idle-16.png', 'idle'),
            assets.player.state('idle-17.png', 'idle'),
            assets.player.state('idle-18.png', 'idle')
        ]

        this.imagesLongIdle = [
            assets.player.state('long-idle-1.png', 'long-idle'),
            assets.player.state('long-idle-2.png', 'long-idle'),
            assets.player.state('long-idle-3.png', 'long-idle'),
            assets.player.state('long-idle-4.png', 'long-idle'),
            assets.player.state('long-idle-5.png', 'long-idle'),
            assets.player.state('long-idle-6.png', 'long-idle'),
            assets.player.state('long-idle-7.png', 'long-idle'),
            assets.player.state('long-idle-8.png', 'long-idle'),
            assets.player.state('long-idle-9.png', 'long-idle'),
            assets.player.state('long-idle-10.png', 'long-idle'),
            assets.player.state('long-idle-11.png', 'long-idle'),
            assets.player.state('long-idle-12.png', 'long-idle'),
            assets.player.state('long-idle-13.png', 'long-idle'),
            assets.player.state('long-idle-14.png', 'long-idle')
        ]

        this.cacheImages(this.imagesSwim)
        this.addEventTriggers()
        this.animate()
    }

    private animate() {

        setInterval(() => {

            if(this.rightKeyPressed) {
                this.x += 2.5
                this.world.cameraOffset = -this.x
                this.directionLeft = false
            }

            if(this.leftKeyPressed) {
                this.x -= 2.5
                this.world.cameraOffset = -this.x
                this.directionLeft = true
            }

            if(this.topKeyPressed) {
                this.y -= 2.5
            }

            if(this.bottomKeyPressed) {
                this.y += 2.5
            }
            
        }, 1000 / 60);

        setInterval(() => {

            if(this.rightKeyPressed || this.leftKeyPressed || this.topKeyPressed || this.bottomKeyPressed) {

                const i = this.currentImage % this.cachedImages.length
    
                this. img = this.cachedImages[i]
                this.currentImage++
            }

        }, 1000 / this.cachedImages.length)

    }

    private addEventTriggers() {
        document.addEventListener('keydown', (e) => {
    
            if(e.key === 'd' || e.key === 'ArrowRight') {
                this.rightKeyPressed = true
            }
        
            if(e.key === 'a' || e.key === 'ArrowLeft') {
                this.leftKeyPressed = true
            }
        
            if(e.key === 'w' || e.key === 'ArrowUp') {
                this.topKeyPressed = true
            }
        
            if(e.key === 's' || e.key === 'ArrowDown') {
                this.bottomKeyPressed = true
            }
        
        })
        
        document.addEventListener('keyup', (e) => {
        
            if(e.key === 'd' || e.key === 'ArrowRight') {
                this.rightKeyPressed = false
            }
        
            if(e.key === 'a' || e.key === 'ArrowLeft') {
                this.leftKeyPressed = false
            }
        
            if(e.key === 'w' || e.key === 'ArrowUp') {
                this.topKeyPressed = false
            }
        
            if(e.key === 's' || e.key === 'ArrowDown') {
                this.bottomKeyPressed = false
            }
        
        })
    }

    jump() {}
}
