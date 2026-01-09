type MobileKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'q' | 'e'

type KeyMeta = { key: string; code: string }

const KEY_META: Record<MobileKey, KeyMeta> = {
    ArrowUp: { key: 'ArrowUp', code: 'ArrowUp' },
    ArrowDown: { key: 'ArrowDown', code: 'ArrowDown' },
    ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft' },
    ArrowRight: { key: 'ArrowRight', code: 'ArrowRight' },
    q: { key: 'q', code: 'KeyQ' },
    e: { key: 'e', code: 'KeyE' },
}

const isTouchLike = () => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
            return true
        }
    }
    return (navigator.maxTouchPoints ?? 0) > 0
}

export class MobileControls {
    private root: HTMLElement
    private enabled = false
    private activePointerByKey = new Map<MobileKey, number>()

    constructor(root: HTMLElement) {
        this.root = root
        this.enabled = isTouchLike()
        this.hide()
        this.bind()
    }

    show() {
        if (!this.enabled) {
            return
        }

        this.root.classList.remove('is-hidden')
    }

    hide() {
        this.releaseAll()
        this.root.classList.add('is-hidden')
    }

    releaseAll() {
        for (const key of this.activePointerByKey.keys()) {
            this.dispatchKey('keyup', key)
        }
        this.activePointerByKey.clear()
    }

    private bind() {
        const buttons = Array.from(this.root.querySelectorAll<HTMLButtonElement>('button[data-key]'))

        for (const btn of buttons) {
            const key = btn.dataset.key as MobileKey | undefined
            if (!key || !(key in KEY_META)) continue

            btn.addEventListener('pointerdown', (e) => this.onPointerDown(e, key, btn), { passive: false })
            btn.addEventListener('pointerup', (e) => this.onPointerUp(e, key, btn), { passive: false })
            btn.addEventListener('pointercancel', (e) => this.onPointerUp(e, key, btn), { passive: false })
            btn.addEventListener('lostpointercapture', (e) => this.onPointerUp(e, key, btn), { passive: false })

            btn.addEventListener('contextmenu', (e) => e.preventDefault())
        }
    }

    private onPointerDown(e: PointerEvent, key: MobileKey, btn: HTMLButtonElement) {
        if (!this.enabled) {
            return
        }

        e.preventDefault()
        e.stopPropagation()

        if (this.activePointerByKey.has(key)) {
            return
        }

        this.activePointerByKey.set(key, e.pointerId)
        btn.setPointerCapture(e.pointerId)

        this.dispatchKey('keydown', key)
    }

    private onPointerUp(e: Event, key: MobileKey, btn: HTMLButtonElement) {
        if (!this.enabled) {
            return
        }

        e.preventDefault?.()
        e.stopPropagation?.()

        const activeId = this.activePointerByKey.get(key)
        const pointerId = (e as PointerEvent).pointerId

        if (typeof activeId === 'number' && typeof pointerId === 'number' && activeId !== pointerId) {
            return
        }

        try {
            if (typeof (e as PointerEvent).pointerId === 'number') btn.releasePointerCapture((e as PointerEvent).pointerId)
        } catch {
            // ignore
        }

        if (this.activePointerByKey.has(key)) {
            this.activePointerByKey.delete(key)
            this.dispatchKey('keyup', key)
        }
    }

    private dispatchKey(type: 'keydown' | 'keyup', key: MobileKey) {
        const meta = KEY_META[key]
        const ev = new KeyboardEvent(type, {
            key: meta.key,
            code: meta.code,
            bubbles: true,
            cancelable: true,
            composed: true,
        })

        document.dispatchEvent(ev)
    }
}
