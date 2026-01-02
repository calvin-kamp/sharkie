import { assets } from '@root/utils/assets'

import { Player } from '@models/player.model'
import { Enemy } from '@models/enemy.model'
import { Light } from '@models/light.model'
import { Background } from '@models/background.model'
import { MovableObject } from '@models/movable-object.model'

export class World {
    player = new Player({
        imageSrc: assets.player.state('idle-1.png', 'idle'),
    })

    lights = [
        new Light({
            imageSrc: assets.backgrounds.layer('light-2.png', 'light'),
        }),
    ]

    backgrounds = [
        new Background({
            imageSrc: assets.backgrounds.layer('background-1-light-1.png', 'background-1'),
        }),
    ]

    enemies = [
        new Enemy({
            imageSrc: assets.enemies.jellyfish('regular-purple-1.png', 'regular', 'purple'),
        }),
        new Enemy({
            imageSrc: assets.enemies.pufferfish('orange-swim-1.png', 'swim', 'orange'),
        }),
        new Enemy({
            imageSrc: assets.enemies.jellyfish('super-dangerous-green-1.png', 'super-dangerous', 'green'),
        }),
    ]

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D | null

    constructor($canvas: HTMLCanvasElement) {
        this.canvas = $canvas
        this.ctx = $canvas.getContext('2d')
    }

    draw() {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.addToCanvas(this.player)

        this.addObjectToCanvas(this.lights)
        this.addObjectToCanvas(this.enemies)
        this.addObjectToCanvas(this.backgrounds)

        requestAnimationFrame(() => this.draw())
    }

    addObjectToCanvas(movableObjects: MovableObject[]) {
        for (const movableObject of movableObjects) {
            this.addToCanvas(movableObject)
        }
    }

    addToCanvas(movableObject: MovableObject) {
        this.ctx?.drawImage(
            movableObject.img,
            movableObject.x,
            movableObject.y,
            movableObject.width,
            movableObject.height
        )
    }
}

