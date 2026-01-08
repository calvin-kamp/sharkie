export interface CombatConfig {
    maxHp?: number
    hp?: number
    damage?: number
}

export interface CombatStats {
    baseMaxHp: number
    baseDamage: number
    maxHp: number
    hp: number
    damage: number
}

export const applyCombatMultipliers = (target: CombatStats, hpMul: number, dmgMul: number) => {
    const ratio = target.maxHp > 0 ? target.hp / target.maxHp : 1

    target.maxHp = Math.max(1, Math.round(target.baseMaxHp * hpMul))
    target.damage = Math.max(0, Math.round(target.baseDamage * dmgMul))

    target.hp = Math.max(0, Math.min(target.maxHp, Math.round(target.maxHp * ratio)))
}
