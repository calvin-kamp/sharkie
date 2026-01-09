/**
 * @fileoverview Collision detection and management system.
 * Handles detection and response for player collisions with enemies and boss.
 */

import type { Player } from '@models/player.model'
import type { Enemy } from '@models/enemy.model'
import type { Boss } from '@models/boss.model'
import { isColliding } from '@root/utils/geometry'

/**
 * Collision manager handling player collisions with enemies and boss
 */
export class CollisionManager {
    /** Set of enemies currently colliding with player */
    private collidingEnemies = new Set<Enemy>()
    /** Whether boss is currently colliding with player */
    private collidingBoss = false
    /** Timestamp until which boss collision is ignored (grace period) */
    private bossCollisionGraceUntil = 0
    /** Padding to apply to collision hitboxes */
    private readonly collisionPadding: number

    /**
     * Creates a new collision manager
     * @param {number} [collisionPadding=6] - Padding for collision detection
     */
    constructor(collisionPadding: number = 6) {
        this.collisionPadding = collisionPadding
    }

    /**
     * Updates collision detection for all entities
     * @param {Player} player - The player to check collisions for
     * @param {Enemy[]} enemies - Array of enemies to check
     * @param {Boss} boss - The boss to check
     * @param {boolean} bossVisible - Whether boss is visible/active
     * @param {Function} onEnemyCollision - Callback when enemy collision occurs
     * @param {Function} onBossCollision - Callback when boss collision occurs
     */
    update(
        player: Player,
        enemies: Enemy[],
        boss: Boss,
        bossVisible: boolean,
        onEnemyCollision: (enemy: Enemy) => void,
        onBossCollision: () => void
    ): void {
        if (player.isDead) {
            this.clear()
            return
        }

        this.updateEnemyCollisions(player, enemies, onEnemyCollision)
        this.updateBossCollision(player, boss, bossVisible, onBossCollision)
    }

    /**
     * Sets a grace period during which boss collisions are ignored
     * @param {number} graceMs - Grace period in milliseconds
     */
    setBossCollisionGrace(graceMs: number): void {
        this.bossCollisionGraceUntil = Date.now() + graceMs
    }

    /**
     * Clears all collision states
     */
    clear(): void {
        this.collidingEnemies.clear()
        this.collidingBoss = false
    }

    /**
     * Checks if a specific enemy is currently colliding
     * @param {Enemy} enemy - The enemy to check
     * @returns {boolean} True if currently colliding
     */
    isCollidingWithEnemy(enemy: Enemy): boolean {
        return this.collidingEnemies.has(enemy)
    }

    /**
     * Checks if boss is currently colliding with player
     * @returns {boolean} True if boss is colliding
     */
    isCollidingWithBoss(): boolean {
        return this.collidingBoss
    }

    /**
     * Checks if any collision (enemy or boss) is active
     * @returns {boolean} True if any collision exists
     */
    hasAnyCollision(): boolean {
        return this.collidingEnemies.size > 0 || this.collidingBoss
    }

    /**
     * Updates enemy collision states
     * @param {Player} player - Player to check
     * @param {Enemy[]} enemies - Enemies to check
     * @param {Function} onCollision - Collision callback
     * @private
     */
    private updateEnemyCollisions(
        player: Player,
        enemies: Enemy[],
        onCollision: (enemy: Enemy) => void
    ): void {
        const next = new Set<Enemy>()

        for (const enemy of enemies) {
            if (enemy.isDead) {
                continue
            }

            if (isColliding(player, enemy, this.collisionPadding)) {
                next.add(enemy)
                onCollision(enemy)
            }
        }

        this.collidingEnemies = next
    }

    /**
     * Updates boss collision state
     * @param {Player} player - Player to check
     * @param {Boss} boss - Boss to check
     * @param {boolean} bossVisible - Whether boss is visible
     * @param {Function} onCollision - Collision callback
     * @private
     */
    private updateBossCollision(
        player: Player,
        boss: Boss,
        bossVisible: boolean,
        onCollision: () => void
    ): void {
        if (!bossVisible || boss.isDead) {
            this.collidingBoss = false
            return
        }

        if (Date.now() < this.bossCollisionGraceUntil) {
            this.collidingBoss = false
            return
        }

        const bossNow = isColliding(player, boss, this.collisionPadding)

        if (bossNow) {
            onCollision()
        }

        this.collidingBoss = bossNow
    }
}
