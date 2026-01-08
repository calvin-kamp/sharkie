import { MovableObject } from '@models/movable-object.model'
import type { Player } from '@models/player.model'
import type { Boss } from '@models/boss.model'
import { Enemy } from '@models/enemy.model'
import { Projectile, type ProjectileConfig } from '@models/projectile.model'
import { assets } from '@root/utils/assets'

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

type Rect = { x: number; y: number; width: number; height: number }
type HitboxProvider = { getHitbox: () => Rect }

export class World {
    player: Player
    lights: MovableObject[]
    backgrounds: MovableObject[]
    enemies: Enemy[]
    boss: Boss

    statusBars: StatusBar[] = []
    hudCounters: HudCounter[] = []
    collectibles: Collectible[] = []

    projectiles: Projectile[] = []

    readonly canvasWidth: number
    readonly canvasHeight: number

    readonly worldLeft: number
    readonly worldRight: number

    readonly cameraMinOffset: number
    readonly cameraMaxOffset: number

    cameraOffset = 0
    isFrozen = false
    isPaused = false

    private bossStatusBar: StatusBar | null = null
    private readonly bossDisplayName = 'Willy the Whale'

    private bossSequenceStarted = false
    private bossVisible = false
    private bossFightActive = false

    private endState: 'none' | 'win' | 'lose' = 'none'
    private pendingEndState: 'none' | 'win' | 'lose' = 'none'

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D | null

    private DEBUG_HITBOXES = false
    private collisionPadding = 6
    private collidingEnemies = new Set<Enemy>()
    private collidingBoss = false

    private bossCollisionGraceUntil = 0

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

        this.statusBars = level.statusBars ?? []
        this.hudCounters = level.hudCounters ?? []
        this.collectibles = level.collectibles ?? []

        const { left, right } = this.getWorldBounds()
        this.worldLeft = left
        this.worldRight = right

        this.cameraMinOffset = -(this.worldRight - this.canvasWidth)
        this.cameraMaxOffset = -this.worldLeft

        this.givePlayerWorldProperties()
        this.syncCameraToPlayer()
        this.bindRestartHandlers()
    }

    private syncCameraToPlayer() {
        const playerCenterX = this.player.x + this.player.width / 2
        const initialOffset = -(playerCenterX - this.canvasWidth / 2)
        
        this.cameraOffset = this.clamp(initialOffset, this.cameraMinOffset, this.cameraMaxOffset)
    }

    addProjectile(
        projectile:
            | Projectile
            | ProjectileConfig
            | {
                  x: number
                  y: number
                  poisoned?: boolean
                  directionLeft?: boolean
              }
    ) {
        if (projectile instanceof Projectile) {
            this.projectiles.push(projectile)
            
            return
        }

        const maybeConfig = projectile as Partial<ProjectileConfig>
        if (
            typeof maybeConfig.imageSrc === 'string' &&
            typeof maybeConfig.vx === 'number' &&
            typeof maybeConfig.damage === 'number' &&
            typeof maybeConfig.ttlMs === 'number'
        ) {
            this.projectiles.push(new Projectile(maybeConfig as ProjectileConfig))
            
            return
        }

        const spawn = projectile as {
            x: number
            y: number
            poisoned?: boolean
            directionLeft?: boolean
        }

        const poisoned = !!spawn.poisoned
        const directionLeft =
            typeof spawn.directionLeft === 'boolean' ? spawn.directionLeft : this.player.directionLeft

        const width = 42
        const vx = (directionLeft ? -1 : 1) * 8
        const imageSrc = poisoned
            ? assets.player.attack.bubbleTrap('bubble-poisoned.png')
            : assets.player.attack.bubbleTrap('bubble.png')

        const cfg: ProjectileConfig = {
            imageSrc,
            x: spawn.x,
            y: spawn.y,
            width,
            aspectRatio: 1,
            vx,
            damage: poisoned ? 2 : 1,
            ttlMs: 1200,
            hitbox: {
                offsetX: Math.floor(width * 0.2),
                offsetY: Math.floor(width * 0.2),
                width: Math.floor(width * 0.6),
                height: Math.floor(width * 0.6),
            },
        }

        const p = new Projectile(cfg)
        
        p.directionLeft = directionLeft
        this.projectiles.push(p)
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

    private clamp(value: number, min: number, max: number) {
        return Math.max(min, Math.min(max, value))
    }

    private get isStopped() {
        return this.isFrozen || this.isPaused
    }

    private getBossBounds() {
        const hb = this.boss.getHitbox()
        const offsetX = hb.x - this.boss.x
        const offsetY = hb.y - this.boss.y

        const minX = this.worldLeft - offsetX
        const maxX = this.worldRight - (offsetX + hb.width)

        const minY = -offsetY
        const maxY = this.canvasHeight - (offsetY + hb.height)

        return { minX, maxX, minY, maxY }
    }

    private isAtRightEdge() {
        return Math.abs(this.cameraOffset - this.cameraMinOffset) < 0.5
    }

    setCameraOffset(nextOffset: number) {
        this.cameraOffset = this.clamp(nextOffset, this.cameraMinOffset, this.cameraMaxOffset)

        if (!this.bossSequenceStarted && this.isAtRightEdge()) {
            this.startBossIntroduceSequence()
        }
    }

    private startBossIntroduceSequence() {
        this.bossSequenceStarted = true
        this.bossVisible = true
        this.bossFightActive = false
        this.isFrozen = true

        this.ensureBossStatusBar()

        const viewLeft = -this.cameraOffset
        const viewRight = viewLeft + this.canvasWidth
        const spawnGap = 40

        this.boss.x = viewRight - this.boss.width - 40
        this.boss.y = this.player.y - 40

        const bossCx = this.boss.x + this.boss.width / 2
        const playerCx = this.player.x + this.player.width / 2
        this.boss.directionLeft = playerCx - bossCx > 0

        const bossBounds = this.getBossBounds()
        this.boss.y = this.clamp(this.boss.y, bossBounds.minY, bossBounds.maxY)

        const playerHb = this.player.getHitbox()
        let bossHb = this.boss.getHitbox()
        
        const requiredBossLeft = playerHb.x + playerHb.width + spawnGap
        
        if (bossHb.x < requiredBossLeft) {
            const offsetX = bossHb.x - this.boss.x
            this.boss.x = requiredBossLeft - offsetX
            bossHb = this.boss.getHitbox()
        }

        for (const e of this.enemies) {
            e.freeze()
        }

        this.boss.playIntroduceOnce(() => {
            this.isFrozen = false
            this.bossFightActive = true

            this.bossCollisionGraceUntil = Date.now() + 900
            this.collidingBoss = false

            if (!this.isPaused) {
                for (const e of this.enemies) {
                    e.unfreeze()
                }
            }
        })
    }

    private ensureBossStatusBar() {
        if (this.bossStatusBar) {
            return
        }

        const barWidth = 420
        const barHeight = Math.floor(barWidth * (158 / 595))
        const marginBottom = 18

        const x = Math.floor((this.canvasWidth - barWidth) / 2)
        const y = Math.floor(this.canvasHeight - barHeight - marginBottom)

        this.bossStatusBar = new StatusBar({
            type: 'life',
            color: 'orange',
            x,
            y,
            width: barWidth,
            maxValue: this.boss.maxHp,
            value: this.boss.hp,
        })
    }

    givePlayerWorldProperties() {
        this.player.world = this
    }

    private bindRestartHandlers() {
        this.canvas.addEventListener('click', () => {
            if (this.endState === 'none') {
                return
            }

            window.location.reload()
        })

        document.addEventListener('keydown', (e) => {
            if (this.endState === 'none') {
                return
            }
            
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'r' || e.key === 'R') {
                window.location.reload()
            }
        })
    }

    setPaused(paused: boolean) {
        if (paused === this.isPaused) {
            return
        }

        this.isPaused = paused

        if (paused) {
            for (const e of this.enemies) {
                e.freeze()
            }

            for (const c of this.collectibles) {
                c.freeze()
            }

            for (const hc of this.hudCounters) {
                hc.freeze()
            }

            this.boss.freeze()

            return
        }

        for (const c of this.collectibles) {
            c.unfreeze()
        }

        for (const hc of this.hudCounters) {
            hc.unfreeze()
        }
        
        if (!this.isFrozen) {
            for (const e of this.enemies) {
                e.unfreeze()
            }

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

        const dt = Math.max(0, dtMs) / 16.6667

        const bossHb = this.boss.getHitbox()
        const playerHb = this.player.getHitbox()

        const bossCx = bossHb.x + bossHb.width / 2
        const bossCy = bossHb.y + bossHb.height / 2
        const playerCx = playerHb.x + playerHb.width / 2
        const playerCy = playerHb.y + playerHb.height / 2

        const dx = playerCx - bossCx
        const dy = playerCy - bossCy

        this.boss.directionLeft = dx > 0

        const speedX = 2.2 * dt
        const speedY = 3.0 * dt

        if (Math.abs(dx) > 0.5) {
            this.boss.x += Math.sign(dx) * Math.min(speedX, Math.abs(dx))
        }

        if (Math.abs(dy) > 0.5) {
            this.boss.y += Math.sign(dy) * Math.min(speedY, Math.abs(dy))
        }
        
        const b = this.getBossBounds()
        
        this.boss.x = this.clamp(this.boss.x, b.minX, b.maxX)
        this.boss.y = this.clamp(this.boss.y, b.minY, b.maxY)
    }

    private padRect(r: Rect, pad: number): Rect {
        return {
            x: r.x + pad,
            y: r.y + pad,
            width: Math.max(0, r.width - pad * 2),
            height: Math.max(0, r.height - pad * 2),
        }
    }

    private rectsIntersect(a: Rect, b: Rect) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        )
    }

    private isColliding(a: HitboxProvider, b: HitboxProvider, padding = 0) {
        const ra = this.padRect(a.getHitbox(), padding)
        const rb = this.padRect(b.getHitbox(), padding)
        return this.rectsIntersect(ra, rb)
    }

    private updatePickups() {
        if (this.isStopped || this.player.isDead || this.collectibles.length === 0) {
            return
        }
        
        const remaining: Collectible[] = []

        for (const c of this.collectibles) {
            if ((c as any).isCollected) {
                continue
            }

            if (this.isColliding(this.player, c, 0)) {
                (c as any).collect?.()

                if ((c as any).type === 'coin') {
                    this.player.addCoins((c as any).value ?? 1)
                    console.log(`[PICKUP] COIN -> coins: ${this.player.coins}`)
                } else {
                    this.player.addPoisonBottles((c as any).value ?? 1)
                    console.log(`[PICKUP] POISON -> poison: ${this.player.poisonBottles}`)
                }

                continue
            }

            remaining.push(c)
        }

        this.collectibles = remaining
    }

    private updateCollisions() {
        if (this.isStopped || this.player.isDead) {
            this.collidingEnemies.clear()
            this.collidingBoss = false

            return
        }

        const next = new Set<Enemy>()

        for (const enemy of this.enemies) {
            if (enemy.isDead) {
                continue
            }

            if (this.isColliding(this.player, enemy, this.collisionPadding)) {
                next.add(enemy)
                
                if (!this.collidingEnemies.has(enemy)) {
                    this.onPlayerEnemyCollision(enemy)
                }
            }
        }

        this.collidingEnemies = next

        if (this.bossVisible && !this.boss.isDead) {
            
            if (Date.now() < this.bossCollisionGraceUntil) {
                this.collidingBoss = false
            
            } else {
            
                const bossNow = this.isColliding(this.player, this.boss, this.collisionPadding)

                if (bossNow && !this.collidingBoss) {
                    this.onPlayerBossCollision()
                }

                this.collidingBoss = bossNow
            }
        } else {
            this.collidingBoss = false
        }
    }

    private onPlayerEnemyCollision(enemy: Enemy) {
        const hurtVariant = enemy.getType() === 'pufferfish' ? 'poisoned' : 'electric-shock'
        
        this.player.takeDamage(enemy.damage, hurtVariant)
    }

    private onPlayerBossCollision() {
        this.player.takeDamage(this.boss.damage, 'electric-shock')
        this.boss.playAttackOnce?.()
    }

    private updateProjectiles(dtMs: number) {
        if (this.isStopped || this.projectiles.length === 0) {
            return
        }

        const leftBound = this.worldLeft - 200
        const rightBound = this.worldRight + 200

        const normalized: Projectile[] = []

        for (const p of this.projectiles) {
            if (!p || typeof (p as any).update !== 'function' || typeof (p as any).expire !== 'function') {
                console.warn('[PROJECTILE] removed invalid projectile entry:', p)
                
                continue
            }

            p.update(dtMs)

            if (p.x + p.width < leftBound || p.x > rightBound) {
                p.expire()
            }

            normalized.push(p)
        }

        this.projectiles = normalized.filter((p) => !p.isExpired)

        for (const p of this.projectiles) {
            if (p.isExpired) {
                continue
            }

            for (const enemy of this.enemies) {
                if (enemy.isDead) {
                    continue
                }

                if (this.isColliding(p, enemy, 0)) {
                    enemy.takeDamage(p.damage)

                    if ((p as any).expire) {
                        p.expire()
                    }
                    
                    break

                }
            }

            if (!p.isExpired && this.bossVisible && !this.boss.isDead && this.isColliding(p, this.boss, 0)) {
                this.boss.takeDamage(p.damage)
                p.expire()
            }
        }

        this.projectiles = this.projectiles.filter((p) => !p.isExpired)
    }

    private updateHud() {
        for (const bar of this.statusBars) {
            (bar as any).setMaxValue?.(this.player.maxHp)
            (bar as any).setValue?.(this.player.hp)
        }

        for (const c of this.hudCounters) {
            if ((c as any).type === 'poison') {
                (c as any).setValue?.(this.player.poisonBottles)
            } 
    
            if ((c as any).type === 'coin') {
                (c as any).setValue?.(this.player.coins)
            } 
        }

        if (this.bossStatusBar && this.bossVisible) {
            this.bossStatusBar.setMaxValue(this.boss.maxHp)
            this.bossStatusBar.setValue(this.boss.hp)
        }
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

            for (const e of this.enemies) {
                e.freeze()
            }

            this.boss.freeze()

            return
        }

        if (this.bossVisible && this.boss.isDead) {
            this.endState = 'win'
            this.isFrozen = true
            this.bossFightActive = false
            
            for (const e of this.enemies) {
                e.freeze()
            }

            this.boss.freeze()
        }
    }

    private drawEndScreen() {
        if (this.endState === 'none' || !this.ctx) {
            return
        }

        const ctx = this.ctx

        ctx.save()
        ctx.globalAlpha = 0.65
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        ctx.restore()

        const title = this.endState === 'win' ? 'YOU WIN' : 'TRY AGAIN'
        const hint = 'Click / Enter / Space / R'

        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.font = '72px "Luckiest Guy", Arial'
        ctx.lineWidth = 8
        ctx.strokeStyle = 'rgba(0,0,0,0.75)'
        ctx.fillStyle = '#fff'
        ctx.strokeText(title, this.canvasWidth / 2, this.canvasHeight * 0.45)
        ctx.fillText(title, this.canvasWidth / 2, this.canvasHeight * 0.45)

        ctx.font = '22px Arial'
        ctx.lineWidth = 5
        ctx.strokeText(hint, this.canvasWidth / 2, this.canvasHeight * 0.58)
        ctx.fillText(hint, this.canvasWidth / 2, this.canvasHeight * 0.58)

        ctx.restore()
    }

    private drawBossHud() {
        if (!this.ctx || !this.bossVisible) {
            return
        }
        
        this.ensureBossStatusBar()
        
        if (!this.bossStatusBar) {
            return
        }

        const bar = this.bossStatusBar as any
        const img = bar.img as HTMLImageElement | undefined
        const ctx = this.ctx

        const hasSprite = !!(img && img.complete && img.naturalWidth > 0)

        if (hasSprite) {
            ctx.drawImage(img as HTMLImageElement, bar.x, bar.y, bar.width, bar.calculatedHeight)
        } else {
            const maxHp = Math.max(1, this.boss.maxHp)
            const ratio = Math.max(0, Math.min(1, this.boss.hp / maxHp))

            const x = bar.x
            const y = bar.y
            const w = bar.width
            const h = bar.calculatedHeight
            const pad = 8

            ctx.save()
            ctx.fillStyle = 'rgba(0,0,0,0.55)'
            ctx.fillRect(x, y, w, h)

            ctx.lineWidth = 3
            ctx.strokeStyle = 'rgba(255,255,255,0.85)'
            ctx.strokeRect(x, y, w, h)

            const innerW = Math.max(0, w - pad * 2)
            const innerH = Math.max(0, h - pad * 2)
            const fillW = Math.floor(innerW * ratio)
            ctx.fillStyle = 'rgba(255, 69, 58, 0.9)'
            ctx.fillRect(x + pad, y + pad, fillW, innerH)

            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = '16px Arial'
            ctx.lineWidth = 4
            ctx.strokeStyle = 'rgba(0,0,0,0.7)'
            ctx.fillStyle = '#fff'
            const hpText = `${Math.max(0, Math.ceil(this.boss.hp))} / ${maxHp}`
            ctx.strokeText(hpText, x + w / 2, y + h / 2)
            ctx.fillText(hpText, x + w / 2, y + h / 2)
            ctx.restore()
        }

        const visibleTopY = bar.y + bar.calculatedHeight * 0.22
        const nameY = Math.max(28, Math.floor(visibleTopY + 30))

        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.font = '26px "Luckiest Guy", Arial'

        ctx.lineWidth = 6
        ctx.lineJoin = 'round'
        ctx.miterLimit = 2

        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        ctx.strokeStyle = 'rgba(0,0,0,0.75)'
        ctx.fillStyle = '#fff'

        const x = Math.round(this.canvasWidth / 2)
        const y = Math.round(nameY)

        ctx.strokeText(this.bossDisplayName, x, y)
        ctx.fillText(this.bossDisplayName, x, y)
        ctx.restore()
    }

    private drawHitbox(mo: HitboxProvider, color: string) {
        if (!this.ctx) {
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

        this.ctx?.translate(this.cameraOffset, 0)

        this.addObjectToCanvas(this.backgrounds)
        this.addObjectToCanvas(this.lights)

        this.addCollectiblesToCanvas(this.collectibles)

        this.addObjectToCanvas(this.enemies)

        this.addObjectToCanvas(this.projectiles)

        if (this.bossVisible) {
            this.addToCanvas(this.boss as any)
        }

        this.addToCanvas(this.player as any)

        this.ctx?.translate(-this.cameraOffset, 0)

        this.addStatusBarsToCanvas(this.statusBars)
        this.addHudCountersToCanvas(this.hudCounters)

        this.drawBossHud()

        this.drawEndScreen()

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

        if (this.DEBUG_HITBOXES) {
            const isPlayer = movableObject === (this.player as any)
            const isColliding = isPlayer
                ? this.collidingEnemies.size > 0 || this.collidingBoss
                : this.collidingEnemies.has(movableObject as any)
            this.drawHitbox(movableObject as any, isColliding ? 'red' : 'blue')
        }
    }

    private addCollectiblesToCanvas(collectibles: Collectible[]) {
        if (!this.ctx) {
            return
        }

        for (const c of collectibles) {
            if ((c as any).isCollected) {
                continue
            }

            this.ctx.drawImage((c as any).img, (c as any).x, (c as any).y, (c as any).width, (c as any).calculatedHeight)

            if (this.DEBUG_HITBOXES) {
                this.drawHitbox(c as any, 'lime')
            }
        }
    }

    private addStatusBarsToCanvas(bars: StatusBar[]) {
        if (!this.ctx) {
            return
        }

        for (const bar of bars) {
            this.ctx.drawImage(
                (bar as any).img,
                (bar as any).x,
                (bar as any).y,
                (bar as any).width,
                (bar as any).calculatedHeight
            )
        }
    }

    private addHudCountersToCanvas(counters: HudCounter[]) {
        if (!this.ctx) {
            return
        }
        
        for (const c of counters) {
            (c as any).draw?.(this.ctx)
        }
    }
}
