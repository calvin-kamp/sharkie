/**
 * @fileoverview Main game initialization and menu management module.
 * Handles game initialization, menu UI interactions, game lifecycle (pause/resume/start),
 * and screen navigation.
 */

import '@styles/styles.scss'

import { World } from '@models/world.model'
import { createLevel, type Difficulty } from '@root/levels/level'
import { MobileControls } from '@root/utils/mobile-controls'

/** CSS selector for the canvas element */
const component = '*[data-component=canvas]'

/**
 * Available menu screens in the game UI
 * @typedef {'main' | 'difficulty' | 'pause' | 'controls' | 'description' | 'enemies' | 'items'} Screen
 */
type Screen =
    | 'main'
    | 'difficulty'
    | 'pause'
    | 'controls'
    | 'description'
    | 'enemies'
    | 'items'

/**
 * Main game object managing game state and UI interactions
 */
const game = {
    world: null as World | null,
    isPaused: false,
    lastNonPauseScreen: 'main' as Screen,
    lastDifficulty: null as Difficulty | null,
    mobileControls: null as MobileControls | null,

    /**
     * Initializes the game by setting up canvas, menu, and event bindings
     */
    init() {
        const $canvas = document.querySelector<HTMLCanvasElement>(component)
        const $menu = document.querySelector<HTMLElement>('[data-menu]')
        const $mobile = document.querySelector<HTMLElement>('[data-mobile-controls]')

        if (!$canvas || !$menu) {
            return
        }

        if ($mobile) {
            this.mobileControls = new MobileControls($mobile)
        }

        this.bindMenu($canvas, $menu)
        this.bindEsc($menu)

        this.showMenu($menu)
        this.showScreen($menu, 'main')
    },

    /**
     * Binds menu button click handlers
     * @param {HTMLCanvasElement} $canvas - Canvas element
     * @param {HTMLElement} $menu - Menu element
     */
    bindMenu($canvas: HTMLCanvasElement, $menu: HTMLElement) {
        $menu.addEventListener('click', (e) => {
            const target = e.target as HTMLElement | null
            const btn = target?.closest<HTMLElement>('[data-action]')
            
            if (!btn) {
                return
            }

            const action = btn.dataset.action

            if (action === 'open-difficulty') {
                this.lastNonPauseScreen = 'difficulty'
                this.showScreen($menu, 'difficulty')
            
                return
            }

            if (action === 'open-controls') {
                const from = (btn as HTMLElement).dataset.from
            
                this.lastNonPauseScreen = from === 'pause' ? 'pause' : 'main'
                this.showScreen($menu, 'controls')
            
                return
            }

            if (action === 'open-description') {
                this.lastNonPauseScreen = 'main'
                this.showScreen($menu, 'description')
            
                return
            }

            if (action === 'open-enemies') {
                this.lastNonPauseScreen = 'main'
                this.showScreen($menu, 'enemies')
            
                return
            }

            if (action === 'open-items') {
                this.lastNonPauseScreen = 'main'
                this.showScreen($menu, 'items')
            
                return
            }

            if (action === 'back' || action === 'back-main') {
                const backTo: Screen = action === 'back-main' ? 'main' : this.lastNonPauseScreen
                this.showScreen($menu, backTo)
            
                return
            }

            if (action === 'start-game') {
                const difficulty = (btn.dataset.difficulty as Difficulty | undefined) ?? 'easy'
                this.startGame($canvas, $menu, difficulty)
            
                return
            }

            if (action === 'resume') {
                this.resume($menu)
            
                return
            }

            if (action === 'main-menu') {
                this.destroyWorld()
                this.showMenu($menu)
                this.showScreen($menu, 'main')
                this.mobileControls?.hide()
            
                return
            }
        })
    },

    /**
     * Binds Escape key handler for menu navigation
     * @param {HTMLElement} $menu - Menu element
     */
    bindEsc($menu: HTMLElement) {
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') {
                return
            }

            if (!this.world) {
                const active = this.getActiveScreen($menu)
                this.showScreen($menu, active === 'main' ? 'main' : 'main')
            
                return
            }

            if (!this.isPaused) {
                this.pause($menu)
            } else {
                const active = this.getActiveScreen($menu)
            
                if (active !== 'pause') {
                    this.showScreen($menu, 'pause')
                } else {
                    this.resume($menu)
                }
            }
        })
    },

    /**
     * Starts a new game with the selected difficulty
     * @param {HTMLCanvasElement} $canvas - Canvas element
     * @param {HTMLElement} $menu - Menu element
     * @param {Difficulty} difficulty - Selected difficulty level
     */
    startGame($canvas: HTMLCanvasElement, $menu: HTMLElement, difficulty: Difficulty) {
        if (this.world) {
            this.destroyWorld()
        }

        this.lastDifficulty = difficulty
        const level = createLevel(difficulty)
        this.world = new World($canvas, level, () => this.finishToMainMenu($menu))
        this.world.draw()

        this.isPaused = false
        this.hideMenu($menu)

        this.mobileControls?.show()
    },

    /**
     * Pauses the game and shows pause menu
     * @param {HTMLElement} $menu - Menu element
     */
    pause($menu: HTMLElement) {
        if (!this.world) {
            return
        }

        this.isPaused = true
        this.world.setPaused(true)

        this.mobileControls?.hide()

        this.showMenu($menu)
        this.showScreen($menu, 'pause')
    },

    /**
     * Resumes the game from pause
     * @param {HTMLElement} $menu - Menu element
     */
    resume($menu: HTMLElement) {
        if (!this.world) {
            return
        }

        this.isPaused = false
        this.world.setPaused(false)
        this.hideMenu($menu)

        this.mobileControls?.show()
    },

    destroyWorld() {
        if (!this.world) {
            return
        }

        this.world.destroy()
        this.world = null
        this.isPaused = false
    },

    finishToMainMenu($menu: HTMLElement) {
        this.destroyWorld()
        this.showMenu($menu)
        this.showScreen($menu, 'main')
        this.mobileControls?.hide()
    },

    /**
     * Shows the menu overlay
     * @param {HTMLElement} $menu - Menu element
     */
    showMenu($menu: HTMLElement) {
        $menu.classList.add('is-visible')
    },

    /**
     * Hides the menu overlay
     * @param {HTMLElement} $menu - Menu element
     */
    hideMenu($menu: HTMLElement) {
        $menu.classList.remove('is-visible')
    },

    /**
     * Shows a specific menu screen
     * @param {HTMLElement} $menu - Menu element
     * @param {Screen} screen - Screen to show
     */
    showScreen($menu: HTMLElement, screen: Screen) {
        const screens = Array.from($menu.querySelectorAll<HTMLElement>('[data-screen]'))
        
        for (const s of screens) {
            s.classList.remove('is-active')
        }

        const next = $menu.querySelector<HTMLElement>(`[data-screen="${screen}"]`)
        next?.classList.add('is-active')
    },

    /**
     * Gets the currently active menu screen
     * @param {HTMLElement} $menu - Menu element
     * @returns {Screen} Active screen name
     */
    getActiveScreen($menu: HTMLElement): Screen {
        const active = $menu.querySelector<HTMLElement>('[data-screen].is-active')
        
        return (active?.dataset.screen as Screen | undefined) ?? 'main'
    },
}

game.init()
