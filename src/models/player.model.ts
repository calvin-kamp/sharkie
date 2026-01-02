import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'

export class Player extends MovableObject {
    constructor(config: MovableObjectConfig) {
        super(config)
    }

    jump() {}
}
