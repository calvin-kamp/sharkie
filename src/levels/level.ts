import { Level, type Difficulty } from '@models/level.model'
import { Enemy } from '@models/enemy.model'
import { Boss } from '@models/boss.model'
import { Collectible } from '@models/collectible.model'
import { assets } from '@root/utils/assets'

import { DIFFICULTY_STATS, LEVEL_COLLECTIBLES } from '@root/utils/level-config'

const COIN_FRAMES = [
    assets.misc.hud.coin('coin-1.png'),
    assets.misc.hud.coin('coin-2.png'),
    assets.misc.hud.coin('coin-3.png'),
    assets.misc.hud.coin('coin-4.png'),
]

const POISON_FRAMES = [
    assets.misc.hud.poison('poison-animated-1.png', true),
    assets.misc.hud.poison('poison-animated-2.png', true),
    assets.misc.hud.poison('poison-animated-3.png', true),
    assets.misc.hud.poison('poison-animated-4.png', true),
    assets.misc.hud.poison('poison-animated-5.png', true),
    assets.misc.hud.poison('poison-animated-6.png', true),
    assets.misc.hud.poison('poison-animated-7.png', true),
    assets.misc.hud.poison('poison-animated-8.png', true),
]

const createCoin = (x: number, y: number) =>
    new Collectible({
        type: 'coin',
        imageSrc: COIN_FRAMES[0],
        frames: COIN_FRAMES,
        fps: 8,
        x,
        y,
        width: 40,
        aspectRatio: 1,
    })

const createPoison = (x: number, y: number) =>
    new Collectible({
        type: 'poison',
        imageSrc: POISON_FRAMES[0],
        frames: POISON_FRAMES,
        fps: 10,
        x,
        y,
        width: 45,
        aspectRatio: 1,
    })

export const createLevel = (difficulty: Difficulty = 'medium') => {
    const stats = DIFFICULTY_STATS[difficulty]

    const bossWidth = 450
    const bossAspectRatio = 1041 / 1216
    const bossHeight = bossWidth * bossAspectRatio

    const boss = new Boss({
        width: bossWidth,
        aspectRatio: bossAspectRatio,
        imagesIntroduce: [
            assets.enemies.boss('boss-introduce-1.png', 'introduce'),
            assets.enemies.boss('boss-introduce-2.png', 'introduce'),
            assets.enemies.boss('boss-introduce-3.png', 'introduce'),
            assets.enemies.boss('boss-introduce-4.png', 'introduce'),
            assets.enemies.boss('boss-introduce-5.png', 'introduce'),
            assets.enemies.boss('boss-introduce-6.png', 'introduce'),
            assets.enemies.boss('boss-introduce-7.png', 'introduce'),
            assets.enemies.boss('boss-introduce-8.png', 'introduce'),
            assets.enemies.boss('boss-introduce-9.png', 'introduce'),
            assets.enemies.boss('boss-introduce-10.png', 'introduce'),
        ],
        imagesFloating: [
            assets.enemies.boss('boss-floating-1.png', 'floating'),
            assets.enemies.boss('boss-floating-2.png', 'floating'),
            assets.enemies.boss('boss-floating-3.png', 'floating'),
            assets.enemies.boss('boss-floating-4.png', 'floating'),
            assets.enemies.boss('boss-floating-5.png', 'floating'),
            assets.enemies.boss('boss-floating-6.png', 'floating'),
            assets.enemies.boss('boss-floating-7.png', 'floating'),
            assets.enemies.boss('boss-floating-8.png', 'floating'),
            assets.enemies.boss('boss-floating-9.png', 'floating'),
            assets.enemies.boss('boss-floating-10.png', 'floating'),
            assets.enemies.boss('boss-floating-11.png', 'floating'),
            assets.enemies.boss('boss-floating-12.png', 'floating'),
            assets.enemies.boss('boss-floating-13.png', 'floating'),
        ],
        imagesAttack: [
            assets.enemies.boss('boss-attack-1.png', 'attack'),
            assets.enemies.boss('boss-attack-2.png', 'attack'),
            assets.enemies.boss('boss-attack-3.png', 'attack'),
            assets.enemies.boss('boss-attack-4.png', 'attack'),
            assets.enemies.boss('boss-attack-5.png', 'attack'),
            assets.enemies.boss('boss-attack-6.png', 'attack'),
        ],
        imagesDead: [
            assets.enemies.boss('boss-dead-1.png', 'dead'),
            assets.enemies.boss('boss-dead-2.png', 'dead'),
            assets.enemies.boss('boss-dead-3.png', 'dead'),
            assets.enemies.boss('boss-dead-4.png', 'dead'),
            assets.enemies.boss('boss-dead-5.png', 'dead'),
            assets.enemies.boss('boss-dead-6.png', 'dead'),
        ],
        imagesHurt: [
            assets.enemies.boss('boss-hurt-1.png', 'hurt'),
            assets.enemies.boss('boss-hurt-2.png', 'hurt'),
            assets.enemies.boss('boss-hurt-3.png', 'hurt'),
            assets.enemies.boss('boss-hurt-4.png', 'hurt'),
        ],
        combat: { maxHp: stats.bossHp, damage: stats.bossDmg },
    })

    boss.setHitbox({
        offsetX: Math.round(bossWidth * 0.05),
        offsetY: Math.round(bossHeight * 0.38),
        width: Math.round(bossWidth * 0.86),
        height: Math.round(bossHeight * 0.45),
    })

    const collectibles = [
        ...LEVEL_COLLECTIBLES.coins.map((p) => createCoin(p.x, p.y)),
        ...LEVEL_COLLECTIBLES.poisons.map((p) => createPoison(p.x, p.y)),
    ]

    // Add more collectibles spread across the map
    const extraCoins = Array.from({ length: 12 }, (_, i) => ({ x: 350 + i * 190, y: 200 + (i % 4) * 60 }))
    const extraPoisons = Array.from({ length: 6 }, (_, i) => ({ x: 700 + i * 280, y: 350 + (i % 2) * 50 }))
    collectibles.push(...extraCoins.map((p) => createCoin(p.x, p.y)))
    collectibles.push(...extraPoisons.map((p) => createPoison(p.x, p.y)))

    // Helper to generate spaced enemies
    const spawnSpaced = (type: 'jellyfish' | 'pufferfish', count: number, hp: number, dmg: number, startX: number, gap: number) =>
        Array.from({ length: count }, (_, i) => new Enemy({ x: startX + i * gap }, type, { maxHp: hp, damage: dmg }))

    const enemies = [
        // Regular jellyfish, more count, spaced out
        ...spawnSpaced('jellyfish', 4, stats.jellyfishHp, stats.jellyfishDmg, 300, 260),
        // Pufferfish, more count, spaced out
        ...spawnSpaced('pufferfish', 6, stats.pufferfishHp, stats.pufferfishDmg, 800, 240),
        // Super jellyfish
        ...spawnSpaced('jellyfish', 3, stats.jellyfishSuperHp, stats.jellyfishSuperDmg, 1600, 260),
    ]

    return new Level(
        enemies,
        boss,
        collectibles,
        {
            difficulty,
            playerCombat: {
                maxHp: stats.playerHp,
                hp: stats.playerHp,
                damage: 1,
            },
        }
    )
}

export type { Difficulty }
