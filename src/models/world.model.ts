import { MovableObject } from '@models/movable-object.model'
import type { Player } from '@models/player.model'
import type { Boss } from '@models/boss.model'
import { Enemy } from '@models/enemy.model'
import type { Projectile, ProjectileConfig } from '@models/projectile.model'
import { BossHud } from '@models/boss-hud.model'
import { PlayerHud } from '@models/player-hud.model'
import { Camera } from '@models/camera.model'
import { ProjectileManager } from '@models/projectile-manager.model'
import { CollisionManager } from '@models/collision-manager.model'
import { CollectibleManager } from '@models/collectible-manager.model'
import { type HitboxProvider } from '@root/utils/geometry'
import { type ProjectileSpawn } from '@root/utils/projectile-factory'
import { bindRestartHandlers, drawEndScreen, type EndState } from '@root/utils/end-game'

import { StatusBar } from '@models/status-bar.model'
import type { HudCounter } from '@models/hud-counter.model'
import type { Collectible } from '@models/collectible.model'

type LevelLike = {
    player: Player
    lights: MovableObject[]
    backgrounds: MovableObject[]
    enemies: Enemy[]
    boss: Boss

    statusBars?: StatusBar[]
    hudCounters?: HudCounter[]
    collectibles?: Collectible[]
}

export class World {
    player: Player
    lights: MovableObject[]
    backgrounds: MovableObject[]
    enemies: Enemy[]
    boss: Boss

    readonly canvasWidth: number
    readonly canvasHeight: number

    readonly worldLeft: number
    readonly worldRight: number

    private camera: Camera
    isFrozen = false
    isPaused = false

    private playerHud: PlayerHud
    private bossHud: BossHud
    private projectileManager: ProjectileManager
    private collisionManager: CollisionManager
    private collectibleManager: CollectibleManager

    private bossSequenceStarted = false
    private bossVisible = false
    private bossFightActive = false

    private endState: EndState = 'none'
    private pendingEndState: EndState = 'none'

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D | null

    private DEBUG_HITBOXES = false

    private lastFrameAt = 0

    constructor($canvas: HTMLCanvasElement, level: LevelLike) {
        this.canvas = $canvas
        this.ctx = $canvas.getContext('2d')

        this.canvasWidth = $canvas.width
        this.canvasHeight = $canvas.height

        this.player = level.player
        this.lights = level.lights
        this.backgrounds = level.backgrounds
        this.enemies = level.enemies
        this.boss = level.boss

        const { left, right } = this.getWorldBounds()
        this.worldLeft = left
        this.worldRight = right

        const cameraMinOffset = -(this.worldRight - this.canvasWidth)
        const cameraMaxOffset = -this.worldLeft
        this.camera = new Camera(this.canvasWidth, cameraMinOffset, cameraMaxOffset)

        this.playerHud = new PlayerHud(level.statusBars ?? [], level.hudCounters ?? [])
        this.bossHud = new BossHud(this.boss, this.canvasWidth, this.canvasHeight)
        this.projectileManager = new ProjectileManager(() => this.player.directionLeft, this.worldLeft, this.worldRight)
        this.collisionManager = new CollisionManager(6)
        this.collectibleManager = new CollectibleManager(level.collectibles ?? [])

        this.givePlayerWorldProperties()
        this.camera.syncToPlayer(this.player.x, this.player.width)
        bindRestartHandlers(this.canvas, () => this.endState)
    }

    addProjectile(projectile: Projectile | ProjectileConfig | ProjectileSpawn) {
        this.projectileManager.add(projectile)
    }

    private getWorldBounds() {
        const objects = [...(this.backgrounds ?? []), ...(this.lights ?? [])]
        
        if (objects.length === 0) {
            return { left: 0, right: this.canvasWidth }
        }

        const left = Math.min(...objects.map((o) => o.x))
        const right = Math.max(...objects.map((o) => o.x + o.width))

        return { left, right }
    }

    private get isStopped() {
        return this.isFrozen || this.isPaused
    }

    setCameraOffset(nextOffset: number) {
        this.camera.setOffset(nextOffset)

        if (!this.bossSequenceStarted && this.camera.isAtRightEdge()) {
            this.startBossIntroduceSequence()
        }
    }

    private startBossIntroduceSequence() {
        this.bossSequenceStarted = true
        this.bossVisible = true
        this.bossFightActive = false
        this.isFrozen = true

        const { right: viewRight } = this.camera.getViewBounds()

        this.freezeEnemies()

        this.boss.startIntroSequence(
            this.player,
            viewRight,
            this.worldLeft,
            this.worldRight,
            this.canvasHeight,
            40,
            () => this.onBossIntroComplete()
        )
    }

    private freezeEnemies(): void {
        for (const e of this.enemies) {
            e.freeze()
        }
    }

    private unfreezeEnemies(): void {
        for (const e of this.enemies) {
            e.unfreeze()
        }
    }

    private onBossIntroComplete(): void {
        this.isFrozen = false
        this.bossFightActive = true
        this.collisionManager.setBossCollisionGrace(900)

        if (!this.isPaused) {
            this.unfreezeEnemies()
        }
    }

    givePlayerWorldProperties() {
        this.player.world = this
    }

    setPaused(paused: boolean) {
        if (paused === this.isPaused) {
            return
        }

        this.isPaused = paused

        if (paused) {
            this.freezeEnemies()
            this.collectibleManager.freeze()
            this.playerHud.freeze()
            this.boss.freeze()

            return
        }

        this.collectibleManager.unfreeze()
        this.playerHud.unfreeze()
        
        if (!this.isFrozen) {
            this.unfreezeEnemies()
        }

        const keepBossFrozen = this.pendingEndState !== 'none' || this.endState !== 'none'
        if (!keepBossFrozen) {
            this.boss.unfreeze()
        }
    }

    private updateBossChase(dtMs: number) {
        if (this.isStopped || !this.bossVisible || !this.bossFightActive || this.player.isDead || this.boss.isDead) {
            return
        }

        this.boss.chasePlayer(this.player, dtMs, this.worldLeft, this.worldRight, this.canvasHeight)
    }

    private updatePickups() {
        if (this.isStopped) {
            return
        }

        this.collectibleManager.update(this.player)
    }

    private updateCollisions() {
        if (this.isStopped) {
            return
        }

        this.collisionManager.update(
            this.player,
            this.enemies,
            this.boss,
            this.bossVisible,
            (enemy) => this.onPlayerEnemyCollision(enemy),
            () => this.onPlayerBossCollision()
        )
    }

    private onPlayerEnemyCollision(enemy: Enemy) {
        const hurtVariant = enemy.getType() === 'pufferfish' ? 'poisoned' : 'electric-shock'
        
        this.player.takeDamage(enemy.damage, hurtVariant)
    }

    private onPlayerBossCollision() {
        const playerHpBefore = this.player.hp
        this.player.takeDamage(this.boss.damage, 'electric-shock')
        const playerTookDamage = this.player.hp < playerHpBefore
        if (playerTookDamage) {
            this.boss.playAttackOnce?.()
        }
    }

    private updateProjectiles(dtMs: number) {
        if (this.isStopped) {
            return
        }

        this.projectileManager.update(dtMs, this.enemies, this.boss, this.bossVisible)
    }

    private updateHud() {
        this.playerHud.update(this.player)
        this.bossHud.updateVisibleValues(this.bossVisible)
    }

    private updateEndState() {
        if (this.pendingEndState === 'lose' && this.endState === 'none') {
            if (this.player.isDeadAnimationFinished) {
                this.endState = 'lose'
            }

            return
        }

        if (this.endState !== 'none' || this.pendingEndState !== 'none') {
            return
        }
        
        if (this.player.isDead) {
            this.pendingEndState = 'lose'
            this.isFrozen = true
            this.bossFightActive = false

            this.freezeEnemies()
            this.boss.freeze()

            return
        }

        if (this.bossVisible && this.boss.isDead) {
            this.endState = 'win'
            this.isFrozen = true
            this.bossFightActive = false
            
            this.freezeEnemies()
            this.boss.freeze()
        }
    }

    private isHitboxProvider(o: any): o is HitboxProvider {
        return !!o && typeof o.getHitbox === 'function'
    }

    private drawHitbox(mo: any, color: string) {
        if (!this.ctx) {
            return
        }

        if (!this.isHitboxProvider(mo)) {
            return
        }

        const hb = mo.getHitbox()
        this.ctx.beginPath()
        this.ctx.lineWidth = 5
        this.ctx.strokeStyle = color
        this.ctx.rect(hb.x, hb.y, hb.width, hb.height)
        this.ctx.stroke()
    }

    draw = (now: number = performance.now()) => {
        const dtMs = this.lastFrameAt === 0 ? 0 : now - this.lastFrameAt
        this.lastFrameAt = now

        this.updateBossChase(dtMs)
        this.updateCollisions()
        this.updatePickups()
        this.updateProjectiles(dtMs)
        this.updateHud()
        this.updateEndState()

        this.enemies = this.enemies.filter((e: any) => !e?.shouldRemove)

        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx?.translate(this.camera.offset, 0)

        this.addObjectToCanvas(this.backgrounds)
        this.addObjectToCanvas(this.lights)

        this.collectibleManager.draw(this.ctx, this.DEBUG_HITBOXES, (c, color) => this.drawHitbox(c as any, color))

        this.addObjectToCanvas(this.enemies)

        this.addObjectToCanvas(this.projectileManager.getAll())

        if (this.bossVisible) {
            this.addToCanvas(this.boss as any)
        }

        this.addToCanvas(this.player as any)

        this.ctx?.translate(-this.camera.offset, 0)

        this.playerHud.draw(this.ctx)
        this.bossHud.draw(this.ctx, this.bossVisible)

        if (this.ctx) {
            drawEndScreen(this.ctx, this.canvasWidth, this.canvasHeight, this.endState)
        }

        requestAnimationFrame((t) => this.draw(t))
    }

    addObjectToCanvas(movableObjects: MovableObject[]) {
        for (const movableObject of movableObjects) {
            this.addToCanvas(movableObject)
        }
    }

    addToCanvas(movableObject: MovableObject) {
        if (!this.ctx) {
            return
        }

        const img = (movableObject as any).img as HTMLImageElement | undefined
        
        if (!img || !img.complete || img.naturalWidth === 0) {
            return
        }

        if (movableObject.directionLeft) {
            this.ctx.save()
            this.ctx.translate(movableObject.x + movableObject.width, movableObject.y)
            this.ctx.scale(-1, 1)

            this.ctx.drawImage(img, 0, 0, movableObject.width, movableObject.calculatedHeight)

            this.ctx.restore()
        } else {
            this.ctx.drawImage(img, movableObject.x, movableObject.y, movableObject.width, movableObject.calculatedHeight)
        }

        if (this.DEBUG_HITBOXES && this.isHitboxProvider(movableObject)) {
            const isPlayer = movableObject === (this.player as any)
            const isEnemy = movableObject instanceof Enemy

            const isColliding = isPlayer
                ? this.collisionManager.hasAnyCollision()
                : isEnemy
                    ? this.collisionManager.isCollidingWithEnemy(movableObject as any)
                    : false

            this.drawHitbox(movableObject as any, isColliding ? 'red' : 'blue')
        }
    }
}
