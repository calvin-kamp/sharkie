/**
 * @fileoverview Centralized asset URL builder for all game assets.
 * Provides organized namespace for constructing URLs to all sprite, UI, and environment assets.
 */

/**
 * Constructs absolute game asset URL from a relative path
 * @param {string} path - Relative path to the asset
 * @returns {string} Absolute URL to the game asset
 */
export const getGameAssetUrl = (path: string): string =>
    new URL(`game/${path}`, window.location.href).toString()

/**
 * Centralized asset URL builders organized by asset type
 * @type {Object}
 * @property {Object} enemies - Enemy sprite asset builders
 * @property {Object} player - Player sprite asset builders
 * @property {Object} backgrounds - Background asset builders
 * @property {Object} misc - Miscellaneous UI asset builders
 */
export const assets = {
    enemies: {
        /**
         * Gets jellyfish sprite URL
         * @param {string} fileName - The image filename
         * @param {string} state - Animation state (regular, dead, super-dangerous)
         * @param {string} color - Color variant (purple, yellow, green, pink)
         * @returns {string} Asset URL
         */
        jellyfish: (fileName: string, state: string, color: string) =>
            getGameAssetUrl(`sprites/enemies/jellyfish/${state}/${color}/${fileName}`),

        /**
         * Gets pufferfish sprite URL
         * @param {string} fileName - The image filename
         * @param {string} state - Animation state
         * @param {string} color - Color variant
         * @returns {string} Asset URL
         */
        pufferfish: (fileName: string, state: string, color: string) =>
            getGameAssetUrl(`sprites/enemies/pufferfish/${state}/${color}/${fileName}`),

        /**
         * Gets boss sprite URL
         * @param {string} fileName - The image filename
         * @param {string} state - Animation state (introduce, floating, attack, dead, hurt)
         * @returns {string} Asset URL
         */
        boss: (fileName: string, state: string) =>
            getGameAssetUrl(`sprites/enemies/boss/${state}/${fileName}`),
    },

    player: {
        /**
         * Gets player state sprite URL
         * @param {string} fileName - The image filename
         * @param {string} state - Animation state (swim, idle, long-idle)
         * @returns {string} Asset URL
         */
        state: (fileName: string, state: string) =>
            getGameAssetUrl(`sprites/player/${state}/${fileName}`),

        /**
         * Gets player hurt sprite URL
         * @param {string} fileName - The image filename
         * @param {string} variant - Hurt type (electric-shock, poisoned)
         * @returns {string} Asset URL
         */
        hurt: (fileName: string, variant: string) =>
            getGameAssetUrl(`sprites/player/hurt/${variant}/${fileName}`),

        /**
         * Gets player death sprite URL
         * @param {string} fileName - The image filename
         * @param {string} variant - Death type (electric-shock, poisoned)
         * @returns {string} Asset URL
         */
        dead: (fileName: string, variant: string) =>
            getGameAssetUrl(`sprites/player/dead/${variant}/${fileName}`),

        attack: {
            /**
             * Gets fin slap attack sprite URL
             * @param {string} fileName - The image filename
             * @returns {string} Asset URL
             */
            finSlap: (fileName: string) =>
                getGameAssetUrl(`sprites/player/attack/fin-slap/${fileName}`),

            /**
             * Gets bubble trap attack sprite URL
             * @param {string} fileName - The image filename
             * @param {string} [option] - Optional subdirectory
             * @returns {string} Asset URL
             */
            bubbleTrap: (fileName: string, option?: string) =>
                option
                    ? getGameAssetUrl(`sprites/player/attack/bubble-trap/${option}/${fileName}`)
                    : getGameAssetUrl(`sprites/player/attack/bubble-trap/${fileName}`),
        },
    },

    backgrounds: {
        /**
         * Gets cover background URL
         * @param {string} [fileName='cover.png'] - The image filename
         * @returns {string} Asset URL
         */
        cover: (fileName = 'cover.png') => getGameAssetUrl(`backgrounds/${fileName}`),

        /**
         * Gets barrier background URL
         * @param {string} fileName - The image filename
         * @returns {string} Asset URL
         */
        barrier: (fileName: string) => getGameAssetUrl(`backgrounds/barrier/${fileName}`),

        /**
         * Gets dark background URL
         * @param {string} fileName - The image filename
         * @returns {string} Asset URL
         */
        dark: (fileName: string) => getGameAssetUrl(`backgrounds/dark/${fileName}`),

        /**
         * Gets light background URL
         * @param {string} fileName - The image filename
         * @returns {string} Asset URL
         */
        light: (fileName: string) => getGameAssetUrl(`backgrounds/light/${fileName}`),

        /**
         * Gets background layer URL
         * @param {string} fileName - The image filename
         * @param {string} directory - Layer directory (background-1, background-2, floor, light, water)
         * @returns {string} Asset URL
         */
        layer: (fileName: string, directory: string) =>
            getGameAssetUrl(`backgrounds/layers/${directory}/${fileName}`),
    },

    misc: {
        buttons: {
            /**
             * Gets start button URL
             * @param {string} color - Button color variant
             * @returns {string} Asset URL
             */
            start: (color: string) =>
                getGameAssetUrl(`misc/buttons/start/start-button-${color}.png`),

            /**
             * Gets fullscreen button URL
             * @param {string} color - Button color variant
             * @returns {string} Asset URL
             */
            fullscreen: (color: string) =>
                getGameAssetUrl(`misc/buttons/full-screen/full-screen-button-${color}.png`),

            /**
             * Gets try again button URL
             * @param {string} color - Button color variant
             * @returns {string} Asset URL
             */
            tryAgain: (color: string) =>
                getGameAssetUrl(`misc/buttons/try-again/try-again-${color}.png`),
        },

        hud: {
            /**
             * Gets HUD coin icon URL
             * @param {string} fileName - The image filename
             * @returns {string} Asset URL
             */
            coin: (fileName: string) => getGameAssetUrl(`misc/hud/coin/${fileName}`),

            /**
             * Gets HUD poison icon URL
             * @param {string} fileName - The image filename
             * @param {boolean} [animated=false] - Whether to get animated variant
             * @returns {string} Asset URL
             */
            poison: (fileName: string, animated = false) =>
                animated
                    ? getGameAssetUrl(`misc/hud/poison/animated/${fileName}`)
                    : getGameAssetUrl(`misc/hud/poison/${fileName}`),

            /**
             * Gets HUD status bar URL
             * @param {string} fileName - The image filename
             * @param {string} color - Bar color (purple, green, orange)
             * @param {string} type - Bar type (life, coin, poison)
             * @returns {string} Asset URL
             */
            bar: (fileName: string, color: string, type: string) =>
                getGameAssetUrl(`misc/hud/bars/${color}/${type}/${fileName}`),
        },
    },
} as const
