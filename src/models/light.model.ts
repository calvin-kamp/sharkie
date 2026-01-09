/**
 * @fileoverview Light overlay model for visual lighting effects.
 * Represents light layers that create visual atmosphere in the game world.
 */

import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'

/**
 * Light overlay object for atmospheric visual effects
 * Extends MovableObject for consistency with other game entities
 */
export class Light extends MovableObject {
    /**
     * Creates a new light overlay
     * @param {MovableObjectConfig} config - Configuration for the light object
     */
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
