export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getGameAssetUrl = (path: string): string => {
    return new URL(`game/${path}`, window.location.href).toString()
}

/* -------------------------------------------------------------------------- */
/* sprites                                                                     */
/* -------------------------------------------------------------------------- */

export const getSpriteAssetUrl = (path: string): string => {
    const completePath = `/sprites/${path}`
    return getGameAssetUrl(completePath)
}

/* ------------------------------ enemies ----------------------------------- */

export const getEnemyAssetUrl = (path: string): string => {
    const completePath = `/sprites/enemies/${path}`
    return getGameAssetUrl(completePath)
}

export const getJellyFishAssetUrl = (fileName: string, state: string, color: string) => {
    const completePath = `jellyfish/${state}/${color}/${fileName}`
    return getEnemyAssetUrl(completePath)
}

export const getPufferFishAssetUrl = (fileName: string, state: string, color: string) => {
    const completePath = `pufferfish/${state}/${color}/${fileName}`
    return getEnemyAssetUrl(completePath)
}

export const getBossAssetUrl = (fileName: string, state: string) => {
    const completePath = `boss/${state}/${fileName}`
    return getEnemyAssetUrl(completePath)
}

/* ------------------------------ player ------------------------------------ */

export const getPlayerAssetUrl = (path: string): string => {
    const completePath = `player/${path}`
    return getSpriteAssetUrl(completePath)
}

export const getPlayerStateAssetUrl = (fileName: string, state: string) => {
    const completePath = `${state}/${fileName}`
    return getPlayerAssetUrl(completePath)
}

export const getPlayerHurtAssetUrl = (fileName: string, variant: string) => {
    const completePath = `hurt/${variant}/${fileName}`
    return getPlayerAssetUrl(completePath)
}

export const getPlayerDeadAssetUrl = (fileName: string, variant: string) => {
    const completePath = `dead/${variant}/${fileName}`
    return getPlayerAssetUrl(completePath)
}

export const getFinSlapAssetUrl = (fileName: string) => {
    const completePath = `attack/fin-slap/${fileName}`
    return getPlayerAssetUrl(completePath)
}

export const getBubbleTrapAssetUrl = (fileName: string, option?: string) => {
    const completePath = option
        ? `attack/bubble-trap/${option}/${fileName}`
        : `attack/bubble-trap/${fileName}`
    return getPlayerAssetUrl(completePath)
}

export const getBackgroundAssetUrl = (path: string) => {
    const completePath = `backgrounds/${path}`
    return getGameAssetUrl(completePath)
}

export const getCoverAssetUrl = (fileName = 'cover.png') => {
    const completePath = `${fileName}`
    return getBackgroundAssetUrl(completePath)
}

export const getBarrierAssetUrl = (fileName: string) => {
    const completePath = `barrier/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

export const getDarkBackgroundAssetUrl = (fileName: string) => {
    const completePath = `dark/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

export const getLightBackgroundAssetUrl = (fileName: string) => {
    const completePath = `light/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

export const getLayerAssetUrl = (fileName: string, directory: string) => {
    const completePath = `backgrounds/layers/${directory}/${fileName}`
    return getGameAssetUrl(completePath)
}

export const getLegacyDarkBackgroundAssetUrl = (fileName: string) => {
    const completePath = `legacy/dark/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

export const getLegacyLightBackgroundAssetUrl = (fileName: string) => {
    const completePath = `legacy/light/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

export const getLegacyLayerAssetUrl = (fileName: string, directory: string) => {
    const completePath = `backgrounds/legacy/layers/${directory}/${fileName}`
    return getGameAssetUrl(completePath)
}

export const getMiscAssetUrl = (path: string): string => {
    const completePath = `misc/${path}`
    return getGameAssetUrl(completePath)
}

export const getButtonAssetUrl = (section: string, fileName: string) => {
    const completePath = `buttons/${section}/${fileName}`
    return getMiscAssetUrl(completePath)
}

export const getStartButtonAssetUrl = (color: string) => {
    return getButtonAssetUrl('start', `start-button-${color}.png`)
}

export const getFullscreenButtonAssetUrl = (color: string) => {
    return getButtonAssetUrl('full-screen', `full-screen-button-${color}.png`)
}

export const getTryAgainButtonAssetUrl = (color: string) => {
    return getButtonAssetUrl('try-again', `try-again-${color}.png`)
}

export const getInstructionsAssetUrl = (fileNameOrIndex: string | number) => {
    const fileName =
        typeof fileNameOrIndex === 'number'
            ? `instructions-${fileNameOrIndex}.png`
            : fileNameOrIndex
    return getButtonAssetUrl('instructions', fileName)
}

export const getKeyAssetUrl = (fileName: string) => {
    return getButtonAssetUrl('key', fileName)
}

export const getTitleAssetUrl = (fileName: string) => {
    return getButtonAssetUrl('titles', fileName)
}

export const getGameOverTitleAssetUrl = (fileName: string) => {
    const completePath = `buttons/titles/game-over/${fileName}`
    return getMiscAssetUrl(completePath)
}

export const getYouWinTitleAssetUrl = (fileName: string) => {
    const completePath = `buttons/titles/you-win/${fileName}`
    return getMiscAssetUrl(completePath)
}

export const getHudAssetUrl = (path: string) => {
    const completePath = `hud/${path}`
    return getMiscAssetUrl(completePath)
}

export const getHudCoinAssetUrl = (fileName: string) => {
    const completePath = `coin/${fileName}`
    return getHudAssetUrl(completePath)
}

export const getHudPoisonAssetUrl = (fileName: string, animated = false) => {
    const completePath = animated ? `poison/animated/${fileName}` : `poison/${fileName}`
    return getHudAssetUrl(completePath)
}

export const getHudBarsAssetUrl = (fileName: string) => {
    const completePath = `bars/${fileName}`
    return getHudAssetUrl(completePath)
}

export const getHudBarAssetUrl = (fileName: string, color: string, type: string) => {
    const completePath = `bars/${color}/${type}/${fileName}`
    return getHudAssetUrl(completePath)
}
