import { DrawableObject, type DrawableObjectConfig } from '@models/drawable-object.model'

export type HudCounterType = 'poison' | 'coin'

export type HudCounterConfig = {
    type: HudCounterType
    x: number
    y: number
    width?: number
    value?: number
    frames: string[]
    fps?: number
}

export class HudCounter extends DrawableObject {
    readonly type: HudCounterType
    value: number

    private currentFrame = 0
    private animIntervalId: number | null = null
    private readonly fps: number

    private frozen = false
    private wasAnimating = false

    constructor(config: HudCounterConfig) {
        const width = config.width ?? 42

        const drawableConfig: DrawableObjectConfig = {
            imageSrc: config.frames[0],
            x: config.x,
            y: config.y,
            width,
            aspectRatio: 1,
        }

        super(drawableConfig)

        this.type = config.type
        this.value = Math.max(0, config.value ?? 0)
        this.fps = Math.max(1, Math.floor(config.fps ?? 10))

        this.cacheImages(config.frames)

        if (this.cachedImages.length > 0) {
            this.img = this.cachedImages[0]
        }

        if (this.cachedImages.length > 1) {
            this.startAnimation()
        }
    }

    setValue(value: number) {
        this.value = Math.max(0, value)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.calculatedHeight)

        const text = `x ${this.value}`

        ctx.save()
        ctx.font = '22px Luckiest Guy, Arial, sans-serif'
        ctx.textBaseline = 'middle'

        const tx = this.x + this.width + 12
        const ty = this.y + this.calculatedHeight / 2

        ctx.lineWidth = 6
        ctx.strokeStyle = 'rgba(0,0,0,0.7)'
        ctx.strokeText(text, tx, ty)

        ctx.fillStyle = '#ffffff'
        ctx.fillText(text, tx, ty)
        ctx.restore()
    }

    freeze() {
        if (this.frozen) {
            return
        }

        this.frozen = true

        if (this.animIntervalId !== null) {
            clearInterval(this.animIntervalId)
            this.animIntervalId = null
            this.wasAnimating = true
        }
    }

    unfreeze() {
        if (!this.frozen) {
            return
        }

        this.frozen = false

        if (this.wasAnimating) {
            this.wasAnimating = false
            this.startAnimation()
        }
    }

    private startAnimation() {
        if (this.frozen || this.animIntervalId !== null || this.cachedImages.length <= 1) {
            return
        }

        const delay = Math.max(40, Math.floor(1000 / this.fps))
        
        this.animIntervalId = window.setInterval(() => {
            const i = this.currentFrame % this.cachedImages.length
            this.img = this.cachedImages[i]
            this.currentFrame++
        }, delay)
    }
}
