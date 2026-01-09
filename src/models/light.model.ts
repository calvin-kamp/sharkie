/**
 * @fileoverview Light overlay model for visual lighting effects.
 * Represents light layers that create visual atmosphere in the game world.
 */

import { DrawableObject, type DrawableObjectConfig } from '@models/drawable-object.model'

/**
 * Light overlay object for atmospheric visual effects
 * Extends DrawableObject for consistency with other game entities
 */
export class Light extends DrawableObject {
    /**
     * Creates a new light overlay
     * @param {DrawableObjectConfig} config - Configuration for the light object
     */
    constructor(config: DrawableObjectConfig) {
        super({
            imageSrc: config.imageSrc,
            x: config.x ?? 50,
            y: config.y ?? 0,
            width: config.width ?? 200,
            height: config.height ?? 480,
        })
    }
}
