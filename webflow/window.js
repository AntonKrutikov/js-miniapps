class WindowManager {
    static windows = []
    static zIndex = 100

    constructor(selector = '.ui-window') {
        this.selector = selector
    }

    init() {
        document.querySelectorAll(this.selector).forEach(w => {
           
            // Collect all windows from page and add state
            w.state = {}
            WindowManager.windows.push(w)

            // zIndexing
            this.zIndexing(w)
            // Draggable
            this.makeDragable(w)
        })
        console.log(WindowManager.windows)
    }

    zIndexing(w) {
        w?.addEventListener('mousedown', e => {
            w.style.zIndex = WindowManager.zIndex++
        })
    }

    clampX(n) {
        return Math.min(Math.max(n, 0), window.innerWidth)
    }

    clampY(n) {
        return Math.min(Math.max(n, 0), window.innerHeight);
    }

    makeDragable(w) {
        let head = w?.querySelector('.head-ui-window')

        head?.addEventListener('mousedown', e => {
            if (!w.state.maximized) {
                const rect = w.getBoundingClientRect()
                w.state.is_dragging = true
                w.state.x_diff = e.pageX - rect.left
                w.state.y_diff = e.pageY - rect.top
            }
        })

        document.addEventListener('mouseleave', e => { w.state.is_dragging = false })
        document.addEventListener('mouseup', e => { w.state.is_dragging = false })
        document.addEventListener('mousemove', e => {
            if (w.state.is_dragging === true) {
                w.style.left = `${this.clampX(e.pageX - w.state.x_diff, w)}px`
                w.style.top = `${this.clampY(e.pageY - w.state.y_diff, w)}px`
            }
        })

    }
}