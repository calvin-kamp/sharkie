/**
 * @fileoverview Boss enemy model for the final boss encounter.
 * Manages boss behavior, attack patterns, animations, and combat mechanics.
 */

import { MovableObject, type MovableObjectConfig, type HitboxConfig } from '@models/movable-object.model'
import type { CombatConfig } from '@models/combat.model'
import type { Player } from '@models/player.model'
import { clamp } from '@root/utils/geometry'

/**
 * Configuration for creating the boss
 * @typedef {Object} BossConfig
 * @property {string[]} imagesIntroduce - Introduction animation frames
 * @property {string[]} imagesFloating - Idle floating animation frames
 * @property {string[]} imagesAttack - Attack animation frames
 * @property {string[]} imagesDead - Death animation frames
 * @property {string[]} imagesHurt - Hurt animation frames
 * @property {number} [x] - X position on canvas
 * @property {number} [y] - Y position on canvas
 * @property {number} [width] - Width in pixels
 * @property {number} [height] - Height in pixels
 * @property {number} [aspectRatio] - Width to height ratio
 * @property {HitboxConfig} [hitbox] - Collision hitbox configuration
 * @property {CombatConfig} [combat] - Combat stats configuration
 */
export interface BossConfig {
    imagesIntroduce: string[]
    imagesFloating: string[]
    imagesAttack: string[]
    imagesDead: string[]
    imagesHurt: string[]

    x?: number
    y?: number
    width?: number
    height?: number
    aspectRatio?: number
    hitbox?: HitboxConfig

    combat?: CombatConfig
}

/**
 * Boss class representing the final boss enemy with complex AI and attack patterns
 */
export class Boss extends MovableObject {
    private introduced = false
    private introducing = false
    private attacking = false
    private movementDisabledForHitboxTesting = false

    private lastHurtAt = 0
    private readonly hurtCooldownMs = 250

    private lastAttackAt = 0
    private readonly attackCooldownMs = 1000

    private animIntervalId: number | null = null
    private currentImage = 0

    private frozen = false
    private wasAnimating = false
    private animLoop = true
    private animOnComplete: (() => void) | null = null

    private readonly framesIntroduce: string[]
    private readonly framesFloating: string[]
    private readonly framesAttack: string[]
    private readonly framesDead: string[]
    private readonly framesHurt: string[]

    private readonly ANIM_FPS = {
        introduce: 10,
        floating: 8,
        attack: 10,
        hurt: 10,
        dead: 8,
    } as const

    private currentFps: number = this.ANIM_FPS.floating

    baseMaxHp: number
    baseDamage: number
    maxHp: number
    hp: number
    damage: number

    constructor(config: BossConfig) {
        const base: MovableObjectConfig = {
            imageSrc: config.imagesFloating?.[0] ?? config.imagesIntroduce?.[0] ?? '',
            width: config.width ?? 450,
            aspectRatio: config.aspectRatio ?? 1216 / 1041,
            x: config.x ?? 0,
            y: config.y ?? 0,
            hitbox: config.hitbox,
        }

        super(base)

        this.baseMaxHp = config.combat?.maxHp ?? 500
        this.baseDamage = config.combat?.damage ?? 20
        this.maxHp = this.baseMaxHp
        this.damage = this.baseDamage
        this.hp =
            typeof config.combat?.hp === 'number'
                ? Math.min(this.maxHp, Math.max(0, config.combat.hp))
                : this.maxHp

        this.framesIntroduce = config.imagesIntroduce
        this.framesFloating = config.imagesFloating
        this.framesAttack = config.imagesAttack
        this.framesDead = config.imagesDead
        this.framesHurt = config.imagesHurt

        this.setFrames(this.framesFloating, this.ANIM_FPS.floating)
        {
            const w = this.width
            const h = this.calculatedHeight
            const hb = {
                offsetX: Math.floor(w * 0.1),
                offsetY: Math.floor(h * 0.65),
                width: Math.floor(w * 0.7),
                height: Math.floor(h * -0.1),
            }
            this.setHitbox(hb)
        }
    }

    get isDead() {
        return this.hp <= 0
    }

    setBaseCombat(combat: CombatConfig) {
        if (typeof combat.maxHp === 'number') {
            this.baseMaxHp = combat.maxHp
        }

        if (typeof combat.damage === 'number') {
            this.baseDamage = combat.damage
        }

        this.maxHp = this.baseMaxHp
        this.damage = this.baseDamage

        this.hp =
            typeof combat.hp === 'number'
                ? Math.min(this.maxHp, Math.max(0, combat.hp))
                : this.maxHp
    }

    takeDamage(amount: number) {
        if (this.isDead || amount <= 0) {
            return
        }

        this.hp = Math.max(0, this.hp - amount)

        if (this.hp <= 0) {
            this.die()
            return
        }

        const now = Date.now()
        
        if (now - this.lastHurtAt < this.hurtCooldownMs) {
            return
        }

        this.lastHurtAt = now

        this.playHurtOnce()
    }

    private die() {
        this.attacking = false
        this.setFrames(this.framesDead, this.ANIM_FPS.dead)
        this.play(false)
    }

    private playHurtOnce() {
        if (this.introducing || this.attacking || this.movementDisabledForHitboxTesting) {
            return
        }

        this.setFrames(this.framesHurt, this.ANIM_FPS.hurt)
        
        this.play(false, () => {
            
            if (this.isDead) {
                return
            }

            this.setFrames(this.framesFloating, this.ANIM_FPS.floating)
            
            if (this.introduced) {
                this.play(true)
            }
        })
    }

    playAttackOnce(onDone?: () => void) {
        if (this.isDead || this.introducing || this.attacking || this.movementDisabledForHitboxTesting) {
            return
        }

        const now = Date.now()
        if (now - this.lastAttackAt < this.attackCooldownMs) {
            return
        }

        this.lastAttackAt = now
        
        this.attacking = true

        this.setFrames(this.framesAttack, this.ANIM_FPS.attack)
        
        this.play(false, () => {
            this.attacking = false
            
            if (this.isDead) {
                return
            }

            this.setFrames(this.framesFloating, this.ANIM_FPS.floating)
            
            if (this.introduced) {
                this.play(true)
            }

            onDone?.()
        })
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

        if (this.wasAnimating) {
            this.wasAnimating = false
            this.startInterval()
        }
    }

    playIntroduceOnce(onDone?: () => void) {
        if (this.introduced) {
            return
        }

        this.introduced = true
        this.introducing = true

        if (this.movementDisabledForHitboxTesting) {
            this.introducing = false
            this.setFrames(this.framesFloating, this.ANIM_FPS.floating)
            onDone?.()
            return
        }

        this.setFrames(this.framesIntroduce, this.ANIM_FPS.introduce)
        this.play(false, () => {
            this.introducing = false
            this.setFrames(this.framesFloating, this.ANIM_FPS.floating)
            this.play(true)
            onDone?.()
        })
    }

    startIntroSequence(
        player: Player,
        viewRight: number,
        worldLeft: number,
        worldRight: number,
        canvasHeight: number,
        spawnGap: number,
        onComplete: () => void
    ): void {
        this.alignForIntro(player, viewRight, worldLeft, worldRight, canvasHeight, spawnGap)
        this.playIntroduceOnce(onComplete)
    }

    chasePlayer(player: Player, dtMs: number, worldLeft: number, worldRight: number, canvasHeight: number) {
        if (!player || player.isDead || this.isDead || !this.introduced || this.introducing || this.attacking) {
            return
        }

        if (this.movementDisabledForHitboxTesting) {
            return
        }

        const dt = Math.max(0, dtMs) / 16.6667

        const bossCx = this.x + this.width / 2
        const bossCy = this.y + this.calculatedHeight / 2
        const playerCx = player.x + player.width / 2
        const playerCy = player.y + player.calculatedHeight / 2

        const dx = playerCx - bossCx
        const dy = playerCy - bossCy

        this.directionLeft = dx > 0

        const speedX = 4 * dt
        const speedY = 3 * dt

        if (Math.abs(dx) > 2) {
            this.x += Math.sign(dx) * Math.min(speedX, Math.abs(dx))
        }

        if (Math.abs(dy) > 2) {
            this.y += Math.sign(dy) * Math.min(speedY, Math.abs(dy))
        }
        
        this.clampPositionWithin(worldLeft, worldRight, canvasHeight)
    }

    alignForIntro(player: Player, viewRight: number, worldLeft: number, worldRight: number, canvasHeight: number, spawnGap: number) {
        if (this.movementDisabledForHitboxTesting) {
            const canvasWidth = viewRight - worldLeft
            this.x = worldLeft + (canvasWidth - this.width) / 2
            this.y = (canvasHeight - this.calculatedHeight) / 2
            this.directionLeft = false
            return
        }

        this.x = viewRight - this.width * 0.8
        
        const playerCenterY = player.y + player.calculatedHeight / 2
        const bossCenterY = this.calculatedHeight / 2
        this.y = Math.max(0, Math.min(playerCenterY - bossCenterY, canvasHeight - this.calculatedHeight))

        const bossCx = this.x + this.width / 2
        const playerCx = player.x + player.width / 2
        this.directionLeft = playerCx - bossCx > 0
    }

    clampPositionWithin(worldLeft: number, worldRight: number, canvasHeight: number) {
        const bounds = this.getMovementBounds(worldLeft, worldRight, canvasHeight)
        this.x = clamp(this.x, bounds.minX, bounds.maxX)
        this.y = clamp(this.y, bounds.minY, bounds.maxY)
    }

    private getMovementBounds(worldLeft: number, worldRight: number, canvasHeight: number) {
        const hb = this.getHitbox()
        const offsetX = hb.x - this.x
        const offsetY = hb.y - this.y

        const minX = worldLeft - offsetX
        const maxX = worldRight - (offsetX + hb.width)

        const minY = -offsetY
        const maxY = canvasHeight - (offsetY + hb.height)

        return { minX, maxX, minY, maxY }
    }

    private setFrames(frames: string[], fps: number) {
        this.cachedImages = []
        this.cacheImages(frames)
        this.currentImage = 0
        this.currentFps = fps

        if (this.cachedImages.length > 0) {
            this.img = this.cachedImages[0]
        }
    }

    private play(loop: boolean, onComplete?: () => void) {
        this.animLoop = loop
        this.animOnComplete = onComplete ?? null

        if (this.frozen) {
            this.wasAnimating = true
            return
        }

        this.startInterval()
    }

    private startInterval() {
        if (this.animIntervalId !== null) {
            clearInterval(this.animIntervalId)
            this.animIntervalId = null
        }

        const frameCount = this.cachedImages.length
        if (frameCount === 0) {
            return
        }

        const safeFps = Math.max(1, Math.floor(this.currentFps))
        const delay = Math.max(16, Math.floor(1000 / safeFps))

        this.animIntervalId = window.setInterval(() => {
            if (this.frozen) {
                return
            }

            const i = this.currentImage % frameCount
            
            this.img = this.cachedImages[i]
            this.currentImage++

            if (!this.animLoop && this.currentImage >= frameCount) {
                this.img = this.cachedImages[frameCount - 1]
                
                if (this.animIntervalId !== null) {
                    clearInterval(this.animIntervalId)
                    this.animIntervalId = null
                }
                
                const cb = this.animOnComplete
                this.animOnComplete = null
                cb?.()
            }
        }, delay)
    }

}
