/**
 * @fileoverview Projectile management system for player attack projectiles.
 * Handles projectile creation, updates, collision detection, and lifecycle management.
 */

import { Projectile, type ProjectileConfig } from '@models/projectile.model'
import type { Enemy } from '@models/enemy.model'
import type { Boss } from '@models/boss.model'
import { createBubbleProjectile, type ProjectileSpawn } from '@root/utils/projectile-factory'
import { isColliding } from '@root/utils/geometry'

/**
 * Projectile manager handling creation, updates, and collision detection
 */
export class ProjectileManager {
    /** Array of active projectiles */
    private projectiles: Projectile[] = []
    /** Function returning player's current direction */
    private readonly playerDirectionLeft: () => boolean
    /** Left boundary of the game world */
    private readonly worldLeft: number
    /** Right boundary of the game world */
    private readonly worldRight: number

    /**
     * Creates a new projectile manager
     * @param {Function} playerDirectionLeft - Function returning player direction
     * @param {number} worldLeft - Left world boundary
     * @param {number} worldRight - Right world boundary
     */
    constructor(
        playerDirectionLeft: () => boolean,
        worldLeft: number,
        worldRight: number
    ) {
        this.playerDirectionLeft = playerDirectionLeft
        this.worldLeft = worldLeft
        this.worldRight = worldRight
    }

    /**
     * Adds a new projectile to the manager
     * @param {Projectile | ProjectileConfig | ProjectileSpawn} projectile - Projectile instance or config
     */
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

    /**
     * Updates all projectiles and checks for collisions
     * @param {number} dtMs - Delta time in milliseconds
     * @param {Enemy[]} enemies - Array of enemies to check collisions with
     * @param {Boss} boss - Boss to check collisions with
     * @param {boolean} bossVisible - Whether boss is visible/active
     */
    update(dtMs: number, enemies: Enemy[], boss: Boss, bossVisible: boolean): void {
        if (this.projectiles.length === 0) {
            return
        }

        this.updatePositions(dtMs)
        this.checkHits(enemies, boss, bossVisible)
        this.removeExpired()
    }

    /**
     * Gets all active projectiles
     * @returns {Projectile[]} Array of projectiles
     */
    getAll(): Projectile[] {
        return this.projectiles
    }

    /**
     * Updates positions of all projectiles and marks out-of-bounds ones as expired
     * @param {number} dtMs - Delta time in milliseconds
     * @private
     */
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

    /**
     * Checks for projectile hits against enemies and boss
     * @param {Enemy[]} enemies - Enemies to check
     * @param {Boss} boss - Boss to check
     * @param {boolean} bossVisible - Whether boss is visible
     * @private
     */
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
    /**
     * Checks if projectile hits any enemy
     * @param {Projectile} p - Projectile to check
     * @param {Enemy[]} enemies - Enemies to check against
     * @returns {boolean} True if hit detected
     * @private
     */    private checkEnemyHits(projectile: Projectile, enemies: Enemy[]): boolean {
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
    /**
     * Checks if projectile hits the boss
     * @param {Projectile} p - Projectile to check
     * @param {Boss} boss - Boss to check against
     * @param {boolean} visible - Whether boss is visible
     * @private
     */    private checkBossHit(projectile: Projectile, boss: Boss, bossVisible: boolean): void {
        if (!projectile.isExpired && bossVisible && !boss.isDead && isColliding(projectile, boss, 0)) {
            boss.takeDamage(projectile.damage)
            projectile.expire()
        }
    }

    /**
     * Removes expired projectiles from the active list
     * @private
     */
    private removeExpired(): void {
        this.projectiles = this.projectiles.filter((p) => !p.isExpired)
    }
}
