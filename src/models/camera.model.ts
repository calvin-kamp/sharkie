/**
 * @fileoverview Camera system for viewport management and following player.
 * Handles camera offset calculation and view boundary tracking.
 */

import { clamp } from '@root/utils/geometry'

/**
 * Camera class managing the game viewport and offset for following the player
 */
export class Camera {
    /** Current camera offset in pixels */
    offset = 0
    
    /** Canvas width in pixels */
    private readonly canvasWidth: number
    /** Minimum allowed offset (right boundary) */
    private readonly minOffset: number
    /** Maximum allowed offset (left boundary) */
    private readonly maxOffset: number

    /**
     * Creates a new camera instance
     * @param {number} canvasWidth - Width of the canvas viewport
     * @param {number} minOffset - Minimum offset value (right boundary)
     * @param {number} maxOffset - Maximum offset value (left boundary)
     */
    constructor(canvasWidth: number, minOffset: number, maxOffset: number) {
        this.canvasWidth = canvasWidth
        this.minOffset = minOffset
        this.maxOffset = maxOffset
    }

    /**
     * Sets the camera offset within allowed bounds
     * @param {number} nextOffset - The desired offset value
     */
    setOffset(nextOffset: number): void {
        this.offset = clamp(nextOffset, this.minOffset, this.maxOffset)
    }

    /**
     * Synchronizes camera to player position (centers player in view)
     * @param {number} playerX - Player's X position
     * @param {number} playerWidth - Player's width
     */
    syncToPlayer(playerX: number, playerWidth: number): void {
        const playerCenterX = playerX + playerWidth / 2
        const targetOffset = -(playerCenterX - this.canvasWidth / 2)
        this.setOffset(targetOffset)
    }

    /**
     * Updates camera position to follow player
     * @param {number} playerX - Player's X position
     * @param {number} playerWidth - Player's width
     */
    updateForPlayer(playerX: number, playerWidth: number): void {
        const playerCenterX = playerX + playerWidth / 2
        const targetOffset = -(playerCenterX - this.canvasWidth / 2)
        this.setOffset(targetOffset)
    }

    /**
     * Checks if camera is at the right edge boundary
     * @returns {boolean} True if at right edge
     */
    isAtRightEdge(): boolean {
        return Math.abs(this.offset - this.minOffset) < 0.5
    }

    /**
     * Gets the current view boundaries in world coordinates
     * @returns {{ left: number; right: number }} The left and right bounds of the viewport
     */
    getViewBounds(): { left: number; right: number } {
        const left = -this.offset
        const right = left + this.canvasWidth
        return { left, right }
    }
}
