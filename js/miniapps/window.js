export class Window {
    static last_zindex = 500

    // content is HTMLElement
    constructor(content, config = { width: 'auto', height: 'auto', title: '', cssClass: undefined, disable_maximize: false}, close_callback) {
        content.window = this
        this.config = config
        this.close_callback = close_callback
        // window itself
        this.container = document.createElement('div')
        this.container.classList.add('window')
        if (config.cssClass) this.container.classList.add(config.cssClass)
        this.container.style.width = `${config.width}px`
        this.container.style.height = `${config.height}px`
        this.container.style.zIndex = Window.last_zindex++
        // window bar
        this.bar = document.createElement('div')
        this.bar.classList.add('window-bar')
        this.container.appendChild(this.bar)
        // window icon
        this.icon = document.createElement('div')
        this.icon.classList.add('window-icon')
        this.bar.appendChild(this.icon)
        // window title
        this.title = document.createElement('span')
        this.title.classList.add('window-title')
        this.title.innerText = config.title ? config.title : ''
        this.bar.appendChild(this.title)
        //window minimize
        this.minimize = document.createElement('div')
        this.minimize.classList.add('window-button', 'window-minimize')
        this.bar.appendChild(this.minimize)
        //window maximize
        this.maximize = document.createElement('div')
        this.maximize.classList.add('window-button', 'window-maximize')
        if (config.disable_maximize) this.maximize.classList.add('disabled')
        this.bar.appendChild(this.maximize)
        // window bar close button
        this.close_button = document.createElement('div')
        this.close_button.classList.add('window-button', 'window-close')
        this.bar.appendChild(this.close_button)

        // append content
        this.inner = document.createElement('div')
        this.inner.classList.add('window-inner')
        this.inner.appendChild(content.container)
        this.container.appendChild(this.inner)

        // state
        this.state = {
            x: 0,
            y: 0,
            x_diff: 0,
            y_diff: 0,
            is_dragging: false,
            prev_width: null,
            prev_height: null,
            prev_left: null,
            prev_top: null,
            maximized: false
        }

        // events
        this.bar.addEventListener('mousedown', (e) => {
            if (this.state.maximized === false) {
                this.state.is_dragging = true
                this.state.x_diff = e.pageX - this.state.x
                this.state.y_diff = e.pageY - this.state.y
                this.container.style.zIndex = Window.last_zindex++
            }
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

        this.bar.addEventListener('mouseup', (e) => {
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
        return Math.min(Math.max(n, 0), window.innerWidth)
    }

    clampY(n) {
        return Math.min(Math.max(n, 0), window.innerHeight);
    }

    render() {
        this.container.style.left = `${this.state.x}px`
        this.container.style.top = `${this.state.y}px`
        // this.container.style.transform = 'translate(' + this.state.x + 'px, ' + this.state.y + 'px)';
    }

    show() {
        let t = document.querySelector('.ui-window.ui_window_notepad')
        let header = t.querySelector('.head-ui-window')
        header.classList.add('window-bar')
        t.querySelectorAll(':scope > :not(.head-ui-window)').forEach(el => {
            console.log(el)
            t.removeChild(el)
        })
        t.classList.add('window')
        // let old_header = t.querySelector('.head-menu-window')
        // let old_body = t.querySelector('.ui_window__body')
        // t.removeChild(old_header)
        // t.removeChild(old_body)
        let inner = t.querySelector('.ui_window__body')

        t.appendChild(this.inner)
        this.render()
    }

    close() {
        document.body.removeChild(this.container)
        this.state = {
            x: 0,
            y: 0,
            x_diff: 0,
            y_diff: 0,
            is_dragging: false
        }
        if (this.close_callback) this.close_callback()
    }
}