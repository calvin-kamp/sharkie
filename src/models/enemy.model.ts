import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'
import { getRandomNumber } from '@root/utils/helper'

export class Enemy extends MovableObject {
    constructor(config: MovableObjectConfig) {
        super(config)

        this.x = config.x ?? getRandomNumber(200, 700)
    }
}
