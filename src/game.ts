import '@styles/styles.scss'

import { World } from '@models/world.model'
import { createLevel, type Difficulty } from '@root/levels/level'
import { MobileControls } from '@root/utils/mobile-controls'

const component = '*[data-component=canvas]'

type Screen =
    | 'main'
    | 'difficulty'
    | 'pause'
    | 'controls'
    | 'description'
    | 'enemies'
    | 'items'

const game = {
    world: null as World | null,
    isPaused: false,
    lastNonPauseScreen: 'main' as Screen,
    mobileControls: null as MobileControls | null,

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
                window.location.reload()
            
                return
            }
        })
    },

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

    startGame($canvas: HTMLCanvasElement, $menu: HTMLElement, difficulty: Difficulty) {
        if (this.world) {
            window.location.reload()
            
            return
        }

        const level = createLevel(difficulty)
        this.world = new World($canvas, level)
        this.world.draw()

        this.isPaused = false
        this.hideMenu($menu)

        this.mobileControls?.show()
    },

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

    resume($menu: HTMLElement) {
        if (!this.world) {
            return
        }

        this.isPaused = false
        this.world.setPaused(false)
        this.hideMenu($menu)

        this.mobileControls?.show()
    },

    showMenu($menu: HTMLElement) {
        $menu.classList.add('is-visible')
    },

    hideMenu($menu: HTMLElement) {
        $menu.classList.remove('is-visible')
    },

    showScreen($menu: HTMLElement, screen: Screen) {
        const screens = Array.from($menu.querySelectorAll<HTMLElement>('[data-screen]'))
        
        for (const s of screens) {
            s.classList.remove('is-active')
        }

        const next = $menu.querySelector<HTMLElement>(`[data-screen="${screen}"]`)
        next?.classList.add('is-active')
    },

    getActiveScreen($menu: HTMLElement): Screen {
        const active = $menu.querySelector<HTMLElement>('[data-screen].is-active')
        
        return (active?.dataset.screen as Screen | undefined) ?? 'main'
    },
}

game.init()
