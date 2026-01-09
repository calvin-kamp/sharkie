import { StatusBar } from '@models/status-bar.model'
import type { Boss } from '@models/boss.model'

export class BossHud {
    private bar: StatusBar | null = null
    private readonly displayName: string
    private readonly boss: Boss
    private readonly canvasWidth: number
    private readonly canvasHeight: number

    constructor(boss: Boss, canvasWidth: number, canvasHeight: number, displayName = 'Willy the Whale') {
        this.boss = boss
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.displayName = displayName
    }

    updateVisibleValues(isVisible: boolean) {
        if (!isVisible || !this.bar) {
            return
        }

        this.bar.setMaxValue(this.boss.maxHp)
        this.bar.setValue(this.boss.hp)
    }

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
