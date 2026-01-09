/**
 * @fileoverview Enemy character model for game enemies.
 * Manages enemies (jellyfish, pufferfish) behavior, movement, animations, and combat.
 */

import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'
import { getRandomNumber } from '@root/utils/helper'
import { assets } from '@root/utils/assets'

/**
 * Enemy types in the game
 * @typedef {'pufferfish' | 'jellyfish' | 'boss'} EnemyType
 */
export type EnemyType = 'pufferfish' | 'jellyfish' | 'boss'

/**
 * Enemy animation/behavior states
 * @typedef {'swim' | 'hurt' | 'dead'} EnemyState
 */
type EnemyState = 'swim' | 'hurt' | 'dead'

/**
 * Configuration options for enemy combat stats
 * @typedef {Object} EnemyOptions
 * @property {number} [maxHp] - Maximum health points
 * @property {number} [hp] - Initial health points
 * @property {number} [damage] - Damage output per hit
 */
export interface EnemyOptions {
    /** Maximum health points */
    maxHp?: number
    /** Initial health points */
    hp?: number
    /** Damage output per hit */
    damage?: number
}

/**
 * Type definition for enemy initialization, excluding imageSrc
 */
type EnemyInit = Omit<MovableObjectConfig, 'imageSrc'>

/**
 * Enemy class representing game enemies with AI and combat
 */
export class Enemy extends MovableObject {
    readonly type: EnemyType
    private state: EnemyState = 'swim'

    private reachedCanvasTopEnd = false
    private reachedCanvasBottomEnd = false

    private moveIntervalId: number | null = null
    private animIntervalId: number | null = null

    private frames: { swim: string[]; dead: string[]; hurt?: string[] }
    private currentImage = 0

    private readonly canvasHeight = 480
    private yDirection: 1 | -1 = 1
    private ySpeed: number = 0.5
    private xSpeed: number = 0.5

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
        config: EnemyInit,
        type: EnemyType,
        options: EnemyOptions = {}
    ) {
        const randY = config.y ?? getRandomNumber(100, 400)
        const randX = config.x ?? getRandomNumber(250, 2200)
        const framesInfo = Enemy.generateFramesFor(type)

        const base: MovableObjectConfig = {
            imageSrc: framesInfo.initial,
            x: randX,
            y: randY,
            width: config.width ?? framesInfo.defaults.width ?? 100,
            aspectRatio: config.aspectRatio ?? framesInfo.defaults.aspectRatio ?? 300 / 211,
            height: config.height,
            hitbox: config.hitbox,
        }

        super(base)

        this.type = type
        this.frames = { swim: framesInfo.swim, dead: framesInfo.dead, hurt: framesInfo.hurt }

        this.xSpeed = Math.round((Math.random() * (1.4 - 0.4) + 0.4) * 100) / 100
        this.ySpeed = Math.round((Math.random() * (1.2 - 0.3) + 0.3) * 100) / 100
        this.yDirection = Math.random() < 0.5 ? -1 : 1

        this.baseMaxHp = options.maxHp ?? 100
        this.baseDamage = options.damage ?? 10

        this.maxHp = this.baseMaxHp
        this.damage = this.baseDamage
        this.hp = typeof options.hp === 'number' ? options.hp : this.maxHp

        this.setState('swim')
        this.startMovement()
        this.updatePufferfishHitbox()
        if (this.type === 'jellyfish') {
            const w = this.width
            const h = this.calculatedHeight

            const hb = {
                offsetX: Math.floor(w * 0.15),
                offsetY: Math.floor(h * 0.08),
                width: Math.floor(w * 0.7),
                height: Math.floor(h * 0.85),
            }

            this.setHitbox(hb)
        }
    }

    /**
     * Generates animation frame paths for the given enemy type
     * @param {EnemyType} type - Type of enemy
     * @returns Animation frame configuration
     * @private
     * @static
     */
    private static generateFramesFor(type: EnemyType): {
        initial: string
        swim: string[]
        dead: string[]
        hurt?: string[]
        defaults: { width?: number; aspectRatio?: number }
    } {
        if (type === 'pufferfish') {
            const colors: Array<'green' | 'orange' | 'red'> = ['green', 'orange', 'red']
            const color = colors[Math.floor(Math.random() * colors.length)]

            const swim = [1, 2, 3, 4, 5].map((i) => assets.enemies.pufferfish(`${color}-swim-${i}.png`, 'swim', color))
            const hurt = [1, 2, 3, 4, 5].map((i) =>
                assets.enemies.pufferfish(`${color}-bubble-swim-${i}.png`, 'bubble-swim', color)
            )
            const dead = [1, 2, 3].map((i) => assets.enemies.pufferfish(`${color}-dead-${i}.png`, 'dead', color))

            return {
                initial: swim[0],
                swim,
                dead,
                hurt,
                defaults: { aspectRatio: 198 / 241 },
            }
        }

        type JellyVariant = 'regular' | 'super-dangerous'
        const variant: JellyVariant = Math.random() < 0.5 ? 'regular' : 'super-dangerous'
        const color = variant === 'regular' ? (Math.random() < 0.5 ? 'purple' : 'yellow') : (Math.random() < 0.5 ? 'green' : 'pink')

        const swim = [1, 2, 3, 4].map((i) => assets.enemies.jellyfish(`${variant}-${color}-${i}.png`, variant, color))

        const dead = [1, 2, 3, 4].map((i) => assets.enemies.jellyfish(`dead-${color}-${i}.png`, 'dead', color))

        return {
            initial: swim[0],
            swim,
            dead,
            defaults: { width: variant === 'super-dangerous' ? 125 : 100, aspectRatio: 300 / 211 },
        }
    }

    /**
     * Gets the enemy type
     * @returns {EnemyType} Enemy type
     */
    getType(): EnemyType {
        return this.type
    }

    /**
     * Checks if the enemy is dead
     * @returns {boolean} True if HP is 0 or less
     */
    get isDead() {
        return this.hp <= 0
    }

    /**
     * Sets base combat statistics for the enemy
     * @param {EnemyOptions} combat - Combat configuration
     */
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

        this.updatePufferfishHitbox()
    }

    /**
     * Applies damage to the enemy
     * @param {number} amount - Damage amount
     */
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

        this.updatePufferfishHitbox()
    }

    /**
     * Freezes the enemy's movement and animation
     */
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

    /**
     * Unfreezes the enemy's movement and animation
     */
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

    /**
     * Handles enemy death
     * @private
     */
    private die() {
        this.setState('dead')
        this.stopMoving()
    }

    /**
     * Changes the enemy state and updates animation
     * @param {EnemyState} state - New enemy state
     * @private
     */
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
        
        this.restartAnimation(loop, fps, () => {
            if (state === 'dead') {
                this.onDeadAnimationComplete()
            }
        })

    }

    /**
     * Updates hitbox for pufferfish based on bloated state
     * @private
     */
    private updatePufferfishHitbox() {
        if (this.type !== 'pufferfish') {
            return
        }

        const isBloated = this.hp <= this.maxHp * 0.5
        const w = this.width
        const h = this.calculatedHeight

        const normal = {
            offsetX: Math.floor(w * -0.01),
            offsetY: Math.floor(h * 0.1),
            width: Math.floor(w * 0.9),
            height: Math.floor(h * 0.65),
        }

        const bloated = {
            offsetX: Math.floor(w * 0.05),
            offsetY: Math.floor(h * 0.05),
            width: Math.floor(w * 0.9),
            height: Math.floor(h * 0.9),
        }

        this.setHitbox(isBloated ? bloated : normal)
    }

    

    /**
     * Handles dead animation completion
     * @private
     */
    private onDeadAnimationComplete() {
        this.startFloatingUpward()
    }

    /**
     * Starts the floating upward animation for dead enemies
     * @private
     */
    private startFloatingUpward() {
        if (this.moveIntervalId !== null) {
            clearInterval(this.moveIntervalId)
        }

        this.moveIntervalId = window.setInterval(() => {
            this.y -= 1.5

            if (this.y + this.calculatedHeight < 0) {
                this.stopMoving()
            }
        }, 1000 / 60)
    }

    /**
     * Restarts animation with new parameters
     * @param {boolean} loop - Whether animation should loop
     * @param {number} fps - Frames per second
     * @param {() => void} [onComplete] - Callback when animation completes
     * @private
     */
    private restartAnimation(loop: boolean, fps: number, onComplete?: () => void) {
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

                onComplete?.()
            }
        }, delay)
    }

    /**
     * Starts the enemy movement loop
     * @private
     */
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

                if (this.x + this.width < -500) {
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

    /**
     * Stops the enemy movement
     * @private
     */
    private stopMoving() {
        if (this.moveIntervalId === null) {
            return
        }
        
        clearInterval(this.moveIntervalId)
        this.moveIntervalId = null
    }

    /**
     * Checks if jellyfish has reached top of canvas
     * @private
     */
    private hasReachedCanvasTopEnd() {
        if (this.y <= 0) {
            this.reachedCanvasTopEnd = true
            this.y = 0
        }
    }

    /**
     * Checks if jellyfish has reached bottom of canvas
     * @private
     */
    private hasReachedCanvasBottomEnd() {
        const bottom = this.canvasHeight - this.calculatedHeight

        if (this.y >= bottom) {
            this.reachedCanvasBottomEnd = true
            this.y = bottom
        }
    }
}
