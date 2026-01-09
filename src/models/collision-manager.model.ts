import type { Player } from '@models/player.model'
import type { Enemy } from '@models/enemy.model'
import type { Boss } from '@models/boss.model'
import { isColliding } from '@root/utils/geometry'

export class CollisionManager {
    private collidingEnemies = new Set<Enemy>()
    private collidingBoss = false
    private bossCollisionGraceUntil = 0
    private readonly collisionPadding: number

    constructor(collisionPadding: number = 6) {
        this.collisionPadding = collisionPadding
    }

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

    setBossCollisionGrace(graceMs: number): void {
        this.bossCollisionGraceUntil = Date.now() + graceMs
    }

    clear(): void {
        this.collidingEnemies.clear()
        this.collidingBoss = false
    }

    isCollidingWithEnemy(enemy: Enemy): boolean {
        return this.collidingEnemies.has(enemy)
    }

    isCollidingWithBoss(): boolean {
        return this.collidingBoss
    }

    hasAnyCollision(): boolean {
        return this.collidingEnemies.size > 0 || this.collidingBoss
    }

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
                // Always report collision; player handles hurt cooldown internally
                onCollision(enemy)
            }
        }

        this.collidingEnemies = next
    }

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
