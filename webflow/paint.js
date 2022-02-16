export class Paint {
    constructor(selector) {
        this.container = document.querySelector('.ui_window_paint')
        this.currentTool = undefined
        this.prev_x = 0
        this.prev_y = 0
        this.cur_x = 0
        this.cur_y = 0
        this.draw_start = false

        this.colorFirst = '#000'
        this.colorSecond = '#fff'

        this.colors = {}

        this.config = {
            pencilSize: 1,
            eraserSize: 8,
            font: '14px "Ms sans serif 8pt"',
            lineHeight: 16
        }

        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false;

        const canvasTarget = this.container?.querySelector('.paint-atboard')
        canvasTarget.replaceWith(this.canvas)

        // Offscreen canvas (need for transformations)
        this.offscreenCanvas = document.createElement('canvas')
        this.offscreenCanvasCtx = this.offscreenCanvas.getContext('2d')
        this.offscreenCanvas.imageSmoothingEnabled = false;

        // Buttons
        this.buttons = {}
        this.buttons.Pencil = this.container.querySelector('.button-toolbar-pencil')
        this.buttons.Pot = this.container.querySelector('.button-toolbar-pot')
        this.buttons.Eraser = this.container.querySelector('.button-toolbar-eraser')
        this.buttons.Text = this.container.querySelector('.button-toolbar-text')
        this.buttons.Rotate = this.container.querySelector('.button-toolbar-rotate')
        this.buttons.Spin = this.container.querySelector('.button-toolbar-spin')



        this.canvasSetSize(640, 480)
        this.canvasInit()
        this.assignMenu()
        this.buttonControls()
        this.colorControls()
        this.textControls()

    }

    buttonControls() {
        Object.values(this.buttons).forEach(btn => {
            btn.setAttribute('draggable', 'false')
            btn.style.userSelect = 'none'
            btn.addEventListener('mousedown', e => { btn.classList.add('button-pushed') })
            btn.addEventListener('mouseleave', e => { btn.classList.remove('button-pushed') })
            document.addEventListener('mouseup', e => { btn.classList.remove('button-pushed') })
        })

        this.buttons.Pencil?.addEventListener('click', e => {
            this.resetTool()
            this.canvas.classList.add('cursor-pencil')
            this.currentTool = 'pencil'
            this.ctx.lineWidth = this.config.pencilSize
        })

        this.buttons.Pot?.addEventListener('click', e => {
            this.resetTool()
            this.canvas.classList.add('cursor-pot')
            this.currentTool = 'pot'
        })

        this.buttons.Eraser?.addEventListener('click', e => {
            this.resetTool()
            this.canvas.classList.add('cursor-eraser')
            this.currentTool = 'eraser'
            this.ctx.lineWidth = this.config.eraserSize
        })

        this.buttons.Text?.addEventListener('click', e => {
            this.resetTool()
            this.textOverlay.classList.add('cursor-text')
            this.currentTool = 'text'
            this.textOverlay.style.pointerEvents = 'all'
        })

        this.buttons.Rotate?.addEventListener('click', e => {
            this.rotate()
        })

        this.buttons.Spin?.addEventListener('click', e => {
            this.spin()
        })

    }

    rotate() {
        const temp = this.offscreenCanvas
        const tempCtx = this.offscreenCanvasCtx
        tempCtx.save()

        const rect = this.canvas.getBoundingClientRect()
        const w = rect.width
        const h = rect.height
        temp.width = this.canvas.height
        temp.height = this.canvas.width
        tempCtx.translate(temp.width / 2, temp.height / 2)
        tempCtx.rotate(Math.PI / 2)
        tempCtx.translate(-temp.height / 2, -temp.width / 2)

        tempCtx.drawImage(this.canvas, 0, 0)

        this.canvasSetSize(h, w)
        this.ctx.save()
        this.ctx.scale(1 / this.ratio, 1 / this.ratio)
        this.ctx.drawImage(temp, 0, 0)
        this.ctx.restore()

        tempCtx.restore()
    }

    spin() {
        const temp = this.offscreenCanvas
        const tempCtx = this.offscreenCanvasCtx
        tempCtx.save()

        temp.width = this.canvas.height * this.ratio
        temp.height = this.canvas.width * this.ratio
        tempCtx.drawImage(this.canvas, 0, 0)

        this.erase()
        this.ctx.save()
        this.ctx.scale(1 / this.ratio, 1 / this.ratio)
        this.ctx.translate(this.canvas.width, 0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(temp, 0, 0)
        this.ctx.restore()

        tempCtx.restore()
    }

    colorControls() {
        this.colors.currentFirst = document.querySelector('.current-colors .color-selection1')
        this.colors.currentSecond = document.querySelector('.current-colors .color-selection2')
        const currentColors = document.querySelector('.current-colors')
        currentColors.addEventListener('click', e => {
            const first = window.getComputedStyle(this.colors.currentFirst).backgroundColor
            const second = window.getComputedStyle(this.colors.currentSecond).backgroundColor
            this.setFirstColor(second)
            this.setSecondColor(first)
        })

        this.colors.pallete = document.querySelector('.color-pallete')
        this.colors.pallete?.querySelectorAll('div').forEach(c => {
            const color = window.getComputedStyle(c).backgroundColor
            c.addEventListener('click', e => {
                this.setFirstColor(color)
            })
            c.addEventListener('contextmenu', e => {
                e.preventDefault()
                this.setSecondColor(color)
            })
        })
    }

    setFirstColor(color) {
        this.colors.currentFirst.style.backgroundColor = color
        this.colorFirst = color
    }

    setSecondColor(color) {
        this.colors.currentSecond.style.backgroundColor = color
        this.colorSecond = color
    }


    textControls() {
        // text pseudo area
        this.textOverlay = document.createElement('div')
        this.textOverlay.classList.add('text-overlay')
        this.canvas.parentElement?.appendChild(this.textOverlay)
        this.textOverlay.style.width = this.canvas.style.width
        this.textOverlay.style.height = this.canvas.style.height

        let inside = false
        this.textOverlay.addEventListener('click', e => {
            if (inside) {
                inside = false
                return
            }
            let bounds = this.textOverlay.getBoundingClientRect();
            const text = document.createElement('textarea')
            text.wrap = 'off'

            text.classList.add('text-block')
            text.style.font = this.config.font
            text.style.lineHeight = this.config.lineHeight + 'px'
            text.style.height = this.config.lineHeight + 5 + 'px'
            text.style.width = 20 + 'px'
            text.style.color = this.colorFirst


            const y = e.pageY - bounds.top
            const x = e.pageX - bounds.left
            text.style.top = `${y - this.config.lineHeight/2}px`
            text.style.left = `${x}px`
            text.addEventListener('click', te => {
                te.stopPropagation()
                inside = true
            })
            text.addEventListener('blur', be => {
                this.fillTextMultiLine(text.value, x + 1, y + this.config.lineHeight/2 - 2.5)
                text.remove()
            })
            text.addEventListener('input', ie => {
                text.style.height = this.config.lineHeight + 'px'
                text.style.height = text.scrollHeight + 5 + 'px'
                text.style.width = 5 + 'px'
                text.style.width = text.scrollWidth + 5 + 'px'
            })
            this.textOverlay.appendChild(text)
            text.focus()
            inside = true
        })

    }

    fillTextMultiLine(text, x, y) {
        this.ctx.save()
        this.ctx.font = this.config.font
        this.ctx.fillStyle = this.colorFirst
        var lineHeight = this.config.lineHeight;
        var lines = text.split("\n");
        for (var i = 0; i < lines.length; ++i) {
            this.ctx.fillText(lines[i], x, y);
            y += lineHeight;
        }
        this.ctx.restore()
    }

    resetTool() {
        this.canvas.classList.remove('cursor-pot', 'cursor-pencil', 'cursor-eraser', 'cursor-text')
        this.textOverlay.style.pointerEvents = null
    }

    assignMenu() {
        const menu = this.container.querySelector('.ui_menu_paint')

        menu?.querySelectorAll('.ui_menu_file_row').forEach(a => {
            a.setAttribute('draggable', 'false')
        })

        const newFile = menu?.querySelector('.ui_menu_new')
        const saveFile = menu?.querySelector('.ui_menu_save')
        const saveFileAs = menu?.querySelector('.ui_menu_save_as')
        const quit = menu?.querySelector('.ui_menu_quit')
        const all = [newFile, saveFile, saveFileAs, quit]
        all.forEach(m => {
            m?.addEventListener('click', e => {
                e.preventDefault()
                menu?.parentElement?.dispatchEvent(new Event('w-close'))
            })
        })

        newFile?.addEventListener('click', e => {
            this.erase()
        })

        saveFile?.addEventListener('click', e => { this.save() })
        saveFileAs?.addEventListener('click', e => { this.save() })
        quit?.addEventListener('click', e => { this.close() })
    }

    canvasSetSize(w, h, canvas = this.canvas, scale = true) {
        const dpr = window.devicePixelRatio || 1
        this.ratio = dpr
        canvas.width = w * this.ratio
        canvas.height = h * this.ratio
        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
        const ctx = canvas.getContext('2d')
        if (scale) {
            this.scale = dpr
            ctx.scale(dpr, dpr)
        }
    }

    canvasInit() {
        this.erase()

        this.canvas.addEventListener('click', e => {
            if(this.currentTool === 'pot') {
   
            }
        })
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.currentTool === 'pencil' || this.currentTool === 'eraser') {
                this.draw_start = true
                this.ctx.beginPath()
            }
            if (this.currentTool === 'pencil') {
                this.ctx.strokeStyle = this.colorFirst
            }
            if (this.currentTool === 'eraser') {
                this.ctx.strokeStyle = this.colorSecond
            }
        })
        document.addEventListener('mouseup', e => {
            this.draw_start = false
        })

        this.canvas.addEventListener('mousemove', (e) => {
            let bounds = this.canvas.getBoundingClientRect();
            this.prev_x = this.cur_x
            this.prev_y = this.cur_y
            this.cur_x = e.pageX - bounds.left
            this.cur_y = e.pageY - bounds.top

            if (this.draw_start === true) {
                this.ctx.lineTo(this.cur_x, this.cur_y)
                this.ctx.stroke()
            }
        })
    }


    erase() {
        this.ctx.save()
        this.ctx.fillStyle = '#fff'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore()
    }

    save() {
        const data = this.canvas.toDataURL("image/jpeg", 1.0);
        const a = document.createElement('a');
        a.href = data;
        a.download = 'draw.jpeg';
        a.click();
    }

    close() {
        this.container.style.display = 'none'
        this.container.classList.remove('maximized')
        const appPanel = document.querySelector('.content-active-apps .active-app-paint')
        if (appPanel) appPanel.style.display = 'none'
    }
}