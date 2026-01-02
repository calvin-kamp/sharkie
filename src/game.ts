import { World } from '@models/world.model'
import '@styles/styles.scss'

const component = '*[data-component=canvas]'

const init = () => {
    const $canvas = document.querySelector<HTMLCanvasElement>(component)
    
    if (!$canvas) {
        return
    }

    const world = new World($canvas)

    world.draw()
}

init()
