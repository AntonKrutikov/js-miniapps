import { Window } from "./window.js"
import { Wordpad } from "./wordpad.js"

let wordpad_ico = document.querySelector('.ui_icon.ui_icon__wordpad')
wordpad_ico.addEventListener('dblclick', e => {
    let wordpad = new Window(new Wordpad(), {width: 300, height: 300, title: 'Wordpad', cssClass: 'wordpad-app'})
    wordpad.show()
})
