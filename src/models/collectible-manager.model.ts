import type { Player } from '@models/player.model'
import type { Collectible } from '@models/collectible.model'
import { isColliding } from '@root/utils/geometry'

export class CollectibleManager {
    private collectibles: Collectible[] = []

    constructor(collectibles: Collectible[] = []) {
        this.collectibles = collectibles
    }

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

    getAll(): Collectible[] {
        return this.collectibles
    }

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

    freeze(): void {
        for (const c of this.collectibles) {
            c.freeze()
        }
    }

    unfreeze(): void {
        for (const c of this.collectibles) {
            c.unfreeze()
        }
    }
}
