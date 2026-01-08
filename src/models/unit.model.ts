import { MovableObject, type MovableObjectConfig } from '@models/movable-object.model'

export type CombatConfig = {
    maxHp?: number
    hp?: number
    damage?: number
}

export interface UnitConfig extends MovableObjectConfig {
    combat?: CombatConfig
}

export class Unit extends MovableObject {
    baseMaxHp: number
    baseDamage: number

    maxHp: number
    hp: number
    damage: number

    constructor(config: UnitConfig) {
        super(config)

        this.baseMaxHp = config.combat?.maxHp ?? 100
        this.baseDamage = config.combat?.damage ?? 10

        this.maxHp = this.baseMaxHp
        this.damage = this.baseDamage

        const initialHp = config.combat?.hp
        this.hp = typeof initialHp === 'number' ? Math.min(this.maxHp, Math.max(0, initialHp)) : this.maxHp
    }

    get isDead() {
        return this.hp <= 0
    }

    setBaseCombat(combat: CombatConfig) {
        if (typeof combat.maxHp === 'number') {
            this.baseMaxHp = combat.maxHp
        }

        if (typeof combat.damage === 'number') {
            this.baseDamage = combat.damage
        }

        this.maxHp = this.baseMaxHp
        this.damage = this.baseDamage
        this.hp = this.maxHp
    }

    applyCombatMultipliers(hpMul: number, dmgMul: number) {
        const ratio = this.maxHp > 0 ? this.hp / this.maxHp : 1

        this.maxHp = Math.max(1, Math.round(this.baseMaxHp * hpMul))
        this.damage = Math.max(0, Math.round(this.baseDamage * dmgMul))

        this.hp = Math.max(0, Math.min(this.maxHp, Math.round(this.maxHp * ratio)))
    }

    takeDamage(amount: number) {
        if (this.isDead) {
            return
        }

        this.hp = Math.max(0, this.hp - Math.max(0, amount))
    }

    heal(amount: number) {
        if (this.isDead) {
            return
        }
        
        this.hp = Math.min(this.maxHp, this.hp + Math.max(0, amount))
    }
}
