import { MovableObject } from '@models/movable-object.model'

export class World {
    player
    lights
    backgrounds
    enemies

    cameraOffset: number = 0
    
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D | null

    constructor($canvas: HTMLCanvasElement, level) {
        this.canvas = $canvas
        this.ctx = $canvas.getContext('2d')

        this.player = level.player
        this.lights = level.lights
        this.backgrounds = level.backgrounds
        this.enemies = level.enemies

        this.givePlayerWorldProperties()
    }

    givePlayerWorldProperties() {
        this.player. world = this
    }

    draw() {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx?.translate(this.cameraOffset, 0)
        
        this.addObjectToCanvas(this.backgrounds)
        this.addObjectToCanvas(this.lights)
        this.addObjectToCanvas(this.enemies)
        this.addToCanvas(this.player)
        
        this.ctx?.translate(-this.cameraOffset, 0)
        
        requestAnimationFrame(() => this.draw())
    }

    addObjectToCanvas(movableObjects: MovableObject[]) {
        for (const movableObject of movableObjects) {
            this.addToCanvas(movableObject)
        }
    }

    addToCanvas(movableObject: MovableObject) {

        if(movableObject.directionLeft) {
            this.ctx?.save()
            this.ctx?.translate(movableObject.width, 0)
            this.ctx?.scale(-1, 1)
            movableObject.x = movableObject.x * - 1
        }

        this.ctx?.drawImage(
            movableObject.img,
            movableObject.x,
            movableObject.y,
            movableObject.width,
            movableObject.calculatedHeight
        )

        if(movableObject.directionLeft) {
            movableObject.x = movableObject.x * - 1
            this.ctx?.restore()
        }
    }
}

