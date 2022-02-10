import {FileMenu} from './file-menu.js'

export class Wordpad {
    constructor() {
        this.container = document.createElement('div')
        this.container.classList.add('wordpad')
        // menubar
        this.menubar = document.createElement('div')
        this.menubar.classList.add('window-menubar')
        this.container.appendChild(this.menubar)
        // menubar -> file
        this.menubar_file = document.createElement('div')
        this.menubar_file.innerText = 'File'
        this.menubar.appendChild(this.menubar_file)
        this.menu_file = new FileMenu()
        this.menubar_file.appendChild(this.menu_file.container)
        // menubar -> help
        this.menubar_help = document.createElement('div')
        this.menubar_help.innerText = 'Help'
        this.menubar_help.classList.add('disabled')
        this.menubar.appendChild(this.menubar_help)
        // area
        this.area = document.createElement('textarea')
        this.area.classList.add('wordpad-area')
        this.container.appendChild(this.area)
        setTimeout(() => {
            this.area.focus()
        }, 300)
        // bottom bar
        this.bottom_bar = document.createElement('div')
        this.bottom_bar.classList.add('wordpad-bottom-bar')
        this.bottom_bar.innerText = 'text/plain'
        this.container.appendChild(this.bottom_bar)

        // events
        this.menubar_file.addEventListener('click', e => {
            this.menu_file.toggle()
        })

        this.container.addEventListener('click', e => {
            if (e.target != this.menu_file && e.target != this.menubar_file) {
                this.menu_file.hide()
            }
        })

        this.menu_file.quit.addEventListener('click', e => {
            this.window.close()
        })

        this.menu_file.save.addEventListener('click', e => {
            this.save()
        })

        this.menu_file.saveas.addEventListener('click', e => {
            this.save()
        })

        this.menu_file.new.addEventListener('click', e => {
            this.area.value = ''
        })

    }

    save() {
        let data = new Blob([this.area.value], {type: 'text/plain'})
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(data)
        a.download = 'document.txt'
        a.click()
    }
}

