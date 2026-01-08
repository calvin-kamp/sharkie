import type { Difficulty } from '@models/level.model'

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
