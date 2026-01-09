import type { StatusBar } from '@models/status-bar.model'
import type { HudCounter } from '@models/hud-counter.model'
import type { Player } from '@models/player.model'

export class PlayerHud {
    private readonly statusBars: StatusBar[]
    private readonly hudCounters: HudCounter[]

    constructor(statusBars: StatusBar[], hudCounters: HudCounter[]) {
        this.statusBars = statusBars
        this.hudCounters = hudCounters
    }

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

    freeze(): void {
        for (const counter of this.hudCounters) {
            (counter as any).freeze?.()
        }
    }

    unfreeze(): void {
        for (const counter of this.hudCounters) {
            (counter as any).unfreeze?.()
        }
    }
}
