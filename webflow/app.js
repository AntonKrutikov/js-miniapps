import { Notepad } from './notepad.js'
import {WindowManager} from './window.js'
import {MusicPlayer} from './musicplayer.js'

window.addEventListener('load', e => {
    const wm = new WindowManager()
    wm.init()

    const notepad = new Notepad('.ui_window_notepad')

    const playlist = {
        artist: 'Shadow Pals',
        tracks: [
            {src: '123', title: 'test track'}
        ]
    }
    const musicplayer = new MusicPlayer('.ui_window_music', playlist)
})