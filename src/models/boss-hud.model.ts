/**
 * @fileoverview Boss HUD management for displaying boss health during battles.
 * Manages boss health bar rendering and updates during combat encounters.
 */

import { StatusBar } from '@models/status-bar.model'
import type { Boss } from '@models/boss.model'

/**
 * Boss HUD manager displaying boss health bar during combat
 */
export class BossHud {
    /** Boss health bar component */
    private bar: StatusBar | null = null
    /** Display name for the boss */
    private readonly displayName: string
    /** Reference to the boss instance */
    private readonly boss: Boss
    /** Canvas width in pixels */
    private readonly canvasWidth: number
    /** Canvas height in pixels */
    private readonly canvasHeight: number

    /**
     * Creates a new boss HUD
     * @param {Boss} boss - The boss to display health for
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     * @param {string} [displayName='Willy the Whale'] - Boss display name
     */
    constructor(boss: Boss, canvasWidth: number, canvasHeight: number, displayName = 'Willy the Whale') {
        this.boss = boss
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.displayName = displayName
    }

    /**
     * Updates the health bar values when boss is visible
     * @param {boolean} isVisible - Whether the boss is currently visible
     */
    updateVisibleValues(isVisible: boolean) {
        if (!isVisible || !this.bar) {
            return
        }

        this.bar.setMaxValue(this.boss.maxHp)
        this.bar.setValue(this.boss.hp)
    }

    /**
     * Renders the boss HUD on canvas
     * @param {CanvasRenderingContext2D | null} ctx - Canvas rendering context
     * @param {boolean} isVisible - Whether the boss is visible and HUD should render
     */
    draw(ctx: CanvasRenderingContext2D | null, isVisible: boolean) {
        if (!ctx || !isVisible) {
            return
        }

        this.ensureBar()

        if (!this.bar) {
            return
        }

        const bar = this.bar as any
        const img = bar.img as HTMLImageElement | undefined

        const hasSprite = !!(img && img.complete && img.naturalWidth > 0)

        if (hasSprite) {
            ctx.drawImage(img as HTMLImageElement, bar.x, bar.y, bar.width, bar.calculatedHeight)
        } else {
            const maxHp = Math.max(1, this.boss.maxHp)
            const ratio = Math.max(0, Math.min(1, this.boss.hp / maxHp))

            const x = bar.x
            const y = bar.y
            const w = bar.width
            const h = bar.calculatedHeight
            const pad = 8

            ctx.save()
            ctx.fillStyle = 'rgba(0,0,0,0.55)'
            ctx.fillRect(x, y, w, h)

            ctx.lineWidth = 3
            ctx.strokeStyle = 'rgba(255,255,255,0.85)'
            ctx.strokeRect(x, y, w, h)

            const innerW = Math.max(0, w - pad * 2)
            const innerH = Math.max(0, h - pad * 2)
            const fillW = Math.floor(innerW * ratio)
            ctx.fillStyle = 'rgba(255, 69, 58, 0.9)'
            ctx.fillRect(x + pad, y + pad, fillW, innerH)

            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = '16px Arial'
            ctx.lineWidth = 4
            ctx.strokeStyle = 'rgba(0,0,0,0.7)'
            ctx.fillStyle = '#fff'
            const hpText = `${Math.max(0, Math.ceil(this.boss.hp))} / ${maxHp}`
            ctx.strokeText(hpText, x + w / 2, y + h / 2)
            ctx.fillText(hpText, x + w / 2, y + h / 2)
            ctx.restore()
        }

        this.drawName(ctx, bar)
    }

    /**
     * Ensures the health bar is initialized
     * @private
     */
    private ensureBar() {
        if (this.bar) {
            return
        }

        const barWidth = 420
        const barHeight = Math.floor(barWidth * (158 / 595))
        const marginBottom = 18

        const x = Math.floor((this.canvasWidth - barWidth) / 2)
        const y = Math.floor(this.canvasHeight - barHeight - marginBottom)

        this.bar = new StatusBar({
            type: 'life',
            color: 'orange',
            x,
            y,
            width: barWidth,
            maxValue: this.boss.maxHp,
            value: this.boss.hp,
        })
    }

    /**
     * Draws the boss name above the health bar
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {any} bar - Status bar instance
     * @private
     */
    private drawName(ctx: CanvasRenderingContext2D, bar: any) {
        const visibleTopY = bar.y + bar.calculatedHeight * 0.22
        const nameY = Math.max(28, Math.floor(visibleTopY + 30))

        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.font = '26px "Luckiest Guy", Arial'

        ctx.lineWidth = 6
        ctx.lineJoin = 'round'
        ctx.miterLimit = 2

        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        ctx.strokeStyle = 'rgba(0,0,0,0.75)'
        ctx.fillStyle = '#fff'

        const x = Math.round(this.canvasWidth / 2)
        const y = Math.round(nameY)

        ctx.strokeText(this.displayName, x, y)
        ctx.fillText(this.displayName, x, y)
        ctx.restore()
    }
}
