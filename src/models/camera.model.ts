import { clamp } from '@root/utils/geometry'

export class Camera {
    offset = 0

    constructor(
        private readonly canvasWidth: number,
        private readonly minOffset: number,
        private readonly maxOffset: number
    ) {}

    setOffset(nextOffset: number): void {
        this.offset = clamp(nextOffset, this.minOffset, this.maxOffset)
    }

    syncToPlayer(playerX: number, playerWidth: number): void {
        const playerCenterX = playerX + playerWidth / 2
        const targetOffset = -(playerCenterX - this.canvasWidth / 2)
        this.setOffset(targetOffset)
    }

    updateForPlayer(playerX: number, playerWidth: number): void {
        const playerCenterX = playerX + playerWidth / 2
        const targetOffset = -(playerCenterX - this.canvasWidth / 2)
        this.setOffset(targetOffset)
    }

    isAtRightEdge(): boolean {
        return Math.abs(this.offset - this.minOffset) < 0.5
    }

    getViewBounds(): { left: number; right: number } {
        const left = -this.offset
        const right = left + this.canvasWidth
        return { left, right }
    }
}
