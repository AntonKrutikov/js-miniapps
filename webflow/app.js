import { Notepad } from './notepad.js'
import {WindowManager} from './window.js'
import {MusicPlayer} from './musicplayer.js'

window.addEventListener('load', e => {
    const wm = new WindowManager()
    wm.init()

    const notepad = new Notepad('.ui_window_notepad')

    const musicplayer = new MusicPlayer('.ui_window_music')
})