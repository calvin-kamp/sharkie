/**
 * @fileoverview Combat configuration interface for damage and health stats.
 * Defines health and damage parameters for combat systems.
 */

/**
 * Configuration for combat stats (health and damage)
 * @typedef {Object} CombatConfig
 * @property {number} [maxHp] - Maximum health points
 * @property {number} [hp] - Current health points
 * @property {number} [damage] - Damage output
 */
export interface CombatConfig {
    maxHp?: number
    hp?: number
    damage?: number
}
