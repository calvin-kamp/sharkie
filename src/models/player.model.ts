import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'
import { assets } from '@root/utils/assets'
import type { CombatConfig } from '@models/combat.model'
import type { World } from '@models/world.model'

type HurtVariant = 'electric-shock' | 'poisoned'
type AttackVariant =
    | 'fin-slap'
    | 'bubble-trap'
    | 'bubble-trap-poisoned'
    | 'bubble-trap-no-bubble'

type PlayerState = 'swim' | 'idle' | 'idleLong' | 'hurt' | 'attack' | 'dead'

export class Player extends MovableObject {
    world: World | null = null

    baseMaxHp: number
    baseDamage: number
    maxHp: number
    hp: number
    damage: number

    coins = 0
    maxCoins = 999

    poisonBottles = 0
    maxPoisonBottles = 5

    private rightKeyPressed = false
    private leftKeyPressed = false
    private topKeyPressed = false
    private bottomKeyPressed = false

    private state: PlayerState = 'swim'
    private hurtVariant: HurtVariant = 'electric-shock'
    private attackVariant: AttackVariant = 'fin-slap'

    private animIntervalId: number | null = null
    private currentImage = 0
    private moveIntervalId: number | null = null

    private pendingBubbleFire: { poisoned: boolean } | null = null

    private deadAnimationFinished = false

    private readonly imagesSwim: string[]
    private readonly imagesIdle: string[]
    private readonly imagesIdleLong: string[]
    private readonly imagesHurtElectricShock: string[]
    private readonly imagesHurtPoisoned: string[]
    private readonly imagesDeadElectricShock: string[]
    private readonly imagesDeadPoisoned: string[]
    private readonly imagesAttackFinSlap: string[]
    private readonly imagesAttackBubbleTrap: string[]
    private readonly imagesAttackBubbleTrapPoisoned: string[]
    private readonly imagesAttackBubbleTrapNoBubble: string[]

    private readonly ANIM_FPS = {
        swim: 10,
        idle: 10,
        idleLong: 7,
        hurt: 12,
        dead: 8,
        attackFinSlap: 14,
        bubbleTrap: 14,
        bubbleTrapPoisoned: 14,
        bubbleTrapNoBubble: 14,
    } as const

    private lastHurtAt = 0
    private readonly hurtCooldownMs = 1000

    private lastAttackAt = 0
    private readonly attackCooldownMs = 500

    private updateCamera() {
        if (!this.world) {
            return
        }

        const playerCenterX = this.x + this.width / 2
        const targetOffset = -(playerCenterX - this.world.canvasWidth / 2)

        this.world.setCameraOffset(targetOffset)
    }

    constructor(config: MovableObjectConfig & { combat?: CombatConfig }) {
        super({
            imageSrc: config.imageSrc ?? assets.player.state('swim-1.png', 'swim'),
            width: config.width ?? 250,
            aspectRatio: config.aspectRatio ?? 815 / 1000,
            x: config.x ?? 0,
            y: config.y ?? 100,
            hitbox: config.hitbox,
        })

        this.baseMaxHp = config.combat?.maxHp ?? 100
        this.baseDamage = config.combat?.damage ?? 10
        this.maxHp = this.baseMaxHp
        this.damage = this.baseDamage
        this.hp =
            typeof config.combat?.hp === 'number'
                ? Math.min(this.maxHp, Math.max(0, config.combat.hp))
                : this.maxHp

        this.imagesSwim = [
            assets.player.state('swim-2.png', 'swim'),
            assets.player.state('swim-3.png', 'swim'),
            assets.player.state('swim-5.png', 'swim'),
            assets.player.state('swim-6.png', 'swim'),
        ]

        this.imagesIdle = [
            assets.player.state('idle-1.png', 'idle'),
            assets.player.state('idle-2.png', 'idle'),
            assets.player.state('idle-3.png', 'idle'),
            assets.player.state('idle-4.png', 'idle'),
            assets.player.state('idle-5.png', 'idle'),
            assets.player.state('idle-6.png', 'idle'),
            assets.player.state('idle-7.png', 'idle'),
            assets.player.state('idle-8.png', 'idle'),
            assets.player.state('idle-9.png', 'idle'),
            assets.player.state('idle-10.png', 'idle'),
        ]

        this.imagesIdleLong = [
            assets.player.state('long-idle-1.png', 'long-idle'),
            assets.player.state('long-idle-2.png', 'long-idle'),
            assets.player.state('long-idle-3.png', 'long-idle'),
            assets.player.state('long-idle-4.png', 'long-idle'),
            assets.player.state('long-idle-5.png', 'long-idle'),
            assets.player.state('long-idle-6.png', 'long-idle'),
            assets.player.state('long-idle-7.png', 'long-idle'),
            assets.player.state('long-idle-8.png', 'long-idle'),
            assets.player.state('long-idle-9.png', 'long-idle'),
            assets.player.state('long-idle-10.png', 'long-idle'),
        ]

        this.imagesHurtElectricShock = [
            assets.player.hurt('hurt-electric-shock-option-1-1.png', 'electric-shock'),
            assets.player.hurt('hurt-electric-shock-option-1-2.png', 'electric-shock'),
            assets.player.hurt('hurt-electric-shock-option-1-3.png', 'electric-shock'),
        ]

        this.imagesHurtPoisoned = [
            assets.player.hurt('hurt-poisoned-2.png', 'poisoned'),
            assets.player.hurt('hurt-poisoned-3.png', 'poisoned'),
            assets.player.hurt('hurt-poisoned-4.png', 'poisoned'),
            assets.player.hurt('hurt-poisoned-5.png', 'poisoned'),
        ]

        this.imagesDeadElectricShock = [
            assets.player.dead('dead-electric-shock-1.png', 'electric-shock'),
            assets.player.dead('dead-electric-shock-2.png', 'electric-shock'),
            assets.player.dead('dead-electric-shock-3.png', 'electric-shock'),
            assets.player.dead('dead-electric-shock-4.png', 'electric-shock'),
            assets.player.dead('dead-electric-shock-5.png', 'electric-shock'),
            assets.player.dead('dead-electric-shock-6.png', 'electric-shock'),
            assets.player.dead('dead-electric-shock-7.png', 'electric-shock'),
            assets.player.dead('dead-electric-shock-8.png', 'electric-shock'),
            assets.player.dead('dead-electric-shock-9.png', 'electric-shock'),
            assets.player.dead('dead-electric-shock-10.png', 'electric-shock'),
        ]

        this.imagesDeadPoisoned = [
            assets.player.dead('dead-poisoned-1.png', 'poisoned'),
            assets.player.dead('dead-poisoned-2.png', 'poisoned'),
            assets.player.dead('dead-poisoned-3.png', 'poisoned'),
            assets.player.dead('dead-poisoned-4.png', 'poisoned'),
            assets.player.dead('dead-poisoned-5.png', 'poisoned'),
            assets.player.dead('dead-poisoned-6.png', 'poisoned'),
            assets.player.dead('dead-poisoned-7.png', 'poisoned'),
            assets.player.dead('dead-poisoned-8.png', 'poisoned'),
            assets.player.dead('dead-poisoned-9.png', 'poisoned'),
            assets.player.dead('dead-poisoned-10.png', 'poisoned'),
            assets.player.dead('dead-poisoned-11.png', 'poisoned'),
            assets.player.dead('dead-poisoned-12.png', 'poisoned'),
        ]

        this.imagesAttackFinSlap = [
            assets.player.attack.finSlap('fin-slap-1.png'),
            assets.player.attack.finSlap('fin-slap-2.png'),
            assets.player.attack.finSlap('fin-slap-3.png'),
            assets.player.attack.finSlap('fin-slap-4.png'),
            assets.player.attack.finSlap('fin-slap-5.png'),
            assets.player.attack.finSlap('fin-slap-6.png'),
            assets.player.attack.finSlap('fin-slap-7.png'),
            assets.player.attack.finSlap('fin-slap-8.png'),
        ]

        this.imagesAttackBubbleTrap = [
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-1.png', 'option-1-with-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-2.png', 'option-1-with-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-3.png', 'option-1-with-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-4.png', 'option-1-with-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-5.png', 'option-1-with-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-6.png', 'option-1-with-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-7.png', 'option-1-with-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-8.png', 'option-1-with-bubble'),
        ]

        this.imagesAttackBubbleTrapPoisoned = [
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-poisoned-1.png', 'option-3-with-bubble-poisoned'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-poisoned-2.png', 'option-3-with-bubble-poisoned'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-poisoned-3.png', 'option-3-with-bubble-poisoned'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-poisoned-4.png', 'option-3-with-bubble-poisoned'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-poisoned-5.png', 'option-3-with-bubble-poisoned'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-poisoned-6.png', 'option-3-with-bubble-poisoned'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-poisoned-7.png', 'option-3-with-bubble-poisoned'),
            assets.player.attack.bubbleTrap('bubble-trap-with-bubble-poisoned-8.png', 'option-3-with-bubble-poisoned'),
        ]

        this.imagesAttackBubbleTrapNoBubble = [
            assets.player.attack.bubbleTrap('bubble-trap-without-bubble-1.png', 'option-2-without-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-without-bubble-2.png', 'option-2-without-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-without-bubble-3.png', 'option-2-without-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-without-bubble-4.png', 'option-2-without-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-without-bubble-5.png', 'option-2-without-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-without-bubble-6.png', 'option-2-without-bubble'),
            assets.player.attack.bubbleTrap('bubble-trap-without-bubble-7.png', 'option-2-without-bubble'),
        ]

        this.setState('swim')
        this.addEventTriggers()
        this.startMovement()
    }

    addCoins(amount: number) {
        const next = this.coins + Math.max(0, Math.floor(amount))

        this.coins = Math.max(0, Math.min(this.maxCoins, next))
    }

    addPoisonBottles(amount: number) {
        const next = this.poisonBottles + Math.max(0, Math.floor(amount))

        this.poisonBottles = Math.max(0, Math.min(this.maxPoisonBottles, next))
    }

    get isDead() {
        return this.hp <= 0
    }

    get isDeadAnimationFinished() {
        return this.deadAnimationFinished
    }

    private isMoving() {
        return this.rightKeyPressed || this.leftKeyPressed || this.topKeyPressed || this.bottomKeyPressed
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

    takeDamage(amount: number, variant: HurtVariant = 'electric-shock') {
        if (this.isDead || amount <= 0) {
            return
        }

        if (this.state === 'hurt') {
            return
        }

        const now = Date.now()
        if (now - this.lastHurtAt < this.hurtCooldownMs) {
            return
        }

        this.lastHurtAt = now
        this.hp = Math.max(0, this.hp - amount)

        if (this.hp <= 0) {
            this.die(variant)
            return
        }

        this.setState('hurt', variant)
    }

    private die(variant: HurtVariant) {
        if (this.state === 'dead') {
            return
        }

        this.setState('dead', variant)
    }

    private canAttack() {
        if (!this.world || (this.world.isFrozen && this.state !== 'dead') || this.isDead || this.state === 'hurt' || this.state === 'attack' || this.state === 'dead') {
            return false
        }

        const now = Date.now()
        
        if (now - this.lastAttackAt < this.attackCooldownMs) {
            return false
        }
        
        this.lastAttackAt = now

        return true
    }

    private attackFinSlap() {
        if (!this.canAttack()) {
            return
        }

        this.pendingBubbleFire = null
        this.setState('attack', 'fin-slap')
    }

    private attackBubbleTrap(poisoned: boolean) {
        if (!this.canAttack()) {
            return
        }

        if (poisoned && this.poisonBottles <= 0) {
            this.pendingBubbleFire = null
            this.setState('attack', 'bubble-trap-no-bubble')

            return
        }

        this.pendingBubbleFire = { poisoned }
        this.setState('attack', poisoned ? 'bubble-trap-poisoned' : 'bubble-trap')
    }

    private onAttackAnimationFinished() {
        if (!this.world || !this.pendingBubbleFire) {
            return
        }

        const wantsPoisoned = this.pendingBubbleFire.poisoned
        this.pendingBubbleFire = null

        if (wantsPoisoned) {
            if (this.poisonBottles <= 0) {
                return
            }

            this.poisonBottles = Math.max(0, this.poisonBottles - 1)
        }

        const hb = this.getHitbox()
        const spawnMargin = 12
        const spawnX = this.directionLeft ? hb.x - spawnMargin : hb.x + hb.width + spawnMargin
        const spawnY = hb.y + hb.height * 0.5

        this.world.addProjectile({
            poisoned: wantsPoisoned,
            x: spawnX,
            y: spawnY,
            directionLeft: this.directionLeft,
        })
    }

    private setState(state: PlayerState, variant: HurtVariant | AttackVariant = 'electric-shock') {
        if (this.isSameState(state, variant)) {
            return
        }

        this.state = state
        this.currentImage = 0
        if (state === 'hurt') this.hurtVariant = variant as HurtVariant
        if (state === 'attack') this.attackVariant = variant as AttackVariant

        const { frames, fps, loop } = this.computeAnimation(state, variant)
        this.applyAnimation(frames, fps, loop)
    }

    private isSameState(state: PlayerState, variant: HurtVariant | AttackVariant): boolean {
        const sameState = this.state === state
        const sameVariant =
            state === 'hurt'
                ? this.hurtVariant === (variant as HurtVariant)
                : state === 'attack'
                ? this.attackVariant === (variant as AttackVariant)
                : true
        return sameState && sameVariant
    }

    private computeAnimation(state: PlayerState, variant: HurtVariant | AttackVariant) {
        if (state === 'dead') {
            return {
                frames: variant === 'poisoned' ? this.imagesDeadPoisoned : this.imagesDeadElectricShock,
                fps: this.ANIM_FPS.dead,
                loop: false,
            }
        }

        if (state === 'hurt') {
            return {
                frames: variant === 'poisoned' ? this.imagesHurtPoisoned : this.imagesHurtElectricShock,
                fps: this.ANIM_FPS.hurt,
                loop: false,
            }
        }

        if (state === 'attack') {
            if (variant === 'fin-slap')
                return { frames: this.imagesAttackFinSlap, fps: this.ANIM_FPS.attackFinSlap, loop: false }
            if (variant === 'bubble-trap')
                return { frames: this.imagesAttackBubbleTrap, fps: this.ANIM_FPS.bubbleTrap, loop: false }
            if (variant === 'bubble-trap-no-bubble')
                return { frames: this.imagesAttackBubbleTrapNoBubble, fps: this.ANIM_FPS.bubbleTrapNoBubble, loop: false }
            return { frames: this.imagesAttackBubbleTrapPoisoned, fps: this.ANIM_FPS.bubbleTrapPoisoned, loop: false }
        }

        if (state === 'idle') {
            return { frames: this.imagesIdle, fps: this.ANIM_FPS.idle, loop: false }
        }

        if (state === 'idleLong') {
            return { frames: this.imagesIdleLong, fps: this.ANIM_FPS.idleLong, loop: true }
        }

        return { frames: this.imagesSwim, fps: this.ANIM_FPS.swim, loop: true }
    }

    private applyAnimation(frames: string[], fps: number, loop: boolean) {
        this.cacheImages(frames)
        if (this.cachedImages.length > 0) this.img = this.cachedImages[0]

        this.restartAnimation(loop, fps, () => this.onAnimationComplete())
    }

    private onAnimationComplete() {
        if (this.state === 'dead') {
            this.deadAnimationFinished = true
            return
        }

        if (this.state === 'attack') {
            this.onAttackAnimationFinished()
        }

        if (this.state === 'idle') {
            if (!this.isDead && !this.isMoving()) this.setState('idleLong')
            else this.setState('swim')
            return
        }

        if (this.state === 'hurt' || this.state === 'attack') {
            this.setState('swim')
        }
    }

    private restartAnimation(loop: boolean, fps: number, onComplete?: () => void) {
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
            if (!this.world || this.world.isPaused || (this.world.isFrozen && this.state !== 'dead')) {
                return
            }

            if (this.state === 'swim' && !this.isMoving()) {
                this.img = this.cachedImages[0]
                this.currentImage = 0
            
                return
            }

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

    private startMovement() {
        if (this.moveIntervalId !== null) {
            return
        }

        this.moveIntervalId = window.setInterval(() => this.onMoveTick(), 1000 / 60)
    }

    private onMoveTick() {
        if (!this.world || this.world.isPaused || (this.world.isFrozen && this.state !== 'dead') || this.state === 'attack' || this.state === 'hurt' || this.state === 'dead' || this.isDead) {
            return
        }

        this.updateMovementState()
        this.updateDirectionFromInput()
        this.applyMovementWithinBounds()
    }

    private updateMovementState() {
        const moving = this.isMoving()
        if (moving) {
            if (this.state !== 'swim' && this.state !== 'hurt') this.setState('swim')
        } else {
            if (this.state === 'swim') this.setState('idle')
        }
    }

    private updateDirectionFromInput() {
        const intendsLeft = this.leftKeyPressed && !this.rightKeyPressed
        const intendsRight = this.rightKeyPressed && !this.leftKeyPressed
        if (intendsLeft) this.directionLeft = true
        else if (intendsRight) this.directionLeft = false
    }

    private applyMovementWithinBounds() {
        const hb = this.getHitbox()
        const offsetX = hb.x - this.x
        const offsetY = hb.y - this.y

        const minX = this.world!.worldLeft - offsetX
        const maxX = this.world!.worldRight - (offsetX + hb.width)

        const minY = -offsetY
        const maxY = this.world!.canvasHeight - (offsetY + hb.height)

        if (this.rightKeyPressed) {
            this.x = Math.min(this.x + 8, maxX)
            this.updateCamera()
            this.directionLeft = false
        }
        if (this.leftKeyPressed) {
            this.x = Math.max(this.x - 8, minX)
            this.updateCamera()
            this.directionLeft = true
        }
        if (this.topKeyPressed) this.y = Math.max(this.y - 5, minY)
        if (this.bottomKeyPressed) this.y = Math.min(this.y + 5, maxY)
    }

    private addEventTriggers() {
        document.addEventListener('keydown', (e) => {
            if (this.world?.isPaused) {
                return
            }

            if (e.key === 'd' || e.key === 'ArrowRight') {
                this.rightKeyPressed = true
            }

            if (e.key === 'a' || e.key === 'ArrowLeft') {
                this.leftKeyPressed = true
            }

            if (e.key === 'w' || e.key === 'ArrowUp') {
                this.topKeyPressed = true
            }

            if (e.key === 's' || e.key === 'ArrowDown') {
                this.bottomKeyPressed = true
            }

            if (e.repeat) {
                return
            }

            if (e.code === 'Space') {
                e.preventDefault()
                this.attackFinSlap()
            }

            if (e.key === 'q' || e.key === 'Q') {
                this.attackBubbleTrap(true)
            }

            if (e.key === 'e' || e.key === 'E') {
                this.attackBubbleTrap(false)
            }
        })

        document.addEventListener('keyup', (e) => {
            if (e.key === 'd' || e.key === 'ArrowRight') {
                this.rightKeyPressed = false
            }

            if (e.key === 'a' || e.key === 'ArrowLeft') {
                this.leftKeyPressed = false
            }

            if (e.key === 'w' || e.key === 'ArrowUp') {
                this.topKeyPressed = false
            }

            if (e.key === 's' || e.key === 'ArrowDown') {
                this.bottomKeyPressed = false
            }
        })
    }
}
