// background.model.ts
import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'

export class Background extends MovableObject {
    constructor(config: MovableObjectConfig) {
        super(config)
    }
}
