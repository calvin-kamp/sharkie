/**
 * @fileoverview Background model for static/scrolling background elements.
 * Represents environmental visual layers in the game world.
 */

import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'

/**
 * Background object representing visual environmental layers
 * Extends MovableObject for consistency with game entity system
 */
export class Background extends MovableObject {
    /**
     * Creates a new background layer
     * @param {MovableObjectConfig} config - Configuration for the background
     */
    constructor(config: MovableObjectConfig) {
        super(config)
    }
}
