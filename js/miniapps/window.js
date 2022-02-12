export class Window {
    static last_zindex = 500

    // content is HTMLElement
    constructor(content, config = { width: 'auto', height: 'auto', title: '', target: undefined, disable_maximize: false }, close_callback) {
        content.window = this
        this.config = config
        this.close_callback = close_callback
        // window itself


        // append content
        this.inner = document.createElement('div')
        this.inner.classList.add('window-inner')
        this.inner.appendChild(content.container)

        // state
        this.state = {
            x: 0,
            y: 0,
            x_diff: 0,
            y_diff: 0,
            is_dragging: false,
            maximized: false
        }



    }

    stretch() {
        if (!this.config.disable_maximize) {
            if (this.state.maximized === false) {
                this.container.classList.add('maximized')
                this.state.maximized = true
            } else {
                this.container.classList.remove('maximized')
                this.state.maximized = false
            }
        }
    }

    clampX(n) {
        const rect = this.container.getBoundingClientRect()
        return Math.min(Math.max(n, 0), window.innerWidth - rect.width)
    }

    clampY(n) {
        const rect = this.container.getBoundingClientRect()
        return Math.min(Math.max(n, 0), window.innerHeight - rect.height);
    }

    render() {
        this.container.style.left = `${this.state.x}px`
        this.container.style.top = `${this.state.y}px`
        // this.container.style.transform = 'translate(' + this.state.x + 'px, ' + this.state.y + 'px)';
    }

    init() {
        // events
        this.bar.addEventListener('mousedown', (e) => {
            if (this.state.maximized === false) {
                this.state.is_dragging = true
                this.state.x_diff = e.pageX - this.state.x
                this.state.y_diff = e.pageY - this.state.y
                this.container.style.zIndex = Window.last_zindex++
            }
        })
        document.addEventListener('mouseleave', e => {
            this.state.is_dragging = false
        })

        let buttons = [this.minimize, this.maximize, this.close_button]
        buttons.forEach(b => {
            b.addEventListener('mousedown', e => {
                e.stopPropagation()
                b.classList.add('window-button-pushed')
            })
            b.addEventListener('mouseup', e => {
                b.classList.remove('window-button-pushed')
            })
            b.addEventListener('dblclick', e => {
                e.stopPropagation()
            })
        })

        this.maximize.addEventListener('click', e => {
            this.stretch()
        })

        this.bar.addEventListener('dblclick', e => {
            this.stretch()
        })

        document.addEventListener('mouseup', (e) => {
            this.state.is_dragging = false
        })

        document.addEventListener('mousemove', (e) => {
            if (this.state.is_dragging === true) {
                this.state.x = this.clampX(e.pageX - this.state.x_diff)
                this.state.y = this.clampY(e.pageY - this.state.y_diff)
                this.render()
            }
        })
        this.close_button.addEventListener('click', (e) => {
            this.close()
        })
    }

    show() {
        this.container = document.querySelector(this.config.target)
        this.bar = this.container.querySelector('.head-ui-window')
        this.minimize = this.bar.querySelector('.ui_window__head__minimize')
        this.maximize = this.bar.querySelector('.ui_window__head__maximize')
        this.close_button = this.bar.querySelector('.ui_window__head__close')

        this.init()

        this.container.querySelectorAll(':scope > :not(.head-ui-window)').forEach(el => {
            this.container.removeChild(el)
        })

        this.container.appendChild(this.inner)
        this.render()
    }

    close() {
        // document.body.removeChild(this.container)
        // this.state = {
        //     x: 0,
        //     y: 0,
        //     x_diff: 0,
        //     y_diff: 0,
        //     is_dragging: false
        // }
        if (this.close_callback) this.close_callback()
    }
}