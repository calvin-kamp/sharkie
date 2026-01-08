import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'
import { getRandomNumber } from '@root/utils/helper'

export type EnemyType = 'pufferfish' | 'jellyfish' | 'boss'
type EnemyState = 'swim' | 'hurt' | 'dead'

export interface EnemyFrames {
    swim: string[]
    dead: string[]
    hurt?: string[]
}

export interface EnemyOptions {
    maxHp?: number
    hp?: number
    damage?: number
}

export class Enemy extends MovableObject {
    readonly type: EnemyType
    private state: EnemyState = 'swim'

    private reachedCanvasLeftEnd = false
    private reachedCanvasTopEnd = false
    private reachedCanvasBottomEnd = false

    private moveIntervalId: number | null = null
    private animIntervalId: number | null = null

    private frames: EnemyFrames
    private currentImage = 0

    private readonly canvasHeight = 480
    private yDirection: 1 | -1 = 1
    private readonly ySpeed = 0.5
    private readonly xSpeed = 0.5

    private readonly ANIM_FPS = {
        swim: 8,
        hurt: 8,
        dead: 8,
    } as const

    private frozen = false

    baseMaxHp: number
    baseDamage: number

    maxHp: number
    hp: number
    damage: number

    constructor(
        config: MovableObjectConfig,
        type: EnemyType,
        frames: EnemyFrames,
        options: EnemyOptions = {}
    ) {
        super(config)

        this.y = config.y ?? getRandomNumber(100, 400)
        this.x = config.x ?? getRandomNumber(200, 700)

        this.type = type
        this.frames = frames

        this.baseMaxHp = options.maxHp ?? 100
        this.baseDamage = options.damage ?? 10

        this.maxHp = this.baseMaxHp
        this.damage = this.baseDamage
        this.hp = typeof options.hp === 'number' ? options.hp : this.maxHp

        this.setState('swim')
        this.startMovement()
    }

    getType(): EnemyType {
        return this.type
    }

    get isDead() {
        return this.hp <= 0
    }

    setBaseCombat(combat: EnemyOptions) {
        if (typeof combat.maxHp === 'number') {
            this.baseMaxHp = combat.maxHp
        }

        if (typeof combat.damage === 'number') {
            this.baseDamage = combat.damage
        }  

        this.maxHp = this.baseMaxHp
        this.damage = this.baseDamage

        const initialHp = combat.hp
        
        this.hp =
            typeof initialHp === 'number'
                ? Math.min(this.maxHp, Math.max(0, initialHp))
                : this.maxHp
    }

    takeDamage(amount: number) {
        if (this.state === 'dead') {
            return
        }

        this.hp = Math.max(0, this.hp - Math.max(0, amount))

        if (this.hp <= 0) {
            this.die()
            
            return
        }

        if (
            this.type === 'pufferfish' &&
            this.hp <= this.maxHp * 0.5 &&
            this.frames.hurt?.length &&
            this.state === 'swim'
        ) {
            this.setState('hurt')
        }
    }

    freeze() {
        if (this.frozen) {
            return
        }

        this.frozen = true

        if (this.moveIntervalId !== null) {
            clearInterval(this.moveIntervalId)
            this.moveIntervalId = null
        }

        if (this.animIntervalId !== null) {
            clearInterval(this.animIntervalId)
            this.animIntervalId = null
        }
    }

    unfreeze() {
        if (!this.frozen) {
            return
        }

        this.frozen = false

        if (this.state !== 'dead') {
            this.startMovement()
            
            const fps = this.state === 'hurt' ? this.ANIM_FPS.hurt : this.ANIM_FPS.swim
            
            this.restartAnimation(true, fps)
        }
    }

    private die() {
        this.setState('dead')
        this.stopMoving()
    }

    private setState(state: EnemyState) {
        this.state = state
        this.currentImage = 0

        const nextFrames =
            state === 'hurt'
                ? this.frames.hurt ?? this.frames.swim
                : state === 'dead'
                ? this.frames.dead
                : this.frames.swim

        this.cachedImages = []
        this.cacheImages(nextFrames)

        if (this.cachedImages.length > 0) this.img = this.cachedImages[0]

        const loop = state !== 'dead'
        const fps = state === 'dead' ? this.ANIM_FPS.dead : state === 'hurt' ? this.ANIM_FPS.hurt : this.ANIM_FPS.swim
        
        this.restartAnimation(loop, fps)
    }

    private restartAnimation(loop: boolean, fps: number) {
        if (this.frozen) {
            return
        }

        if (this.animIntervalId !== null) {
            clearInterval(this.animIntervalId)
            this.animIntervalId = null
        }

        const frameCount = this.cachedImages.length
        
        if (frameCount === 0) {
            return
        }

        const safeFps = Math.max(1, Math.floor(fps))
        const delay = Math.max(16, Math.floor(1000 / safeFps))

        this.animIntervalId = window.setInterval(() => {
            const i = this.currentImage % frameCount
            
            this.img = this.cachedImages[i]
            this.currentImage++

            if (!loop && this.currentImage >= frameCount) {
                this.img = this.cachedImages[frameCount - 1]
                
                if (this.animIntervalId !== null) {
                    clearInterval(this.animIntervalId)
                    this.animIntervalId = null
                }
            }
        }, delay)
    }

    private startMovement() {
        if (this.frozen || this.moveIntervalId !== null) {
            return
        }

        this.moveIntervalId = window.setInterval(() => {
            if (this.frozen || this.state === 'dead') {
                return
            }
            
            if (this.type === 'pufferfish' || this.type === 'boss') {
                this.x -= this.xSpeed
                this.hasReachedCanvasLeftEnd()

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

        const fps = this.state === 'hurt' ? this.ANIM_FPS.hurt : this.ANIM_FPS.swim
        
        this.restartAnimation(true, fps)
    }

    private stopMoving() {
        if (this.moveIntervalId === null) {
            return
        }
        
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

    private hasReachedCanvasLeftEnd() {
        if (this.x <= 0) {
            this.reachedCanvasLeftEnd = true
            this.x = 0
        }
    }
}
