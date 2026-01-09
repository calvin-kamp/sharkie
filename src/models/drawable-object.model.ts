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
    /** Static cache for loaded images to prevent redundant loading */
    private static imageCache = new Map<string, HTMLImageElement>()

    /**
     * Retrieves or creates a cached image
     * @param {string} src - Image source URL
     * @returns {HTMLImageElement} The cached or newly created image
     * @protected
     */
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

    /** X position on canvas */
    x: number
    /** Y position on canvas */
    y: number
    /** Width in pixels */
    width: number
    /** Optional explicit height (if not set, calculated from aspectRatio) */
    height?: number
    /** Width to height ratio for automatic height calculation */
    protected aspectRatio: number

    /** Primary image element */
    img: HTMLImageElement
    /** Cached animation frame images */
    cachedImages: HTMLImageElement[] = []

    /**
     * Creates a new drawable object
     * @param {DrawableObjectConfig} config - Configuration options
     */
    constructor(config: DrawableObjectConfig) {
        this.img = DrawableObject.getCachedImage(config.imageSrc)

        this.x = config.x ?? 0
        this.y = config.y ?? 0
        this.width = config.width ?? 100
        this.height = config.height
        this.aspectRatio = config.aspectRatio ?? 2 / 3
    }

    /**
     * Loads and caches a new primary image
     * @param {string} imagePath - Path to the image
     * @protected
     */
    protected loadImage(imagePath: string) {
        this.img = DrawableObject.getCachedImage(imagePath)
    }

    /**
     * Pre-caches multiple images for animations
     * @param {string[]} images - Array of image paths to cache
     */
    cacheImages(images: string[]) {
        this.cachedImages = images.map((src) => DrawableObject.getCachedImage(src))
    }

    /**
     * Gets the calculated height based on width and aspect ratio
     * @returns {number} The calculated or explicit height
     */
    get calculatedHeight() {
        return this.height || Math.floor(this.width * this.aspectRatio)
    }
}
