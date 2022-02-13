export class Notepad {
    constructor(selector) {
        this.container = document.querySelector(selector)

        this.createTextarea()
    }

    createTextarea() {
        const section = this.container.querySelector('.wf-section')
        if (section) this.container.removeChild(section)
    }
}