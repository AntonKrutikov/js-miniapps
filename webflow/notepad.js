export class Notepad {
    constructor(selector) {
        this.container = document.querySelector(selector)

        this.createTextarea()
    }

    createTextarea() {
        const section = this.container.querySelector('.wf-section')
        this.textarea = document.createElement('textarea')
        this.textarea.classList.add('notepad-app-textarea')

        if (section) document.replaceChild(this.textarea, section)
    }
}