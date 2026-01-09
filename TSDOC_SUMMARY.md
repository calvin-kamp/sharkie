# Sharkie - TypeScript Documentation Summary

## Overview
Sharkie is a 2D underwater action game featuring player-controlled shark with combat, collectibles, and boss battles.

---

## Core Models (`src/models/`)

### Player (`player.model.ts`)
Main playable character that extends `MovableObject`.

**Key Properties:**
- `hp`, `maxHp` - Health system
- `coins`, `poisonBottles` - Collectibles
- `damage`, `baseDamage` - Combat stats

**Key Methods:**
- `takeDamage(amount, variant)` - Apply damage to player with 1s cooldown
- `setBaseCombat(config)` - Configure combat stats
- `attackFinSlap()` / `attackBubbleTrap()` - Attack animations
- `isMoving()` - Check if player is moving
- `setState(state, variant)` - Change animation state

**States:** `swim`, `idle`, `idleLong`, `hurt`, `attack`, `dead`

---

### Enemy (`enemy.model.ts`)
Base class for all hostile entities (pufferfish, jellyfish, boss).

**Properties:**
- `type` - 'pufferfish', 'jellyfish', or 'boss'
- `hp`, `maxHp`, `damage` - Combat stats
- `state` - Current animation state

**Key Methods:**
- `takeDamage(amount)` - Reduce enemy health; triggers animations
- `freeze()` / `unfreeze()` - Pause movement/animation
- `setBaseCombat(options)` - Configure combat stats
- `getType()` - Return enemy type

**Pufferfish:** Bloats and changes hitbox at 50% HP
**Jellyfish:** Move vertically with constant hitbox
**Boss:** Special case, see `boss.model.ts`

---

### Boss (`boss.model.ts`)
Special enemy that extends `MovableObject` with intro sequence and chase mechanics.

**Key Properties:**
- `hp`, `maxHp`, `damage` - Combat stats
- `introduced`, `introducing`, `attacking` - State flags

**Key Methods:**
- `playAttackOnce(onDone)` - Play attack with 1s cooldown
- `playHurtOnce()` - Play hurt animation
- `playIntroduceOnce(onDone)` - Intro sequence
- `startIntroSequence(player, viewRight, worldLeft, ...)` - Begin intro
- `chasePlayer(player, dtMs, worldLeft, worldRight, canvasHeight)` - Chase logic
- `takeDamage(amount)` - Apply damage

**Testings Mode:**
- `movementDisabledForHitboxTesting = true` stops all boss movement and animations

---

### World (`world.model.ts`)
Game scene manager handling all entities, collisions, and updates.

**Key Properties:**
- `player`, `enemies`, `boss` - Game entities
- `canvasWidth`, `canvasHeight` - Screen dimensions
- `worldLeft`, `worldRight` - Map boundaries
- `isFrozen`, `isPaused` - Game state

**Key Methods:**
- `addProjectile(projectile)` - Fire projectiles
- `setCameraOffset(offset)` - Pan camera
- `setPaused(paused)` - Pause/resume game
- `update(dtMs)` - Main game loop (handle collisions, enemy AI, HUD, etc.)

---

### CollisionManager (`collision-manager.model.ts`)
Handles collision detection between player and enemies/boss.

**Key Methods:**
- `update(player, enemies, boss, bossVisible, onEnemyCollision, onBossCollision)` - Check all collisions
- `setBossCollisionGrace(graceMs)` - Temporary immunity after boss intro
- `isCollidingWithEnemy(enemy)` - Get collision status for specific enemy
- `isCollidingWithBoss()` - Get boss collision status

---

### ProjectileManager (`projectile-manager.model.ts`)
Manages all projectiles (player bubbles) and collision with enemies.

**Key Methods:**
- `add(projectile)` - Create new projectile
- `update(dtMs, enemies, boss, bossVisible)` - Update positions, check hits

---

### CollectibleManager (`collectible-manager.model.ts`)
Handles coins and poison bottles pickup.

**Key Methods:**
- `update(player)` - Check pickups, apply to player inventory

---

### Camera (`camera.model.ts`)
Viewport and scroll management.

**Key Methods:**
- `setOffset(offset)` - Pan camera
- `syncToPlayer(playerX, playerWidth)` - Track player
- `getViewBounds()` - Get current viewport

---

### StatusBar & HudCounter (`status-bar.model.ts`, `hud-counter.model.ts`)
HUD elements for health, coins, and poison display.

**StatusBar:**
- Displays player HP with 6 fill levels (0%, 20%, 40%, 60%, 80%, 100%)

**HudCounter:**
- Displays coin/poison count with animated icons

---

## Utilities (`src/utils/`)

### Geometry (`geometry.ts`)
Collision detection utilities.

**Types:**
- `Rect` - Bounding box `{ x, y, width, height }`
- `HitboxProvider` - Interface for objects with `getHitbox()` method

**Functions:**
- `clamp(value, min, max)` - Constrain number to range
- `padRect(rect, pad)` - Shrink rectangle by padding
- `rectsIntersect(a, b)` - AABB collision check
- `isColliding(a, b, padding)` - Check if two hitbox-providing objects collide

### Helper (`helper.ts`)
General utilities.

**Functions:**
- `getRandomNumber(min, max)` - Generate random integer

### Assets (`assets.ts`)
Asset path constants for sprites, sounds, fonts.

### ProjectileFactory (`projectile-factory.ts`)
Creates and configures projectiles (player bubbles).

---

## Levels (`src/levels/`)

### Level (`level.ts`)
Constructs the game level with enemies, boss, collectibles, HUD.

**Key Function:**
- `createLevel(difficulty)` - Create level with difficulty settings

**Difficulties:** `easy`, `medium`, `hard`, `impossible`

---

## Key Game Loop Flow

1. **Input** → Player movement/attack keys
2. **Update** (`world.update(dtMs)`)
   - Enemy movement & animation
   - Boss chase logic
   - Player state/animation
   - Camera tracking
   - Collision checks → damage application
   - Projectile movement & hits
   - Collectible pickups
   - HUD updates
   - End-game checks
3. **Render** → Draw all entities to canvas

---

## Important Constants & Config

### Player
- Movement: 8px/frame horizontal, 5px/frame vertical
- Attack cooldown: 500ms
- Hurt cooldown: 1000ms
- Base HP: 20, Base damage: 1

### Boss
- Attack cooldown: 1000ms
- Hurt cooldown: 250ms
- Chase speed: 4px/frame (X), 3px/frame (Y)
- Spawn: 20% off-screen to the right

### Enemies
- Pufferfish: Bloats at 50% HP (changes hitbox)
- Jellyfish: Vertical movement
- Base animation FPS: 8

### HUD
- Health bar position: Top-left (x: 20, y: 20)
- Poison icon: Right of health bar with gap
- Coin icon: Right of poison icon with gap

---

## Adding New Features

### New Enemy Type
1. Add to `EnemyType` in `enemy.model.ts`
2. Add frame generation in `Enemy.generateFramesFor()`
3. Create spawn logic in `levels/level.ts`
4. Add AI logic in `startMovement()` or `Enemy` subclass

### New Collectible
1. Add type to `collectible.model.ts`
2. Create `CollectibleSpawner` or update `CollectibleManager`
3. Add pickup handling in `world.model.ts`

### New Attack Type
1. Add animation frames to assets
2. Create `AttackVariant` type in `player.model.ts`
3. Add attack method (e.g., `attackNewType()`)
4. Wire into input handlers

---

## Testing Notes

- Disable boss movement: Set `boss.movementDisabledForHitboxTesting = false` to `true`
- Disable enemy movement: Comment `this.startMovement()` in `enemy.model.ts` constructor
- Enemy spawns are centered on screen when movement disabled (for hitbox testing)

---

## Build & Deployment

- TypeScript compilation removes comments (tsconfig.json: `removeComments: true`)
- All game assets are in `public/game/`
- Entry point: `src/game.ts`
- Style entry: `src/styles/styles.scss`
