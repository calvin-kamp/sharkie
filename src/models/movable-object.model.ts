import { DrawableObject, type DrawableObjectConfig } from '@models/drawable-object.model'

export interface HitboxConfig {
    offsetX?: number
    offsetY?: number
    width?: number
    height?: number
}

export interface MovableObjectConfig extends DrawableObjectConfig {
    hitbox?: HitboxConfig
}

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
