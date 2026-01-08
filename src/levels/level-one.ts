import { Level } from '@models/level-model'
import { Enemy } from '@models/enemy.model'
import { assets } from '@root/utils/assets'

export const levelOne = new Level(
    [
        new Enemy({
            imageSrc: assets.enemies.jellyfish('regular-purple-1.png', 'regular', 'purple'),
            width: 100,
            aspectRatio: 300 / 211}, 
            'jellyfish', 
            [
                assets.enemies.jellyfish('regular-purple-1.png', 'regular', 'purple'),
                assets.enemies.jellyfish('regular-purple-2.png', 'regular', 'purple'),
                assets.enemies.jellyfish('regular-purple-3.png', 'regular', 'purple'),
                assets.enemies.jellyfish('regular-purple-4.png', 'regular', 'purple')
            ]
        ),
        new Enemy({
            imageSrc: assets.enemies.pufferfish('orange-swim-1.png', 'swim', 'orange'),
            aspectRatio: 241 / 198}, 
            'pufferfish', 
            [
                assets.enemies.pufferfish('orange-swim-1.png', 'swim', 'orange'),
                assets.enemies.pufferfish('orange-swim-2.png', 'swim', 'orange'),
                assets.enemies.pufferfish('orange-swim-3.png', 'swim', 'orange'),
                assets.enemies.pufferfish('orange-swim-4.png', 'swim', 'orange'),
                assets.enemies.pufferfish('orange-swim-5.png', 'swim', 'orange')
            ]
        ),
        new Enemy({
            imageSrc: assets.enemies.jellyfish('super-dangerous-green-1.png', 'super-dangerous', 'green'),
            width: 150,
            aspectRatio: 300 / 211},
            'jellyfish', 
            [
                assets.enemies.jellyfish('super-dangerous-green-1.png', 'super-dangerous', 'green'),
                assets.enemies.jellyfish('super-dangerous-green-2.png', 'super-dangerous', 'green'),
                assets.enemies.jellyfish('super-dangerous-green-3.png', 'super-dangerous', 'green'),
                assets.enemies.jellyfish('super-dangerous-green-4.png', 'super-dangerous', 'green')
            ]
        ),
    ]
)
