/**
 * @fileoverview Player HUD management for displaying player status bars and counters.
 * Aggregates and renders all player UI components on canvas.
 */

import type { StatusBar } from '@models/status-bar.model'
import type { HudCounter } from '@models/hud-counter.model'
import type { Player } from '@models/player.model'

/**
 * Player HUD manager displaying health bars and resource counters
 */
export class PlayerHud {
    private readonly statusBars: StatusBar[]
    private readonly hudCounters: HudCounter[]

    constructor(statusBars: StatusBar[], hudCounters: HudCounter[]) {
        this.statusBars = statusBars
        this.hudCounters = hudCounters
    }

    /**
     * Updates all HUD elements with current player stats
     * @param {Player} player - The player to read stats from
     */
    update(player: Player): void {
        for (const bar of this.statusBars) {
            ;(bar as any).setMaxValue?.(player.maxHp)
            ;(bar as any).setValue?.(player.hp)
        }

        for (const counter of this.hudCounters) {
            const c = counter as any
            
            if (c.type === 'poison') {
                c.setValue?.(player.poisonBottles)
            }

            if (c.type === 'coin') {
                c.setValue?.(player.coins)
            }
        }
    }

    /**
     * Renders all HUD elements on canvas
     * @param {CanvasRenderingContext2D | null} ctx - Canvas rendering context
     */
    draw(ctx: CanvasRenderingContext2D | null): void {
        if (!ctx) {
            return
        }

        for (const bar of this.statusBars) {
            ctx.drawImage(
                (bar as any).img,
                (bar as any).x,
                (bar as any).y,
                (bar as any).width,
                (bar as any).calculatedHeight
            )
        }

        for (const counter of this.hudCounters) {
            (counter as any).draw?.(ctx)
        }
    }

    /**
     * Freezes all animated HUD elements
     */
    freeze(): void {
        for (const counter of this.hudCounters) {
            (counter as any).freeze?.()
        }
    }

    /**
     * Unfreezes all animated HUD elements
     */
    unfreeze(): void {
        for (const counter of this.hudCounters) {
            (counter as any).unfreeze?.()
        }
    }
}
