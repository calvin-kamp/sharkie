/**
 * @fileoverview Status bar UI component for displaying health bars.
 * Manages animated health bar rendering with sprite sheet frames.
 */

import { DrawableObject } from '@models/drawable-object.model'
import { assets } from '@root/utils/assets'

/**
 * Types of status bars
 * @typedef {'life'} StatusBarType
 */
export type StatusBarType = 'life'

/**
 * Color schemes for status bars
 * @typedef {'purple' | 'green' | 'orange'} StatusBarColor
 */
export type StatusBarColor = 'purple' | 'green' | 'orange'

/**
 * Configuration for status bar
 * @typedef {Object} StatusBarConfig
 * @property {StatusBarType} type - The type of status bar
 * @property {StatusBarColor} [color='purple'] - Color scheme for the bar
 * @property {number} x - X position on canvas
 * @property {number} y - Y position on canvas
 * @property {number} [width=200] - Width of the status bar
 * @property {number} [value] - Current value (defaults to maxValue)
 * @property {number} maxValue - Maximum value for the bar
 */
type StatusBarConfig = {
    type: StatusBarType
    color?: StatusBarColor
    x: number
    y: number
    width?: number
    value?: number
    maxValue: number
}

/**
 * Status bar UI component for displaying health bars with animations
 */
export class StatusBar extends DrawableObject {
    /** Type of status bar */
    readonly type: StatusBarType
    /** Color scheme of the bar */
    readonly color: StatusBarColor

    /** Current value displayed */
    value: number
    /** Maximum possible value */
    maxValue: number

    /**
     * Creates a new status bar
     * @param {StatusBarConfig} config - Configuration for the status bar
     */
    constructor(config: StatusBarConfig) {
        const color = config.color ?? 'purple'

        const width = config.width ?? 200
        const aspectRatio = 158 / 595

        const initialStep = StatusBar.toStep(config.value ?? config.maxValue, config.maxValue)
        const imageSrc = StatusBar.getBarFrame(color, config.type, initialStep)

        super({
            imageSrc,
            x: config.x,
            y: config.y,
            width,
            aspectRatio,
        })

        this.type = config.type
        this.color = color
        this.value = config.value ?? config.maxValue
        this.maxValue = Math.max(1, config.maxValue)

        this.cacheImages([
            StatusBar.getBarFrame(this.color, this.type, 0),
            StatusBar.getBarFrame(this.color, this.type, 20),
            StatusBar.getBarFrame(this.color, this.type, 40),
            StatusBar.getBarFrame(this.color, this.type, 60),
            StatusBar.getBarFrame(this.color, this.type, 80),
            StatusBar.getBarFrame(this.color, this.type, 100),
        ])
    }

    /**
     * Updates the maximum value and adjusts current value if needed
     * @param {number} maxValue - New maximum value
     */
    setMaxValue(maxValue: number) {
        this.maxValue = Math.max(1, maxValue)
        this.setValue(this.value)
    }

    /**
     * Updates the current value and refreshes the bar display
     * @param {number} value - New current value
     */
    setValue(value: number) {
        this.value = Math.max(0, value)

        const step = StatusBar.toStep(this.value, this.maxValue)

        this.loadImage(StatusBar.getBarFrame(this.color, this.type, step))
    }

    /**
     * Converts value and maxValue to a step value for bar display
     * @param {number} value - Current value
     * @param {number} maxValue - Maximum value
     * @returns {0 | 20 | 40 | 60 | 80 | 100} The step value
     * @private
     * @static
     */
    private static toStep(value: number, maxValue: number): 0 | 20 | 40 | 60 | 80 | 100 {
        if (maxValue <= 0 || value <= 0) {
            return 0
        }
        
        const pct = (value / maxValue) * 100

        const stepped = Math.round(pct / 20) * 20
        const clamped = Math.max(0, Math.min(100, stepped))

        if (clamped <= 0) {
            return 20
        }

        if (clamped <= 20) {
            return 20
        }

        if (clamped <= 40) {
            return 40
        }

        if (clamped <= 60) {
            return 60
        }

        if (clamped <= 80) {
            return 80
        }

        return 100
    }

    /**
     * Gets the asset URL for a specific bar frame
     * @param {StatusBarColor} color - Bar color scheme
     * @param {StatusBarType} type - Bar type
     * @param {number} step - Progress step (0-100)
     * @returns {string} Asset URL for the bar frame
     * @private
     * @static
     */
    private static getBarFrame(color: StatusBarColor, type: StatusBarType, step: number) {
        const suffix = step === 0 ? '00' : String(step)
        const fileName = `${color}-${type}-${suffix}.png`
        
        return assets.misc.hud.bar(fileName, color, type)
    }
}
