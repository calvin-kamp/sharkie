export type EndState = 'none' | 'win' | 'lose'

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
