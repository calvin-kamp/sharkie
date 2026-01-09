/**
 * @fileoverview Background model for static/scrolling background elements.
 * Represents environmental visual layers in the game world.
 */

import { DrawableObject, type DrawableObjectConfig } from '@models/drawable-object.model'

/**
 * Background object representing visual environmental layers
 */
export class Background extends DrawableObject {
    constructor(config: DrawableObjectConfig) {
        super(config)
    }
}
