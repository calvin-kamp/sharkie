/**
 * @fileoverview Level configuration with difficulty settings and collectible positions.
 * Defines game stats for each difficulty level and placement of coins and poison bottles.
 */

import type { Difficulty } from '@models/level.model'

/**
 * Combat and health statistics for a difficulty level
 * @typedef {Object} DifficultyStats
 * @property {number} playerHp - Player maximum health
 * @property {number} pufferfishHp - Pufferfish health
 * @property {number} pufferfishDmg - Pufferfish damage output
 * @property {number} jellyfishHp - Jellyfish health
 * @property {number} jellyfishDmg - Jellyfish damage output
 * @property {number} jellyfishSuperHp - Super jellyfish health
 * @property {number} jellyfishSuperDmg - Super jellyfish damage output
 * @property {number} bossHp - Boss health
 * @property {number} bossDmg - Boss damage output
 */
export type DifficultyStats = {
    playerHp: number
    pufferfishHp: number
    pufferfishDmg: number
    jellyfishHp: number
    jellyfishDmg: number
    jellyfishSuperHp: number
    jellyfishSuperDmg: number
    bossHp: number
    bossDmg: number
}

/**
 * Combat stats configuration for each difficulty level
 * @type {Record<Difficulty, DifficultyStats>}
 */
export const DIFFICULTY_STATS: Record<Difficulty, DifficultyStats> = {
    easy: {
        playerHp: 20,
        pufferfishHp: 2,
        pufferfishDmg: 1,
        jellyfishHp: 2,
        jellyfishDmg: 1,
        jellyfishSuperHp: 4,
        jellyfishSuperDmg: 2,
        bossHp: 10,
        bossDmg: 2,
    },
    medium: {
        playerHp: 20,
        pufferfishHp: 4,
        pufferfishDmg: 2,
        jellyfishHp: 4,
        jellyfishDmg: 2,
        jellyfishSuperHp: 8,
        jellyfishSuperDmg: 4,
        bossHp: 20,
        bossDmg: 4,
    },
    hard: {
        playerHp: 10,
        pufferfishHp: 4,
        pufferfishDmg: 2,
        jellyfishHp: 4,
        jellyfishDmg: 2,
        jellyfishSuperHp: 8,
        jellyfishSuperDmg: 4,
        bossHp: 20,
        bossDmg: 4,
    },
    impossible: {
        playerHp: 1,
        pufferfishHp: 4,
        pufferfishDmg: 2,
        jellyfishHp: 4,
        jellyfishDmg: 2,
        jellyfishSuperHp: 8,
        jellyfishSuperDmg: 4,
        bossHp: 20,
        bossDmg: 4,
    },
}

/**
 * Collectible item positions for the level
 * @type {Object}
 * @property {Array<{x: number, y: number}>} coins - Coin spawn positions
 * @property {Array<{x: number, y: number}>} poisons - Poison bottle spawn positions
 */
export const LEVEL_COLLECTIBLES = {
    coins: [
        { x: 250, y: 330 },
        { x: 480, y: 120 },
        { x: 720, y: 140 },
        { x: 980, y: 340 },
        { x: 1300, y: 280 },
        { x: 1550, y: 160 },
        { x: 1750, y: 320 },
        { x: 2120, y: 110 },
    ],
    poisons: [
        { x: 520, y: 260 },
        { x: 900, y: 210 },
        { x: 1600, y: 230 },
        { x: 1900, y: 180 },
        { x: 2280, y: 300 },
    ],
} as const
