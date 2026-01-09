export type Rect = { x: number; y: number; width: number; height: number }
export type HitboxProvider = { getHitbox: () => Rect }

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export const padRect = (r: Rect, pad: number): Rect => ({
    x: r.x + pad,
    y: r.y + pad,
    width: Math.max(0, r.width - pad * 2),
    height: Math.max(0, r.height - pad * 2),
})

export const rectsIntersect = (a: Rect, b: Rect) =>
    a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

export const isColliding = (a: HitboxProvider, b: HitboxProvider, padding = 0) => {
    const ra = padRect(a.getHitbox(), padding)
    const rb = padRect(b.getHitbox(), padding)
    return rectsIntersect(ra, rb)
}
