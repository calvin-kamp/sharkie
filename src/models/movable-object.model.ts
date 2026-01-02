export interface MovableObjectConfig {
    imageSrc: string
    x?: number
    y?: number
    width?: number
    height?: number
}

export class MovableObject {
    x: number
    y: number
    width: number
    height: number
    img: HTMLImageElement

    constructor(config: MovableObjectConfig) {
        this.img = new Image()

        this.x = config.x ?? 0
        this.y = config.y ?? 0
        this.width = config.width ?? 100
        this.height = config.height ?? 150

        this.loadImage(config.imageSrc)
    }

    loadImage(imagePath: string) {
        this.img.src = imagePath
    }

    moveLeft() {}

    moveRight() {}
}
