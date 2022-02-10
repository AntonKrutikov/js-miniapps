export class FileMenu {
    constructor() {
        this.container = document.createElement('div')
        this.container.classList.add('wordpad-menu')

        this.new = document.createElement('div')
        this.new.innerText = 'New'
        this.container.appendChild(this.new)

        this.save = document.createElement('div')
        this.save.innerText = 'Save'
        this.container.appendChild(this.save)

        this.saveas = document.createElement('div')
        this.saveas.innerText = 'Save As...'
        this.container.appendChild(this.saveas)

        this.container.appendChild(document.createElement('hr'))

        this.openfile = document.createElement('div')
        this.openfile.innerText = 'Open File With...'
        this.openfile.classList.add('disabled')
        this.container.appendChild(this.openfile)

        this.openfolder = document.createElement('div')
        this.openfolder.innerText = 'Open Containing Folder'
        this.openfolder.classList.add('disabled')
        this.container.appendChild(this.openfolder)

        this.container.appendChild(document.createElement('hr'))

        this.quit = document.createElement('div')
        this.quit.innerText = 'Quit'
        this.container.appendChild(this.quit)

        this.state = {
            hidden: false
        }

        this.hide()
    }

    show() {
        this.container.style.display = null
        this.state.hidden = false
    }

    hide() {
        this.container.style.display = 'none'
        this.state.hidden = true
    }

    toggle() {
        this.state.hidden ? this.show() : this.hide()
    }
}