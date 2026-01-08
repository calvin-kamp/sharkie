import { Player } from '@models/player.model'
import { Light } from '@models/light.model'
import { Background } from '@models/background.model'
import { assets } from '@root/utils/assets'

import type { Enemy } from '@models/enemy.model'
import type { Boss } from '@models/boss.model'
import type { CombatConfig } from '@models/combat.model'

import { StatusBar } from '@models/status-bar.model'
import { HudCounter } from '@models/hud-counter.model'
import type { Collectible } from '@models/collectible.model'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible'

type LevelOptions = {
    difficulty?: Difficulty
    playerCombat?: CombatConfig
}

export class Level {
    player = new Player({
        imageSrc: assets.player.state('idle-1.png', 'idle'),
        width: 250,
        aspectRatio: 815 / 1000,

        hitbox: {
            offsetX: 40,
            offsetY: 70,
            width: 170,
            height: 95,
        },
    })

    enemies: Enemy[]
    boss: Boss

    collectibles: Collectible[] = []

    statusBars: StatusBar[] = []
    hudCounters: HudCounter[] = []

    difficulty: Difficulty

    lights = [
        new Light({ imageSrc: assets.backgrounds.layer('light-1.png', 'light'), x: -180, width: 720 }),
        new Light({ imageSrc: assets.backgrounds.layer('light-2.png', 'light'), x: 540, width: 720 }),
        new Light({ imageSrc: assets.backgrounds.layer('light-1.png', 'light'), x: 1260, width: 720 }),
        new Light({ imageSrc: assets.backgrounds.layer('light-2.png', 'light'), x: 1980, width: 720 }),
    ]

    backgrounds = [
        new Background({ imageSrc: assets.backgrounds.layer('light-1.png', 'water'), x: -180, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('background-2-light-1.png', 'background-2'), x: -180, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('background-1-light-1.png', 'background-1'), x: -180, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('light-1.png', 'floor'), x: -180, width: 720 }),

        new Background({ imageSrc: assets.backgrounds.layer('light-2.png', 'water'), x: 540, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('background-2-light-2.png', 'background-2'), x: 540, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('background-1-light-2.png', 'background-1'), x: 540, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('light-2.png', 'floor'), x: 540, width: 720 }),

        new Background({ imageSrc: assets.backgrounds.layer('light-1.png', 'water'), x: 1260, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('background-2-light-1.png', 'background-2'), x: 1260, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('background-1-light-1.png', 'background-1'), x: 1260, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('light-1.png', 'floor'), x: 1260, width: 720 }),

        new Background({ imageSrc: assets.backgrounds.layer('light-2.png', 'water'), x: 1980, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('background-2-light-2.png', 'background-2'), x: 1980, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('background-1-light-2.png', 'background-1'), x: 1980, width: 720 }),
        new Background({ imageSrc: assets.backgrounds.layer('light-2.png', 'floor'), x: 1980, width: 720 }),
    ]

    constructor(
        enemiesArray: Enemy[],
        bossConfig: Boss,
        collectibles: Collectible[] = [],
        options: LevelOptions = {}
    ) {
        this.enemies = enemiesArray
        this.boss = bossConfig
        this.collectibles = collectibles

        this.difficulty = options.difficulty ?? 'medium'

        if (options.playerCombat) {
            this.player.setBaseCombat(options.playerCombat)
        }

        const x = 20
        const y = 20
        const gap = 12
        const barWidth = 250
        const barHeight = Math.floor(barWidth * (158 / 595))

        this.statusBars = [
            new StatusBar({
                type: 'life',
                color: 'purple',
                x,
                y,
                width: barWidth,
                maxValue: this.player.maxHp,
                value: this.player.hp,
            }),
        ]

        const iconSize = 42

        const iconY = y + Math.floor((barHeight - iconSize) / 2)
        const poisonX = x + barWidth + gap
        const coinX = poisonX + iconSize + 120


        this.hudCounters = [
            new HudCounter({
                type: 'poison',
                x: poisonX,
                y: iconY,
                width: iconSize,
                value: this.player.poisonBottles,
                frames: [
                    assets.misc.hud.poison('poison-animated-1.png', true),
                    assets.misc.hud.poison('poison-animated-2.png', true),
                    assets.misc.hud.poison('poison-animated-3.png', true),
                    assets.misc.hud.poison('poison-animated-4.png', true),
                    assets.misc.hud.poison('poison-animated-5.png', true),
                    assets.misc.hud.poison('poison-animated-6.png', true),
                    assets.misc.hud.poison('poison-animated-7.png', true),
                    assets.misc.hud.poison('poison-animated-8.png', true),
                ],
                fps: 10,
            }),
            new HudCounter({
                type: 'coin',
                x: coinX,
                y: iconY,
                width: iconSize,
                value: this.player.coins,
                frames: [assets.misc.hud.coin('coin-1.png')],
            }),
        ]
    }
}
