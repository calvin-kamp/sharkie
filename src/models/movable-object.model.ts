/**
 * @fileoverview Movable object model extending drawable objects with hitbox support.
 * Provides collision detection capabilities and movement-related functionality.
 */

import { DrawableObject, type DrawableObjectConfig } from '@models/drawable-object.model'

/**
 * Hitbox configuration for collision detection
 * @typedef {Object} HitboxConfig
 * @property {number} [offsetX=0] - Horizontal offset from object position
 * @property {number} [offsetY=0] - Vertical offset from object position
 * @property {number} [width] - Hitbox width (defaults to object width)
 * @property {number} [height] - Hitbox height (defaults to object height)
 */
export interface HitboxConfig {
    offsetX?: number
    offsetY?: number
    width?: number
    height?: number
}

/**
 * Configuration for movable objects, extending drawable object config
 * @typedef {Object} MovableObjectConfig
 * @property {HitboxConfig} [hitbox] - Collision hitbox configuration
 */
export interface MovableObjectConfig extends DrawableObjectConfig {
    hitbox?: HitboxConfig
}

/**
 * Base class for all movable game objects with collision detection
 * Extends DrawableObject with hitbox and direction management
 */
export class MovableObject extends DrawableObject {
    directionLeft: boolean = false

    private hitbox: { offsetX: number; offsetY: number; width: number; height: number }

    constructor(config: MovableObjectConfig) {
        super(config)

        this.hitbox = {
            offsetX: config.hitbox?.offsetX ?? 0,
            offsetY: config.hitbox?.offsetY ?? 0,
            width: config.hitbox?.width ?? this.width,
            height: config.hitbox?.height ?? this.calculatedHeight,
        }
    }

    protected loadImage(imagePath: string) {
        super.loadImage(imagePath)
    }

    cacheImages(images: string[]) {
        super.cacheImages(images)
    }

    setHitbox(hitbox: HitboxConfig) {
        this.hitbox = {
            offsetX: hitbox.offsetX ?? this.hitbox.offsetX,
            offsetY: hitbox.offsetY ?? this.hitbox.offsetY,
            width: hitbox.width ?? this.hitbox.width,
            height: hitbox.height ?? this.hitbox.height,
        }
    }

    getHitbox() {
        const mirroredOffsetX = this.directionLeft
            ? this.width - this.hitbox.offsetX - this.hitbox.width
            : this.hitbox.offsetX

        return {
            x: this.x + mirroredOffsetX,
            y: this.y + this.hitbox.offsetY,
            width: this.hitbox.width,
            height: this.hitbox.height,
        }
    }

    moveUp() {
        this.y -= 2.5
    }

    moveDown() {
        this.y += 2.5
    }

    moveLeft() {
        this.x -= 2.5
    }

    moveRight() {
        this.x += 2.5
    }
}
