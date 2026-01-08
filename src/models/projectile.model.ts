import { MovableObject, type HitboxConfig, type MovableObjectConfig } from '@models/movable-object.model'

export interface ProjectileConfig extends MovableObjectConfig {
    vx: number
    damage: number
    ttlMs: number
    hitbox?: HitboxConfig
}

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

    update(dtMs: number) {
        this.x += this.vx * (dtMs / 16.67)
        this.aliveForMs += dtMs
    }

    expire() {
        this.aliveForMs = this.ttlMs
    }

    get isExpired() {
        return this.aliveForMs >= this.ttlMs
    }
}
