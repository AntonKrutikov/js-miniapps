import {WindowManager} from './window.js'

window.addEventListener('load', e => {
    const wm = new WindowManager()
    wm.init()
})