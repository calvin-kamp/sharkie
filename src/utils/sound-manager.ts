/**
 * @fileoverview Sound manager for game audio control.
 * Handles playing background audio and toggling sound on/off.
 */

/**
 * Manages game sound and audio playback
 */
export class SoundManager {
    /** Audio element for background music */
    private audioElement: HTMLAudioElement
    /** Whether sound is currently enabled */
    private isEnabled: boolean

    /**
     * Creates a new sound manager
     * @param {string} audioPath - Path to the audio file
     */
    constructor(audioPath: string) {
        this.audioElement = new Audio(audioPath)
        this.audioElement.loop = true
        this.audioElement.volume = 0.3

        // Load saved preference or default to enabled
        this.isEnabled = this.loadPreference() ?? true

        // Apply saved state
        if (this.isEnabled) {
            this.play()
        }
    }

    /**
     * Plays the audio
     */
    play(): void {
        this.audioElement.play().catch(() => {
            // Audio playback may fail in some scenarios (user interaction required, etc.)
        })
    }

    /**
     * Pauses the audio
     */
    pause(): void {
        this.audioElement.pause()
    }

    /**
     * Toggles sound on/off
     * @returns {boolean} New sound state (true = enabled, false = disabled)
     */
    toggle(): boolean {
        this.isEnabled = !this.isEnabled
        this.savePreference(this.isEnabled)

        if (this.isEnabled) {
            this.play()
        } else {
            this.pause()
        }

        return this.isEnabled
    }

    /**
     * Gets current sound state
     * @returns {boolean} Whether sound is enabled
     */
    isAudioEnabled(): boolean {
        return this.isEnabled
    }

    /**
     * Sets sound volume (0-1)
     * @param {number} volume - Volume level (0 = mute, 1 = max)
     */
    setVolume(volume: number): void {
        this.audioElement.volume = Math.max(0, Math.min(1, volume))
    }

    /**
     * Saves sound preference to localStorage
     * @param {boolean} enabled - Whether sound is enabled
     * @private
     */
    private savePreference(enabled: boolean): void {
        localStorage.setItem('sharkie-sound-enabled', JSON.stringify(enabled))
    }

    /**
     * Loads sound preference from localStorage
     * @returns {boolean | null} Saved preference or null if not found
     * @private
     */
    private loadPreference(): boolean | null {
        const saved = localStorage.getItem('sharkie-sound-enabled')
        return saved !== null ? JSON.parse(saved) : null
    }
}
