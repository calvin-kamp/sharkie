/**
 * @fileoverview Background model for static/scrolling background elements.
 * Represents environmental visual layers in the game world.
 */

import { DrawableObject, type DrawableObjectConfig } from '@models/drawable-object.model'

/**
 * Background object representing visual environmental layers
 * Extends DrawableObject for consistency with game entity system
 */
export class Background extends DrawableObject {
    /**
     * Creates a new background layer
     * @param {DrawableObjectConfig} config - Configuration for the background
     */
    constructor(config: DrawableObjectConfig) {
        super(config)
    }
}
