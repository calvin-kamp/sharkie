import { Player } from '@models/player.model'
import { Light } from '@models/light.model'
import { Background } from '@models/background.model'
import { assets } from '@root/utils/assets'

export class Level {
    player = new Player({
        imageSrc: assets.player.state('idle-1.png', 'idle'),
        width: 250,
        aspectRatio: 815 / 1000
    })

    enemies

    lights = [
        new Light({
            imageSrc: assets.backgrounds.layer('light-1.png', 'light'),
            x: -180,
            width: 720
        }),
        new Light({
            imageSrc: assets.backgrounds.layer('light-2.png', 'light'),
            x: 540,
            width: 720
        }),
        new Light({
            imageSrc: assets.backgrounds.layer('light-1.png', 'light'),
            x: 1260,
            width: 720
        }),
        new Light({
            imageSrc: assets.backgrounds.layer('light-2.png', 'light'),
            x: 1980,
            width: 720
        }),
    ]

    backgrounds = [
        new Background({
            imageSrc: assets.backgrounds.layer('light-1.png', 'water'),
            x: -180,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-2-light-1.png', 'background-2'),
            x: -180,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-1-light-1.png', 'background-1'),
            x: -180,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-1.png', 'floor'),
            x: -180,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-2.png', 'water'),
            x: 540,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-2-light-2.png', 'background-2'),
            x: 540,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-1-light-2.png', 'background-1'),
            x: 540,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-2.png', 'floor'),
            x: 540,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-1.png', 'water'),
            x: 1260,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-2-light-1.png', 'background-2'),
            x: 1260,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-1-light-1.png', 'background-1'),
            x: 1260,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-1.png', 'floor'),
            x: 1260,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-2.png', 'water'),
            x: 1980,
            width: 720
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-2-light-2.png', 'background-2'),
            x: 1980,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('background-1-light-2.png', 'background-1'),
            x: 1980,
            width: 720,
        }),
        new Background({
            imageSrc: assets.backgrounds.layer('light-2.png', 'floor'),
            x: 1980,
            width: 720
        }),
    ]

    constructor(enemiesArray) {
        this.enemies = enemiesArray
    }
}