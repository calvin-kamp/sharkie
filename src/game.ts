import { World } from '@models/world.model'
import { levelOne } from '@root/levels/level-one'
import '@styles/styles.scss'

const component = '*[data-component=canvas]'

const init = () => {
    const $canvas = document.querySelector<HTMLCanvasElement>(component)
    
    if (!$canvas) {
        return
    }

    const world = new World($canvas, levelOne)

    world.draw()
}

init()
