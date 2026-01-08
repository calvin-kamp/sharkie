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

// states: idle | long-idle | swim
export const getPlayerStateAssetUrl = (fileName: string, state: string) => {
    const completePath = `${state}/${fileName}`
    return getPlayerAssetUrl(completePath)
}

// hurt: hurt/electric-shock | hurt/poisoned
export const getPlayerHurtAssetUrl = (fileName: string, variant: string) => {
    const completePath = `hurt/${variant}/${fileName}`
    return getPlayerAssetUrl(completePath)
}

// dead: dead/electric-shock | dead/poisoned
export const getPlayerDeadAssetUrl = (fileName: string, variant: string) => {
    const completePath = `dead/${variant}/${fileName}`
    return getPlayerAssetUrl(completePath)
}

// attack: fin-slap/*
export const getFinSlapAssetUrl = (fileName: string) => {
    const completePath = `attack/fin-slap/${fileName}`
    return getPlayerAssetUrl(completePath)
}

// attack: bubble-trap/* (optional option-folder)
export const getBubbleTrapAssetUrl = (fileName: string, option?: string) => {
    const completePath = option
        ? `attack/bubble-trap/${option}/${fileName}`
        : `attack/bubble-trap/${fileName}`
    return getPlayerAssetUrl(completePath)
}

/* -------------------------------------------------------------------------- */
/* backgrounds                                                                 */
/* -------------------------------------------------------------------------- */

export const getBackgroundAssetUrl = (path: string) => {
    const completePath = `backgrounds/${path}`
    return getGameAssetUrl(completePath)
}

export const getCoverAssetUrl = (fileName = 'cover.png') => {
    const completePath = `${fileName}`
    return getBackgroundAssetUrl(completePath)
}

// backgrounds/barrier/*
export const getBarrierAssetUrl = (fileName: string) => {
    const completePath = `barrier/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

// backgrounds/dark/*
export const getDarkBackgroundAssetUrl = (fileName: string) => {
    const completePath = `dark/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

// backgrounds/light/*
export const getLightBackgroundAssetUrl = (fileName: string) => {
    const completePath = `light/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

// backgrounds/layers/<directory>/*
export const getLayerAssetUrl = (fileName: string, directory: string) => {
    const completePath = `backgrounds/layers/${directory}/${fileName}`
    return getGameAssetUrl(completePath)
}

// backgrounds/legacy/dark/*
export const getLegacyDarkBackgroundAssetUrl = (fileName: string) => {
    const completePath = `legacy/dark/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

// backgrounds/legacy/light/*
export const getLegacyLightBackgroundAssetUrl = (fileName: string) => {
    const completePath = `legacy/light/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

// backgrounds/legacy/layers/<directory>/*
export const getLegacyLayerAssetUrl = (fileName: string, directory: string) => {
    const completePath = `backgrounds/legacy/layers/${directory}/${fileName}`
    return getGameAssetUrl(completePath)
}

/* -------------------------------------------------------------------------- */
/* misc                                                                        */
/* -------------------------------------------------------------------------- */

export const getMiscAssetUrl = (path: string): string => {
    const completePath = `misc/${path}`
    return getGameAssetUrl(completePath)
}

/* ------------------------------ misc/buttons ------------------------------ */

export const getButtonAssetUrl = (section: string, fileName: string) => {
    const completePath = `buttons/${section}/${fileName}`
    return getMiscAssetUrl(completePath)
}

// buttons/start/start-button-<color>.png
export const getStartButtonAssetUrl = (color: string) => {
    return getButtonAssetUrl('start', `start-button-${color}.png`)
}

// buttons/full-screen/full-screen-button-<color>.png
export const getFullscreenButtonAssetUrl = (color: string) => {
    return getButtonAssetUrl('full-screen', `full-screen-button-${color}.png`)
}

// buttons/try-again/try-again-<color>.png
export const getTryAgainButtonAssetUrl = (color: string) => {
    return getButtonAssetUrl('try-again', `try-again-${color}.png`)
}

// buttons/instructions/instructions-<n>.png
export const getInstructionsAssetUrl = (fileNameOrIndex: string | number) => {
    const fileName =
        typeof fileNameOrIndex === 'number'
            ? `instructions-${fileNameOrIndex}.png`
            : fileNameOrIndex
    return getButtonAssetUrl('instructions', fileName)
}

// buttons/key/*
export const getKeyAssetUrl = (fileName: string) => {
    return getButtonAssetUrl('key', fileName)
}

// buttons/titles/* (root)
export const getTitleAssetUrl = (fileName: string) => {
    return getButtonAssetUrl('titles', fileName)
}

// buttons/titles/game-over/*
export const getGameOverTitleAssetUrl = (fileName: string) => {
    const completePath = `buttons/titles/game-over/${fileName}`
    return getMiscAssetUrl(completePath)
}

// buttons/titles/you-win/*
export const getYouWinTitleAssetUrl = (fileName: string) => {
    const completePath = `buttons/titles/you-win/${fileName}`
    return getMiscAssetUrl(completePath)
}

/* ------------------------------- misc/hud -------------------------------- */

export const getHudAssetUrl = (path: string) => {
    const completePath = `hud/${path}`
    return getMiscAssetUrl(completePath)
}

// hud/coin/*
export const getHudCoinAssetUrl = (fileName: string) => {
    const completePath = `coin/${fileName}`
    return getHudAssetUrl(completePath)
}

// hud/poison/* or hud/poison/animated/*
export const getHudPoisonAssetUrl = (fileName: string, animated = false) => {
    const completePath = animated ? `poison/animated/${fileName}` : `poison/${fileName}`
    return getHudAssetUrl(completePath)
}

// hud/bars/* (root: bars-coin.png, bars-life.png, bars-poison.png)
export const getHudBarsAssetUrl = (fileName: string) => {
    const completePath = `bars/${fileName}`
    return getHudAssetUrl(completePath)
}

// hud/bars/<color>/<type>/<file>
export const getHudBarAssetUrl = (fileName: string, color: string, type: string) => {
    const completePath = `bars/${color}/${type}/${fileName}`
    return getHudAssetUrl(completePath)
}
