/**
 * @fileoverview Helper utility functions for random numbers and asset URL generation.
 * Provides URL builders for different asset types organized by game category.
 */

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer between min and max
 */
export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Constructs absolute game asset URL from a relative path
 * @param {string} path - Relative path to the asset
 * @returns {string} Absolute URL to the game asset
 */
export const getGameAssetUrl = (path: string): string => {
    return new URL(`game/${path}`, window.location.href).toString()
}

/* -------------------------------------------------------------------------- */
/* sprites                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Constructs URL for sprite assets
 * @param {string} path - Relative path to the sprite
 * @returns {string} URL to the sprite asset
 */
export const getSpriteAssetUrl = (path: string): string => {
    const completePath = `/sprites/${path}`
    return getGameAssetUrl(completePath)
}

/* ------------------------------ enemies ----------------------------------- */

/**
 * Constructs URL for enemy sprite assets
 * @param {string} path - Relative path to the enemy sprite
 * @returns {string} URL to the enemy sprite asset
 */
export const getEnemyAssetUrl = (path: string): string => {
    const completePath = `/sprites/enemies/${path}`
    return getGameAssetUrl(completePath)
}

/**
 * Constructs URL for jellyfish sprite assets
 * @param {string} fileName - File name
 * @param {string} state - Animation state
 * @param {string} color - Jellyfish color
 * @returns {string} URL to the jellyfish sprite
 */
export const getJellyFishAssetUrl = (fileName: string, state: string, color: string) => {
    const completePath = `jellyfish/${state}/${color}/${fileName}`
    return getEnemyAssetUrl(completePath)
}

/**
 * Constructs URL for pufferfish sprite assets
 * @param {string} fileName - File name
 * @param {string} state - Animation state
 * @param {string} color - Pufferfish color
 * @returns {string} URL to the pufferfish sprite
 */
export const getPufferFishAssetUrl = (fileName: string, state: string, color: string) => {
    const completePath = `pufferfish/${state}/${color}/${fileName}`
    return getEnemyAssetUrl(completePath)
}

/**
 * Constructs URL for boss sprite assets
 * @param {string} fileName - File name
 * @param {string} state - Animation state
 * @returns {string} URL to the boss sprite
 */
export const getBossAssetUrl = (fileName: string, state: string) => {
    const completePath = `boss/${state}/${fileName}`
    return getEnemyAssetUrl(completePath)
}

/* ------------------------------ player ------------------------------------ */

/**
 * Constructs URL for player sprite assets
 * @param {string} path - Relative path to the player sprite
 * @returns {string} URL to the player sprite asset
 */
export const getPlayerAssetUrl = (path: string): string => {
    const completePath = `player/${path}`
    return getSpriteAssetUrl(completePath)
}

/**
 * Constructs URL for player state sprite assets
 * @param {string} fileName - File name
 * @param {string} state - Player state
 * @returns {string} URL to the player state sprite
 */
export const getPlayerStateAssetUrl = (fileName: string, state: string) => {
    const completePath = `${state}/${fileName}`
    return getPlayerAssetUrl(completePath)
}

/**
 * Constructs URL for player hurt animation assets
 * @param {string} fileName - File name
 * @param {string} variant - Hurt variant type
 * @returns {string} URL to the player hurt sprite
 */
export const getPlayerHurtAssetUrl = (fileName: string, variant: string) => {
    const completePath = `hurt/${variant}/${fileName}`
    return getPlayerAssetUrl(completePath)
}

/**
 * Constructs URL for player death animation assets
 * @param {string} fileName - File name
 * @param {string} variant - Death variant type
 * @returns {string} URL to the player death sprite
 */
export const getPlayerDeadAssetUrl = (fileName: string, variant: string) => {
    const completePath = `dead/${variant}/${fileName}`
    return getPlayerAssetUrl(completePath)
}

/**
 * Constructs URL for fin slap attack animation assets
 * @param {string} fileName - File name
 * @returns {string} URL to the fin slap sprite
 */
export const getFinSlapAssetUrl = (fileName: string) => {
    const completePath = `attack/fin-slap/${fileName}`
    return getPlayerAssetUrl(completePath)
}

/**
 * Constructs URL for bubble trap attack animation assets
 * @param {string} fileName - File name
 * @param {string} [option] - Optional subfolder (e.g., 'poisoned')
 * @returns {string} URL to the bubble trap sprite
 */
export const getBubbleTrapAssetUrl = (fileName: string, option?: string) => {
    const completePath = option
        ? `attack/bubble-trap/${option}/${fileName}`
        : `attack/bubble-trap/${fileName}`
    return getPlayerAssetUrl(completePath)
}

/**
 * Constructs URL for background assets
 * @param {string} path - Relative path to the background asset
 * @returns {string} URL to the background asset
 */
export const getBackgroundAssetUrl = (path: string) => {
    const completePath = `backgrounds/${path}`
    return getGameAssetUrl(completePath)
}

/**
 * Constructs URL for cover image asset
 * @param {string} [fileName='cover.png'] - Cover file name
 * @returns {string} URL to the cover asset
 */
export const getCoverAssetUrl = (fileName = 'cover.png') => {
    const completePath = `${fileName}`
    return getBackgroundAssetUrl(completePath)
}

/**
 * Constructs URL for barrier background assets
 * @param {string} fileName - File name
 * @returns {string} URL to the barrier asset
 */
export const getBarrierAssetUrl = (fileName: string) => {
    const completePath = `barrier/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

/**
 * Constructs URL for dark theme background assets
 * @param {string} fileName - File name
 * @returns {string} URL to the dark background asset
 */
export const getDarkBackgroundAssetUrl = (fileName: string) => {
    const completePath = `dark/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

/**
 * Constructs URL for light theme background assets
 * @param {string} fileName - File name
 * @returns {string} URL to the light background asset
 */
export const getLightBackgroundAssetUrl = (fileName: string) => {
    const completePath = `light/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

/**
 * Constructs URL for background layer assets
 * @param {string} fileName - File name
 * @param {string} directory - Layer directory name
 * @returns {string} URL to the layer asset
 */
export const getLayerAssetUrl = (fileName: string, directory: string) => {
    const completePath = `backgrounds/layers/${directory}/${fileName}`
    return getGameAssetUrl(completePath)
}

/**
 * Constructs URL for legacy dark background assets
 * @param {string} fileName - File name
 * @returns {string} URL to the legacy dark background asset
 */
export const getLegacyDarkBackgroundAssetUrl = (fileName: string) => {
    const completePath = `legacy/dark/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

/**
 * Constructs URL for legacy light background assets
 * @param {string} fileName - File name
 * @returns {string} URL to the legacy light background asset
 */
export const getLegacyLightBackgroundAssetUrl = (fileName: string) => {
    const completePath = `legacy/light/${fileName}`
    return getBackgroundAssetUrl(completePath)
}

/**
 * Constructs URL for legacy background layer assets
 * @param {string} fileName - File name
 * @param {string} directory - Layer directory name
 * @returns {string} URL to the legacy layer asset
 */
export const getLegacyLayerAssetUrl = (fileName: string, directory: string) => {
    const completePath = `backgrounds/legacy/layers/${directory}/${fileName}`
    return getGameAssetUrl(completePath)
}

/**
 * Constructs URL for miscellaneous game assets
 * @param {string} path - Relative path to the misc asset
 * @returns {string} URL to the misc asset
 */
export const getMiscAssetUrl = (path: string): string => {
    const completePath = `misc/${path}`
    return getGameAssetUrl(completePath)
}

/**
 * Constructs URL for button UI assets
 * @param {string} section - Button section/category
 * @param {string} fileName - File name
 * @returns {string} URL to the button asset
 */
export const getButtonAssetUrl = (section: string, fileName: string) => {
    const completePath = `buttons/${section}/${fileName}`
    return getMiscAssetUrl(completePath)
}

/**
 * Constructs URL for start button asset
 * @param {string} color - Button color
 * @returns {string} URL to the start button asset
 */
export const getStartButtonAssetUrl = (color: string) => {
    return getButtonAssetUrl('start', `start-button-${color}.png`)
}

/**
 * Constructs URL for fullscreen button asset
 * @param {string} color - Button color
 * @returns {string} URL to the fullscreen button asset
 */
export const getFullscreenButtonAssetUrl = (color: string) => {
    return getButtonAssetUrl('full-screen', `full-screen-button-${color}.png`)
}

/**
 * Constructs URL for try again button asset
 * @param {string} color - Button color
 * @returns {string} URL to the try again button asset
 */
export const getTryAgainButtonAssetUrl = (color: string) => {
    return getButtonAssetUrl('try-again', `try-again-${color}.png`)
}

/**
 * Constructs URL for instructions UI asset
 * @param {string | number} fileNameOrIndex - File name or numeric index
 * @returns {string} URL to the instructions asset
 */
export const getInstructionsAssetUrl = (fileNameOrIndex: string | number) => {
    const fileName =
        typeof fileNameOrIndex === 'number'
            ? `instructions-${fileNameOrIndex}.png`
            : fileNameOrIndex
    return getButtonAssetUrl('instructions', fileName)
}

/**
 * Constructs URL for keyboard key UI asset
 * @param {string} fileName - File name
 * @returns {string} URL to the key asset
 */
export const getKeyAssetUrl = (fileName: string) => {
    return getButtonAssetUrl('key', fileName)
}

/**
 * Constructs URL for title UI asset
 * @param {string} fileName - File name
 * @returns {string} URL to the title asset
 */
export const getTitleAssetUrl = (fileName: string) => {
    return getButtonAssetUrl('titles', fileName)
}

/**
 * Constructs URL for game over title asset
 * @param {string} fileName - File name
 * @returns {string} URL to the game over title asset
 */
export const getGameOverTitleAssetUrl = (fileName: string) => {
    const completePath = `buttons/titles/game-over/${fileName}`
    return getMiscAssetUrl(completePath)
}

/**
 * Constructs URL for you win title asset
 * @param {string} fileName - File name
 * @returns {string} URL to the you win title asset
 */
export const getYouWinTitleAssetUrl = (fileName: string) => {
    const completePath = `buttons/titles/you-win/${fileName}`
    return getMiscAssetUrl(completePath)
}

/**
 * Constructs URL for HUD UI assets
 * @param {string} path - Relative path to the HUD asset
 * @returns {string} URL to the HUD asset
 */
export const getHudAssetUrl = (path: string) => {
    const completePath = `hud/${path}`
    return getMiscAssetUrl(completePath)
}

/**
 * Constructs URL for HUD coin icon asset
 * @param {string} fileName - File name
 * @returns {string} URL to the HUD coin asset
 */
export const getHudCoinAssetUrl = (fileName: string) => {
    const completePath = `coin/${fileName}`
    return getHudAssetUrl(completePath)
}

/**
 * Constructs URL for HUD poison icon asset
 * @param {string} fileName - File name
 * @param {boolean} [animated=false] - Whether to use animated version
 * @returns {string} URL to the HUD poison asset
 */
export const getHudPoisonAssetUrl = (fileName: string, animated = false) => {
    const completePath = animated ? `poison/animated/${fileName}` : `poison/${fileName}`
    return getHudAssetUrl(completePath)
}

/**
 * Constructs URL for HUD status bar assets
 * @param {string} fileName - File name
 * @returns {string} URL to the HUD bars asset
 */
export const getHudBarsAssetUrl = (fileName: string) => {
    const completePath = `bars/${fileName}`
    return getHudAssetUrl(completePath)
}

/**
 * Constructs URL for specific colored HUD bar asset
 * @param {string} fileName - File name
 * @param {string} color - Bar color
 * @param {string} type - Bar type (life, poison, coin)
 * @returns {string} URL to the HUD bar asset
 */
export const getHudBarAssetUrl = (fileName: string, color: string, type: string) => {
    const completePath = `bars/${color}/${type}/${fileName}`
    return getHudAssetUrl(completePath)
}
