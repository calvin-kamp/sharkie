/**
 * @fileoverview End game screen rendering and restart handling.
 * Displays win/lose screens and handles game restart input.
 */

/**
 * Game end states
 * @typedef {'none' | 'win' | 'lose'} EndState
 */
export type EndState = 'none' | 'win' | 'lose'

/**
 * Draws the end game screen with appropriate title and instructions
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {number} canvasWidth - Canvas width in pixels
 * @param {number} canvasHeight - Canvas height in pixels
 * @param {EndState} endState - Current end game state
 */
export const drawEndScreen = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    endState: EndState
): void => {
    if (endState === 'none') {
        return
    }

    ctx.save()
    ctx.globalAlpha = 0.65
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    ctx.restore()

    const title = endState === 'win' ? 'YOU WIN' : 'TRY AGAIN'
    const hint = 'Click / Enter / Space / R'

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = '72px "Luckiest Guy", Arial'
    ctx.lineWidth = 8
    ctx.strokeStyle = 'rgba(0,0,0,0.75)'
    ctx.fillStyle = '#fff'
    ctx.strokeText(title, canvasWidth / 2, canvasHeight * 0.45)
    ctx.fillText(title, canvasWidth / 2, canvasHeight * 0.45)

    ctx.font = '22px Arial'
    ctx.lineWidth = 5
    ctx.strokeText(hint, canvasWidth / 2, canvasHeight * 0.58)
    ctx.fillText(hint, canvasWidth / 2, canvasHeight * 0.58)

    ctx.restore()
}

/**
 * Binds event handlers for restarting the game after win/lose
 * @param {HTMLCanvasElement} canvas - The game canvas element
 * @param {Function} getEndState - Function that returns the current end state
 */
export const bindRestartHandlers = (canvas: HTMLCanvasElement, getEndState: () => EndState): void => {
    canvas.addEventListener('click', () => {
        if (getEndState() === 'none') {
            return
        }

        window.location.reload()
    })

    document.addEventListener('keydown', (e) => {
        if (getEndState() === 'none') {
            return
        }

        if (e.key === 'Enter' || e.key === ' ' || e.key === 'r' || e.key === 'R') {
            window.location.reload()
        }
    })
}
