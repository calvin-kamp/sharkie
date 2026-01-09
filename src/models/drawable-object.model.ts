/**
 * @fileoverview Base drawable object model for all renderable game entities.
 * Provides image caching, position/size management, and rendering capabilities.
 */

/**
 * Configuration object for creating a drawable object
 * @typedef {Object} DrawableObjectConfig
 * @property {string} imageSrc - Path to the image source
 * @property {number} [x=0] - X position on canvas
 * @property {number} [y=0] - Y position on canvas
 * @property {number} [width=100] - Width in pixels
 * @property {number} [height] - Height in pixels (if not set, calculated from aspectRatio)
 * @property {number} [aspectRatio] - Width to height ratio (default: 2/3)
 */
export interface DrawableObjectConfig {
    imageSrc: string
    x?: number
    y?: number
    width?: number
    height?: number
    
    aspectRatio?: number
}

/**
 * Base class for all drawable game objects
 * Manages image loading, caching, positioning, and rendering
 */
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
