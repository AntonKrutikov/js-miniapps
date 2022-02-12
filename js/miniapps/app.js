import { Window } from "./window.js"
import { Wordpad } from "./wordpad.js"
import { MusicPlayer} from "./musicplayer.js"

// Wordpad init
// let wordpad_ico = document.querySelector('.ui_icon.ui_icon__wordpad')
// wordpad_ico.addEventListener('dblclick', e => {
    let wordpad = new Window(new Wordpad(), {target: '.ui-window.ui_window_notepad'})
    wordpad.show()
// })

// // Player init
// let playlist = {
//     artist: 'Peacemaker OST',
//     tracks: [
//         {
//             name: 'Do Ya Wanna Taste It',
//             src: '/mp3/Wig_Wam_-_Do_Ya_Wanna_Taste_It_(musmore.com).mp3'
//         },
//         {
//             name: 'Welcome To The Church Of Rock And Roll',
//             src: '/mp3/foxy_shazam_welcome_to_the_church_of_rock_and_roll_(NaitiMP3.ru).mp3'
//         },
//         {
//             name: 'I Don\'t Love You Anymore',
//             src: '/mp3/The_Quireboys_-_I_Dont_Love_You_Anymore_(musmore.com).mp3'
//         }
//     ]
// }
// let musicplayer_ico = document.querySelector('.ui_icon.ui_icon__music-player')
// let musicplayer_instance = undefined
// musicplayer_ico.addEventListener('dblclick', e => {
//     if (!musicplayer_instance) {
//         let player = new MusicPlayer(playlist)
//         musicplayer_instance = new Window(player, {title: 'Music Player', cssClass: 'musicplayer-app', disable_maximize: true}, () => {
//             musicplayer_instance = undefined
//         })
//         musicplayer_instance.show()
//     }
// })
