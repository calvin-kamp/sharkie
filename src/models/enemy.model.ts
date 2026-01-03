import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'
import { getRandomNumber } from '@root/utils/helper'

type EnemyType = 'pufferfish' | 'jellyfish' | 'boss'

export class Enemy extends MovableObject {
    private type: EnemyType
    private reachedCanvasLeftEnd: boolean = false
    private reachedCanvasTopEnd: boolean = false
    private reachedCanvasBottomEnd: boolean = false
    private moveIntervalId: number | null = null

    private imagesSwim: string[]
    private currentImage: number = 0

    private canvasHeight = 480
    private yDirection: 1 | -1 = 1
    private ySpeed = 0.5
    private xSpeed = 0.5

    constructor(config: MovableObjectConfig, type: EnemyType, imagesSwim: string[]) {
        super(config)

        this.y = config.y ?? getRandomNumber(100, 400)
        this.x = config.x ?? getRandomNumber(200, 700)

        this.type = type
        this.imagesSwim = imagesSwim

        this.cacheImages(this.imagesSwim)
        this.animate()
    }

    private animate() {
        if (this.moveIntervalId !== null) return

        this.moveIntervalId = window.setInterval(() => {
            if (this.type === 'pufferfish' || this.type === 'boss') {
                this.x -= this.xSpeed
                this.hasreachedCanvasLeftEnd()

                if (this.reachedCanvasLeftEnd) {
                    this.stopMoving()
                }
                return
            }

            if (this.type === 'jellyfish') {
                this.y += this.ySpeed * this.yDirection

                this.hasReachedCanvasTopEnd()
                this.hasReachedCanvasBottomEnd()

                if (this.reachedCanvasTopEnd) {
                    this.yDirection = 1
                    this.reachedCanvasTopEnd = false
                }

                if (this.reachedCanvasBottomEnd) {
                    this.yDirection = -1
                    this.reachedCanvasBottomEnd = false
                }
            }
        }, 1000 / 60)

        setInterval(() => {
            const i = this.currentImage % this.cachedImages.length
            this.img = this.cachedImages[i]
            this.currentImage++
        }, 1000 / this.cachedImages.length)
    }

    private stopMoving() {
        if (this.moveIntervalId === null) return
        clearInterval(this.moveIntervalId)
        this.moveIntervalId = null
    }

    private hasReachedCanvasTopEnd() {
        if (this.y <= 0) {
            this.reachedCanvasTopEnd = true
            this.y = 0
        }
    }

    private hasReachedCanvasBottomEnd() {
        const bottom = this.canvasHeight - this.calculatedHeight

        if (this.y >= bottom) {
            this.reachedCanvasBottomEnd = true
            this.y = bottom
        }
    }

    private hasreachedCanvasLeftEnd() {
        if (this.x <= 0) {
            this.reachedCanvasLeftEnd = true
            this.x = 0
        }
    }
}
