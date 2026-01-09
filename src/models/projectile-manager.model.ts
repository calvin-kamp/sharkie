import { Projectile, type ProjectileConfig } from '@models/projectile.model'
import type { Enemy } from '@models/enemy.model'
import type { Boss } from '@models/boss.model'
import { createBubbleProjectile, type ProjectileSpawn } from '@root/utils/projectile-factory'
import { isColliding } from '@root/utils/geometry'

export class ProjectileManager {
    private projectiles: Projectile[] = []
    private readonly playerDirectionLeft: () => boolean
    private readonly worldLeft: number
    private readonly worldRight: number

    constructor(
        playerDirectionLeft: () => boolean,
        worldLeft: number,
        worldRight: number
    ) {
        this.playerDirectionLeft = playerDirectionLeft
        this.worldLeft = worldLeft
        this.worldRight = worldRight
    }

    add(projectile: Projectile | ProjectileConfig | ProjectileSpawn): void {
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

        const spawn = projectile as ProjectileSpawn
        const bubble = createBubbleProjectile(spawn, this.playerDirectionLeft())
        this.projectiles.push(bubble)
    }

    update(dtMs: number, enemies: Enemy[], boss: Boss, bossVisible: boolean): void {
        if (this.projectiles.length === 0) {
            return
        }

        this.updatePositions(dtMs)
        this.checkHits(enemies, boss, bossVisible)
        this.removeExpired()
    }

    getAll(): Projectile[] {
        return this.projectiles
    }

    private updatePositions(dtMs: number): void {
        const leftBound = this.worldLeft - 200
        const rightBound = this.worldRight + 200

        for (const p of this.projectiles) {
            if (!p || typeof (p as any).update !== 'function') {
                continue
            }

            p.update(dtMs)

            if (p.x + p.width < leftBound || p.x > rightBound) {
                p.expire()
            }
        }
    }

    private checkHits(enemies: Enemy[], boss: Boss, bossVisible: boolean): void {
        for (const p of this.projectiles) {
            if (p.isExpired) {
                continue
            }

            if (this.checkEnemyHits(p, enemies)) {
                continue
            }

            this.checkBossHit(p, boss, bossVisible)
        }
    }

    private checkEnemyHits(projectile: Projectile, enemies: Enemy[]): boolean {
        for (const enemy of enemies) {
            if (enemy.isDead) {
                continue
            }

            if (isColliding(projectile, enemy, 0)) {
                enemy.takeDamage(projectile.damage)
                projectile.expire()
                return true
            }
        }
        return false
    }

    private checkBossHit(projectile: Projectile, boss: Boss, bossVisible: boolean): void {
        if (!projectile.isExpired && bossVisible && !boss.isDead && isColliding(projectile, boss, 0)) {
            boss.takeDamage(projectile.damage)
            projectile.expire()
        }
    }

    private removeExpired(): void {
        this.projectiles = this.projectiles.filter((p) => !p.isExpired)
    }
}
