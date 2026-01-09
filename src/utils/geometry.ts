/**
 * @fileoverview Geometry utility functions for collision detection and math.
 * Provides rectangle intersection testing, clamping, and hitbox calculations.
 */

/**
 * Rectangle with position and dimensions
 * @typedef {Object} Rect
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} width - Width in pixels
 * @property {number} height - Height in pixels
 */
export type Rect = { x: number; y: number; width: number; height: number }

/**
 * Interface for objects that provide collision hitbox information
 * @typedef {Object} HitboxProvider
 * @property {Function} getHitbox - Method returning the hitbox rectangle
 */
export type HitboxProvider = { getHitbox: () => Rect }

/**
 * Clamps a value between minimum and maximum bounds
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} The clamped value
 */
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

/**
 * Creates a padded rectangle (shrinks or expands by given amount)
 * @param {Rect} r - The rectangle to pad
 * @param {number} pad - Padding amount (positive shrinks, negative expands)
 * @returns {Rect} The padded rectangle
 */
export const padRect = (r: Rect, pad: number): Rect => ({
    x: r.x + pad,
    y: r.y + pad,
    width: Math.max(0, r.width - pad * 2),
    height: Math.max(0, r.height - pad * 2),
})

/**
 * Checks if two rectangles intersect
 * @param {Rect} a - First rectangle
 * @param {Rect} b - Second rectangle
 * @returns {boolean} True if rectangles intersect
 */
export const rectsIntersect = (a: Rect, b: Rect) =>
    a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

/**
 * Checks if two hitbox providers are colliding
 * @param {HitboxProvider} a - First object with hitbox
 * @param {HitboxProvider} b - Second object with hitbox
 * @param {number} [padding=0] - Collision padding to expand/shrink hitboxes
 * @returns {boolean} True if objects are colliding
 */
export const isColliding = (a: HitboxProvider, b: HitboxProvider, padding = 0) => {
    const ra = padRect(a.getHitbox(), padding)
    const rb = padRect(b.getHitbox(), padding)
    return rectsIntersect(ra, rb)
}
