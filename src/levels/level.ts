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
        offsetX: Math.round(bossWidth * 0.04),
        offsetY: Math.round(bossHeight * 0.30),
        width: Math.round(bossWidth * 0.92),
        height: Math.round(bossHeight * 0.55),
    })

    const collectibles = [
        ...LEVEL_COLLECTIBLES.coins.map((p) => createCoin(p.x, p.y)),
        ...LEVEL_COLLECTIBLES.poisons.map((p) => createPoison(p.x, p.y)),
    ]

    return new Level(
        [
            new Enemy(
                {
                    imageSrc: assets.enemies.jellyfish('regular-purple-1.png', 'regular', 'purple'),
                    width: 100,
                    aspectRatio: 300 / 211,
                },
                'jellyfish',
                {
                    swim: [
                        assets.enemies.jellyfish('regular-purple-1.png', 'regular', 'purple'),
                        assets.enemies.jellyfish('regular-purple-2.png', 'regular', 'purple'),
                        assets.enemies.jellyfish('regular-purple-3.png', 'regular', 'purple'),
                        assets.enemies.jellyfish('regular-purple-4.png', 'regular', 'purple'),
                    ],
                    dead: [
                        assets.enemies.jellyfish('dead-purple-1.png', 'dead', 'purple'),
                        assets.enemies.jellyfish('dead-purple-2.png', 'dead', 'purple'),
                        assets.enemies.jellyfish('dead-purple-3.png', 'dead', 'purple'),
                        assets.enemies.jellyfish('dead-purple-4.png', 'dead', 'purple'),
                    ],
                },
                { maxHp: stats.jellyfishHp, damage: stats.jellyfishDmg }
            ),
            new Enemy(
                {
                    imageSrc: assets.enemies.pufferfish('orange-swim-1.png', 'swim', 'orange'),
                    aspectRatio: 198 / 241,
                },
                'pufferfish',
                {
                    swim: [
                        assets.enemies.pufferfish('orange-swim-1.png', 'swim', 'orange'),
                        assets.enemies.pufferfish('orange-swim-2.png', 'swim', 'orange'),
                        assets.enemies.pufferfish('orange-swim-3.png', 'swim', 'orange'),
                        assets.enemies.pufferfish('orange-swim-4.png', 'swim', 'orange'),
                        assets.enemies.pufferfish('orange-swim-5.png', 'swim', 'orange'),
                    ],
                    hurt: [
                        assets.enemies.pufferfish('orange-bubble-swim-1.png', 'bubble-swim', 'orange'),
                        assets.enemies.pufferfish('orange-bubble-swim-2.png', 'bubble-swim', 'orange'),
                        assets.enemies.pufferfish('orange-bubble-swim-3.png', 'bubble-swim', 'orange'),
                        assets.enemies.pufferfish('orange-bubble-swim-4.png', 'bubble-swim', 'orange'),
                        assets.enemies.pufferfish('orange-bubble-swim-5.png', 'bubble-swim', 'orange'),
                    ],
                    dead: [
                        assets.enemies.pufferfish('orange-dead-1.png', 'dead', 'orange'),
                        assets.enemies.pufferfish('orange-dead-2.png', 'dead', 'orange'),
                        assets.enemies.pufferfish('orange-dead-3.png', 'dead', 'orange'),
                    ],
                },
                { maxHp: stats.pufferfishHp, damage: stats.pufferfishDmg }
            ),
            new Enemy(
                {
                    imageSrc: assets.enemies.jellyfish('super-dangerous-green-1.png', 'super-dangerous', 'green'),
                    width: 125,
                    aspectRatio: 300 / 211,
                },
                'jellyfish',
                {
                    swim: [
                        assets.enemies.jellyfish('super-dangerous-green-1.png', 'super-dangerous', 'green'),
                        assets.enemies.jellyfish('super-dangerous-green-2.png', 'super-dangerous', 'green'),
                        assets.enemies.jellyfish('super-dangerous-green-3.png', 'super-dangerous', 'green'),
                        assets.enemies.jellyfish('super-dangerous-green-4.png', 'super-dangerous', 'green'),
                    ],
                    dead: [
                        assets.enemies.jellyfish('dead-green-1.png', 'dead', 'green'),
                        assets.enemies.jellyfish('dead-green-2.png', 'dead', 'green'),
                        assets.enemies.jellyfish('dead-green-3.png', 'dead', 'green'),
                        assets.enemies.jellyfish('dead-green-4.png', 'dead', 'green'),
                    ],
                },
                { maxHp: stats.jellyfishSuperHp, damage: stats.jellyfishSuperDmg }
            ),
        ],
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
