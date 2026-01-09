import { Projectile, type ProjectileConfig } from '@models/projectile.model'
import { assets } from '@root/utils/assets'

export type ProjectileSpawn = {
    x: number
    y: number
    poisoned?: boolean
    directionLeft?: boolean
}

export const createBubbleProjectile = (spawn: ProjectileSpawn, playerDirectionLeft: boolean): Projectile => {
    const poisoned = !!spawn.poisoned
    const directionLeft = typeof spawn.directionLeft === 'boolean' ? spawn.directionLeft : playerDirectionLeft

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

    const projectile = new Projectile(cfg)
    projectile.directionLeft = directionLeft

    return projectile
}
