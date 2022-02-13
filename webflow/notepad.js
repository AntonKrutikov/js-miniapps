export class Notepad {
    constructor(selector) {
        this.container = document.querySelector(selector)

        this.createTextarea()
        this.assignMenu()
    }

    createTextarea() {
        const section = this.container.querySelector('.wf-section')
        this.textarea = document.createElement('textarea')
        this.textarea.classList.add('notepad-textarea')

        if (section) section.replaceWith(this.textarea)
    }

    assignMenu() {
        const newFile = this.container.querySelector('.ui_menu_new')
        const saveFile = this.container.querySelector('.ui_menu_save')
        const saveFileAs = this.container.querySelector('.ui_menu_save_as')
        const quit = this.container.querySelector('.ui_menu_quit')
        const menu = this.container.querySelector('.ui_menu_file.w-dropdown-list')
        const menuheader = this.container.querySelector('.ui_menu__item--opener.w-dropdown-toggle')
        const all = [newFile, saveFile, saveFileAs, quit]
        all.forEach(m => {
            m?.addEventListener('click', e => {
                e.preventDefault()
                menu?.classList.remove('w--open')
                menuheader?.setAttribute('aria-expanded', 'false')
                menuheader?.classList.remove('w--open')
            })
        })

        newFile?.addEventListener('click', e => {
            this.textarea.value = ''
        })

        saveFile?.addEventListener('click', e => { this.save() })
        saveFileAs?.addEventListener('click', e => { this.save() })
        quit?.addEventListener('click', e => { this.close()})
    }

    save() {
        let data = new Blob([this.textarea.value], { type: 'text/plain' })
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(data)
        a.download = 'document.txt'
        a.click()
    }

    close() {
        this.container.style.display = 'none'
        this.container.classList.remove('maximized')
    }
}