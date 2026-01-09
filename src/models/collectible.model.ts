/**
 * @fileoverview Collectible items model for coins and poison powerups.
 * Manages pickup items that grant player resources like coins and poison bottles.
 */

import { DrawableObject, type DrawableObjectConfig } from '@models/drawable-object.model'
import type { HitboxConfig } from '@models/movable-object.model'
import type { Player } from '@models/player.model'

/**
 * Types of collectible items
 * @typedef {'coin' | 'poison'} CollectibleType
 */
export type CollectibleType = 'coin' | 'poison'

/**
 * Configuration for creating collectible items
 * @typedef {Object} CollectibleConfig
 * @property {CollectibleType} type - The type of collectible
 * @property {number} [value=1] - The value of the collectible
 * @property {HitboxConfig} [hitbox] - Collision hitbox configuration
 * @property {string[]} [frames] - Animation frame images
 * @property {number} [fps=10] - Animation frames per second
 */
export type CollectibleConfig = DrawableObjectConfig & {
    type: CollectibleType
    value?: number
    hitbox?: HitboxConfig

    frames?: string[]

    fps?: number
}

/**
 * Collectible item class for coins and poison powerups
 * Handles animation, collision detection, and collection logic
 */
export class Collectible extends DrawableObject {
    /** Type of collectible (coin or poison) */
    readonly type: CollectibleType
    /** Value awarded when collected */
    readonly value: number

    /** Whether this collectible has been collected */
    isCollected = false

    /** Collision hitbox configuration */
    private readonly hitbox: { offsetX: number; offsetY: number; width: number; height: number }

    /** Current animation frame index */
    private currentFrame = 0
    /** Animation interval timer ID */
    private animIntervalId: number | null = null
    /** Animation frames per second */
    private readonly fps: number

    /** Whether animation is frozen/paused */
    private frozen = false
    /** Tracks if animation was running before freeze */
    private wasAnimating = false

    /**
     * Creates a new collectible item
     * @param {CollectibleConfig} config - Collectible configuration
     */
    constructor(config: CollectibleConfig) {
        super(config)

        this.type = config.type
        this.value = config.value ?? 1

        this.hitbox = {
            offsetX: config.hitbox?.offsetX ?? 0,
            offsetY: config.hitbox?.offsetY ?? 0,
            width: config.hitbox?.width ?? this.width,
            height: config.hitbox?.height ?? this.calculatedHeight,
        }

        const frames = config.frames ?? []
        this.fps = Math.max(1, Math.floor(config.fps ?? 10))

        if (frames.length > 0) {
            this.cacheImages(frames)
            
            if (this.cachedImages.length > 0) {
                this.img = this.cachedImages[0]
            }
        }

        if (this.cachedImages.length > 1) {
            this.startAnimation()
        }
    }

    /**
     * Gets the collision hitbox in world coordinates
     * @returns {Rect} The hitbox rectangle
     */
    getHitbox() {
        return {
            x: this.x + this.hitbox.offsetX,
            y: this.y + this.hitbox.offsetY,
            width: this.hitbox.width,
            height: this.hitbox.height,
        }
    }

    /**
     * Marks the collectible as collected and stops animation
     */
    collect() {
        this.isCollected = true
        this.stopAnimation()
    }

    /**
     * Collects this item for the player, granting appropriate rewards
     * @param {Player} player - The player collecting the item
     */
    collectFor(player: Player) {
        if (this.isCollected) {
            return
        }

        this.applyEffect(player)
        this.collect()
    }

    /**
     * Applies the collectible's effect to the player
     * @param {Player} player - The player to apply effect to
     * @private
     */
    private applyEffect(player: Player) {
        if (this.type === 'coin') {
            player.addCoins(this.value)
            console.log(`[PICKUP] COIN -> coins: ${player.coins}`)
            
            return
        }

        player.addPoisonBottles(this.value)
        console.log(`[PICKUP] POISON -> poison: ${player.poisonBottles}`)
    }

    /**
     * Freezes the collectible animation
     */
    freeze() {
        if (this.frozen) {
            return
        }

        this.frozen = true

        if (this.animIntervalId !== null) {
            clearInterval(this.animIntervalId)
            
            this.animIntervalId = null
            this.wasAnimating = true
        }
    }

    /**
     * Unfreezes the collectible animation
     */
    unfreeze() {
        if (!this.frozen) {
            return
        }

        this.frozen = false

        if (this.isCollected) {
            return
        }
        
        if (this.wasAnimating) {
            this.wasAnimating = false
            this.startAnimation()
        }
    }

    /**
     * Starts the collectible animation
     * @private
     */
    private startAnimation() {
        if (this.frozen || this.animIntervalId !== null || this.cachedImages.length <= 1) {
            return
        }

        const delay = Math.max(40, Math.floor(1000 / this.fps))
        
        this.animIntervalId = window.setInterval(() => {
            if (this.frozen || this.isCollected) {
                return
            }

            const i = this.currentFrame % this.cachedImages.length
            this.img = this.cachedImages[i]
            this.currentFrame++
        }, delay)
    }

    /**
     * Stops the collectible animation
     * @private
     */
    private stopAnimation() {
        if (this.animIntervalId === null) {
            return
        }
        
        clearInterval(this.animIntervalId)
        this.animIntervalId = null
    }
}
