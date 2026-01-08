export interface DrawableObjectConfig {
    imageSrc: string
    x?: number
    y?: number
    width?: number
    height?: number
    
    aspectRatio?: number
}

export class DrawableObject {
    private static imageCache = new Map<string, HTMLImageElement>()

    protected static getCachedImage(src: string): HTMLImageElement {
        const cached = this.imageCache.get(src)
        
        if (cached) {
            return cached
        }

        const img = new Image()
        img.src = src
        this.imageCache.set(src, img)
        return img
    }

    x: number
    y: number
    width: number
    height?: number
    protected aspectRatio: number

    img: HTMLImageElement
    cachedImages: HTMLImageElement[] = []

    constructor(config: DrawableObjectConfig) {
        this.img = DrawableObject.getCachedImage(config.imageSrc)

        this.x = config.x ?? 0
        this.y = config.y ?? 0
        this.width = config.width ?? 100
        this.height = config.height
        this.aspectRatio = config.aspectRatio ?? 2 / 3
    }

    protected loadImage(imagePath: string) {
        this.img = DrawableObject.getCachedImage(imagePath)
    }

    cacheImages(images: string[]) {
        this.cachedImages = images.map((src) => DrawableObject.getCachedImage(src))
    }

    get calculatedHeight() {
        return this.height || Math.floor(this.width * this.aspectRatio)
    }
}
