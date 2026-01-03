import { assets } from '@root/utils/assets'

import { Player } from '@models/player.model'
import { Enemy } from '@models/enemy.model'
import { Light } from '@models/light.model'
import { Background } from '@models/background.model'
import { MovableObject } from '@models/movable-object.model'

export class World {
    player = new Player({
        imageSrc: assets.player.state('idle-1.png', 'idle'),
        width: 250,
        aspectRatio: 815 / 1000
    })

    lights = [
        new Light({
            imageSrc: assets.backgrounds.layer('light-2.png', 'light'),
        }),
    ]

    backgrounds = [
        new Background({
            imageSrc: assets.backgrounds.layer('light-1.png', 'water'),
            x: -180,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-2-light-1.png', 'background-2'),
            x: -180,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-1-light-1.png', 'background-1'),
            x: -180,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-1.png', 'floor'),
            x: -180,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-2.png', 'water'),
            x: 540,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-2-light-2.png', 'background-2'),
            x: 540,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-1-light-2.png', 'background-1'),
            x: 540,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-2.png', 'floor'),
            x: 540,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-1.png', 'water'),
            x: 1260,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-2-light-1.png', 'background-2'),
            x: 1260,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-1-light-1.png', 'background-1'),
            x: 1260,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-1.png', 'floor'),
            x: 1260,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-2.png', 'water'),
            x: 1980,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-2-light-2.png', 'background-2'),
            x: 1980,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-1-light-2.png', 'background-1'),
            x: 1980,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-2.png', 'floor'),
            x: 1980,
            width: 720
        }),
    ]

    enemies = [
        new Enemy({
            imageSrc: assets.enemies.jellyfish('regular-purple-1.png', 'regular', 'purple'),
            width: 100,
            aspectRatio: 300 / 211}, 
            'jellyfish', 
            [
                assets.enemies.jellyfish('regular-purple-1.png', 'regular', 'purple'),
                assets.enemies.jellyfish('regular-purple-2.png', 'regular', 'purple'),
                assets.enemies.jellyfish('regular-purple-3.png', 'regular', 'purple'),
                assets.enemies.jellyfish('regular-purple-4.png', 'regular', 'purple')
            ]
        ),
        new Enemy({
            imageSrc: assets.enemies.pufferfish('orange-swim-1.png', 'swim', 'orange'),
            aspectRatio: 241 / 198}, 
            'pufferfish', 
            [
                assets.enemies.pufferfish('orange-swim-1.png', 'swim', 'orange'),
                assets.enemies.pufferfish('orange-swim-2.png', 'swim', 'orange'),
                assets.enemies.pufferfish('orange-swim-3.png', 'swim', 'orange'),
                assets.enemies.pufferfish('orange-swim-4.png', 'swim', 'orange'),
                assets.enemies.pufferfish('orange-swim-5.png', 'swim', 'orange')
            ]
        ),
        new Enemy({
            imageSrc: assets.enemies.jellyfish('super-dangerous-green-1.png', 'super-dangerous', 'green'),
            width: 150,
            aspectRatio: 300 / 211},
            'jellyfish', 
            [
                assets.enemies.jellyfish('super-dangerous-green-1.png', 'super-dangerous', 'green'),
                assets.enemies.jellyfish('super-dangerous-green-2.png', 'super-dangerous', 'green'),
                assets.enemies.jellyfish('super-dangerous-green-3.png', 'super-dangerous', 'green'),
                assets.enemies.jellyfish('super-dangerous-green-4.png', 'super-dangerous', 'green')
            ]
        ),
    ]

    cameraOffset: number = 0
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D | null

    constructor($canvas: HTMLCanvasElement) {
        this.canvas = $canvas
        this.ctx = $canvas.getContext('2d')

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

