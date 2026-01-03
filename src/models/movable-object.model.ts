export interface MovableObjectConfig {
    imageSrc: string
    x?: number
    y?: number
    width?: number
    height?: number
    aspectRatio?: number
}

export class MovableObject {
    x: number
    y: number
    width: number
    height?: number
    private aspectRatio: number
    img: HTMLImageElement
    directionLeft: boolean = false
    cachedImages: HTMLImageElement[] = []

    constructor(config: MovableObjectConfig) {
        this.img = new Image()

        this.x = config.x ?? 0
        this.y = config.y ?? 0

        this.aspectRatio = config.aspectRatio ?? 2 / 3

        this.width = config.width ?? 100
        this.height = config.height ?? undefined

        this.loadImage(config.imageSrc)
    }

    private loadImage(imagePath: string) {
        this.img.src = imagePath
    }

    cacheImages(images: string[]) {
        for(const imageSrc of images) {
            const img = new Image()
            img.src = imageSrc

            this.cachedImages.push(img)
        }
    }

    moveUp() {
        this.y -= 2.5
    }

    moveDown() {
        this.y += 2.5
    }

    moveLeft() {
        this.x -= 2.5
    }

    moveRight() {
        this.x += 2.5
    }

    get calculatedHeight() {

        return this.height || Math.floor(this.width * this.aspectRatio)

    }
}
