# TypeScript Documentation Guide

This document outlines the TSDoc (TypeScript JSDoc) standards used throughout the Sharkie project.

## Class Documentation

```typescript
/**
 * Brief description of the class.
 * 
 * @example
 * const instance = new MyClass(config)
 * instance.method()
 */
export class MyClass {
}
```

## Property Documentation

```typescript
/**
 * Description of what this property represents.
 * @default 0
 */
private myProperty: number = 0
```

## Method Documentation

```typescript
/**
 * Brief description of what the method does.
 * 
 * @param paramName - Description of the parameter
 * @returns Description of the return value
 * @throws Error description if applicable
 */
method(paramName: string): string {
}
```

## Common Patterns in Sharkie

### Game Objects
- All game entities extend `DrawableObject` or `MovableObject`
- Document properties like `x`, `y`, `width`, `height`, `hp`, `damage`
- Document animation/state management methods

### Collision & Physics
- Hitbox properties: `offsetX`, `offsetY`, `width`, `height`
- Movement methods should document speed/direction changes
- Collision callbacks should note they execute during update loops

### Animation Systems
- Document FPS (frames per second) constants
- Note whether animations loop or play once
- Document animation completion callbacks

### State Management
- Document state transitions (e.g., 'swim' → 'hurt' → 'dead')
- Explain preconditions for state changes
- Document cooldown/throttle mechanisms

## Files Documented

### Models (`src/models/`)
- `player.model.ts` - Main player character
- `enemy.model.ts` - Enemy creatures (pufferfish, jellyfish)
- `boss.model.ts` - Boss encounter
- `world.model.ts` - Game world/scene management
- `collision-manager.model.ts` - Collision detection
- `projectile-manager.model.ts` - Projectile handling
- `collectible-manager.model.ts` - Coins/power-ups
- And more...

### Utilities (`src/utils/`)
- `geometry.ts` - Collision detection helpers
- `helper.ts` - General utilities
- `assets.ts` - Asset path constants
- `projectile-factory.ts` - Projectile creation
- And more...

### Levels (`src/levels/`)
- `level.ts` - Level layout and configuration
