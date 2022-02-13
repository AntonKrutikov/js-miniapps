import { Notepad } from './notepad.js'
import {WindowManager} from './window.js'

window.addEventListener('load', e => {
    const wm = new WindowManager()
    wm.init()

    const notepad = new Notepad('.ui_window_notepad')
})