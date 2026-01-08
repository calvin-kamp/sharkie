import { MovableObject, type MovableObjectConfig, type HitboxConfig } from '@models/movable-object.model'
import type { CombatConfig } from '@models/combat.model'
import type { Player } from '@models/player.model'

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

export class Boss extends MovableObject {
    private introduced = false
    private introducing = false
    private attacking = false

    private lastHurtAt = 0
    private readonly hurtCooldownMs = 250

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
        if (this.introducing || this.attacking) {
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
        if (this.isDead || this.introducing || this.attacking) {
            return
        }
        
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

        this.setFrames(this.framesIntroduce, this.ANIM_FPS.introduce)
        this.play(false, () => {
            this.introducing = false
            this.setFrames(this.framesFloating, this.ANIM_FPS.floating)
            this.play(true)
            onDone?.()
        })
    }

    chasePlayer(player: Player, dtMs: number, worldLeft: number, worldRight: number, canvasHeight: number) {
        if (!player || player.isDead || this.isDead || !this.introduced || this.introducing || this.attacking) {
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

        const speedX = 16 * dt
        const speedY = 12 * dt

        if (Math.abs(dx) > 2) {
            this.x += Math.sign(dx) * Math.min(speedX, Math.abs(dx))
        }

        if (Math.abs(dy) > 2) {
            this.y += Math.sign(dy) * Math.min(speedY, Math.abs(dy))
        }
        
        const minX = worldLeft
        const maxX = worldRight - this.width
        this.x = Math.min(Math.max(this.x, minX), maxX)

        const minY = 0
        const maxY = canvasHeight - this.calculatedHeight
        this.y = Math.min(Math.max(this.y, minY), maxY)
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
