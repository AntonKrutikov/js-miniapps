import { Window } from "./window.js"
import { Wordpad } from "./wordpad.js"
import { MusicPlayer} from "./musicplayer.js"

let wordpad_ico = document.querySelector('.ui_icon.ui_icon__wordpad')
wordpad_ico.addEventListener('dblclick', e => {
    let wordpad = new Window(new Wordpad(), {width: 300, height: 300, title: 'Wordpad', cssClass: 'wordpad-app'})
    wordpad.show()
})

let musicplayer = new Window(new MusicPlayer(), {width: 300, height: 300, title: 'Music Player', cssClass: 'musicplayer-app', disable_maximize: true})
musicplayer.show()