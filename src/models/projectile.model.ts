/**
 * @fileoverview Projectile model for player attack projectiles (bubbles).
 * Manages projectile movement, lifetime, and damage properties.
 */

import { MovableObject, type HitboxConfig, type MovableObjectConfig } from '@models/movable-object.model'

/**
 * Configuration for creating projectiles
 * @typedef {Object} ProjectileConfig
 * @property {number} vx - Horizontal velocity
 * @property {number} damage - Damage dealt on hit
 * @property {number} ttlMs - Time to live in milliseconds
 * @property {HitboxConfig} [hitbox] - Collision hitbox configuration
 */
export interface ProjectileConfig extends MovableObjectConfig {
    vx: number
    damage: number
    ttlMs: number
    hitbox?: HitboxConfig
}

/**
 * Projectile class for player attack projectiles
 * Handles movement, lifetime tracking, and damage properties
 */
export class Projectile extends MovableObject {
    vx: number
    damage: number
    ttlMs: number
    private aliveForMs = 0

    constructor(config: ProjectileConfig) {
        super(config)

        this.vx = config.vx
        this.damage = config.damage
        this.ttlMs = config.ttlMs

        if (config.hitbox) {
            this.setHitbox(config.hitbox)
        }
    }

    /**
     * Updates projectile position and lifetime
     * @param {number} dtMs - Delta time in milliseconds
     */
    update(dtMs: number) {
        this.x += this.vx * (dtMs / 16.67)
        this.aliveForMs += dtMs
    }

    /**
     * Forces projectile to expire immediately
     */
    expire() {
        this.aliveForMs = this.ttlMs
    }

    /**
     * Checks if projectile has exceeded its lifetime
     * @returns {boolean} True if projectile should be removed
     */
    get isExpired() {
        return this.aliveForMs >= this.ttlMs
    }
}
