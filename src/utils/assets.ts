export const getGameAssetUrl = (path: string): string =>
    new URL(`game/${path}`, window.location.href).toString()

export const assets = {
    enemies: {
        jellyfish: (fileName: string, state: string, color: string) =>
            getGameAssetUrl(`sprites/enemies/jellyfish/${state}/${color}/${fileName}`),

        pufferfish: (fileName: string, state: string, color: string) =>
            getGameAssetUrl(`sprites/enemies/pufferfish/${state}/${color}/${fileName}`),

        boss: (fileName: string, state: string) =>
            getGameAssetUrl(`sprites/enemies/boss/${state}/${fileName}`),
    },

    player: {
        state: (fileName: string, state: string) =>
            getGameAssetUrl(`sprites/player/${state}/${fileName}`),

        hurt: (fileName: string, variant: string) =>
            getGameAssetUrl(`sprites/player/hurt/${variant}/${fileName}`),

        dead: (fileName: string, variant: string) =>
            getGameAssetUrl(`sprites/player/dead/${variant}/${fileName}`),

        attack: {
            finSlap: (fileName: string) =>
                getGameAssetUrl(`sprites/player/attack/fin-slap/${fileName}`),

            bubbleTrap: (fileName: string, option?: string) =>
                option
                    ? getGameAssetUrl(`sprites/player/attack/bubble-trap/${option}/${fileName}`)
                    : getGameAssetUrl(`sprites/player/attack/bubble-trap/${fileName}`),
        },
    },

    backgrounds: {
        cover: (fileName = 'cover.png') => getGameAssetUrl(`backgrounds/${fileName}`),
        barrier: (fileName: string) => getGameAssetUrl(`backgrounds/barrier/${fileName}`),
        dark: (fileName: string) => getGameAssetUrl(`backgrounds/dark/${fileName}`),
        light: (fileName: string) => getGameAssetUrl(`backgrounds/light/${fileName}`),
        layer: (fileName: string, directory: string) =>
            getGameAssetUrl(`backgrounds/layers/${directory}/${fileName}`),
    },

    misc: {
        buttons: {
            start: (color: string) =>
                getGameAssetUrl(`misc/buttons/start/start-button-${color}.png`),

            fullscreen: (color: string) =>
                getGameAssetUrl(`misc/buttons/full-screen/full-screen-button-${color}.png`),

            tryAgain: (color: string) =>
                getGameAssetUrl(`misc/buttons/try-again/try-again-${color}.png`),
        },

        hud: {
            coin: (fileName: string) => getGameAssetUrl(`misc/hud/coin/${fileName}`),
            poison: (fileName: string, animated = false) =>
                animated
                    ? getGameAssetUrl(`misc/hud/poison/animated/${fileName}`)
                    : getGameAssetUrl(`misc/hud/poison/${fileName}`),

            bar: (fileName: string, color: string, type: string) =>
                getGameAssetUrl(`misc/hud/bars/${color}/${type}/${fileName}`),
        },
    }

} as const
