import { DrawableObject, type DrawableObjectConfig } from '@models/drawable-object.model'
import type { HitboxConfig } from '@models/movable-object.model'

export type CollectibleType = 'coin' | 'poison'

export type CollectibleConfig = DrawableObjectConfig & {
    type: CollectibleType
    value?: number
    hitbox?: HitboxConfig

    frames?: string[]

    fps?: number
}

export class Collectible extends DrawableObject {
    readonly type: CollectibleType
    readonly value: number

    isCollected = false

    private readonly hitbox: { offsetX: number; offsetY: number; width: number; height: number }

    private currentFrame = 0
    private animIntervalId: number | null = null
    private readonly fps: number

    private frozen = false
    private wasAnimating = false

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

    getHitbox() {
        return {
            x: this.x + this.hitbox.offsetX,
            y: this.y + this.hitbox.offsetY,
            width: this.hitbox.width,
            height: this.hitbox.height,
        }
    }

    collect() {
        this.isCollected = true
        this.stopAnimation()
    }

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

    private stopAnimation() {
        if (this.animIntervalId === null) {
            return
        }
        
        clearInterval(this.animIntervalId)
        this.animIntervalId = null
    }
}
