/**
 * @fileoverview Collectible items management system.
 * Handles collectible item updates, collision detection, and collection logic.
 */

import type { Player } from '@models/player.model'
import type { Collectible } from '@models/collectible.model'
import { isColliding } from '@root/utils/geometry'

/**
 * Collectible manager handling item collection and updates
 */
export class CollectibleManager {
    /** Array of active collectibles in the game */
    private collectibles: Collectible[] = []

    /**
     * Creates a new collectible manager
     * @param {Collectible[]} [collectibles=[]] - Initial collectibles array
     */
    constructor(collectibles: Collectible[] = []) {
        this.collectibles = collectibles
    }

    /**
     * Updates collectibles, checks for player collection
     * @param {Player} player - The player to check for collisions
     */
    update(player: Player): void {
        if (player.isDead || this.collectibles.length === 0) {
            return
        }

        const remaining: Collectible[] = []

        for (const c of this.collectibles) {
            if (c.isCollected) {
                continue
            }

            if (isColliding(player, c, 0)) {
                c.collectFor(player)
                continue
            }

            remaining.push(c)
        }

        this.collectibles = remaining
    }

    /**
     * Gets all active collectibles
     * @returns {Collectible[]} Array of collectibles
     */
    getAll(): Collectible[] {
        return this.collectibles
    }

    /**
     * Renders all collectibles on canvas
     * @param {CanvasRenderingContext2D | null} ctx - Canvas rendering context
     * @param {boolean} debugHitboxes - Whether to draw debug hitboxes
     * @param {Function} drawHitboxFn - Function to draw hitbox debugging
     */
    draw(
        ctx: CanvasRenderingContext2D | null,
        debugHitboxes: boolean,
        drawHitboxFn: (c: Collectible, color: string) => void
    ): void {
        if (!ctx) {
            return
        }

        for (const c of this.collectibles) {
            if ((c as any).isCollected) {
                continue
            }

            ctx.drawImage((c as any).img, (c as any).x, (c as any).y, (c as any).width, (c as any).calculatedHeight)

            if (debugHitboxes) {
                drawHitboxFn(c, 'lime')
            }
        }
    }

    /**
     * Freezes all collectible animations
     */
    freeze(): void {
        for (const c of this.collectibles) {
            c.freeze()
        }
    }

    /**
     * Unfreezes all collectible animations
     */
    unfreeze(): void {
        for (const c of this.collectibles) {
            c.unfreeze()
        }
    }
}
