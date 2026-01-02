import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'

export class Light extends MovableObject {
    constructor(config: MovableObjectConfig) {
        super({
            imageSrc: config.imageSrc,
            x: config.x ?? 50,
            y: config.y ?? 0,
            width: config.width ?? 200,
            height: config.height ?? 480,
        })
    }
}
