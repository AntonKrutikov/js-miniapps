import { FileMenu } from "./file-menu.js"

export class MusicPlayer {
    constructor () {
        this.container = document.createElement('div')
        this.container.classList.add('musicplayer')
        // menubar
        this.menubar = document.createElement('div')
        this.menubar.classList.add('window-menubar')
        this.container.appendChild(this.menubar)
        // menubar -> Song
        this.menubar_song = document.createElement('div')
        this.menubar_song.innerText = 'Song'
        this.menubar.appendChild(this.menubar_song)
        this.menu_song = new FileMenu()
        this.menu_song.new.classList.add('disabled')
        this.menu_song.save.classList.add('disabled')
        this.menu_song.saveas.classList.add('disabled')
        this.menubar_song.appendChild(this.menu_song.container)
        // menubar -> Help
        this.menubar_help = document.createElement('div')
        this.menubar_help.innerText = 'Help'
        this.menubar_help.classList.add('disabled')
        this.menubar.appendChild(this.menubar_help)
        // inner 
        this.inner = document.createElement('div')
        this.inner.classList.add('musicplayer-inner')
        this.container.appendChild(this.inner)
        // song position
        this.time_display = document.createElement('div')
        this.time_display.classList.add('musicplayer-time-display')
        this.time_display.innerText = '[00] 00:00'
        this.inner.appendChild(this.time_display)
        // navigation
        this.navigation = document.createElement('div')
        this.navigation.classList.add('musicplayer-navigation')
        this.inner.appendChild(this.navigation)
        // back
        this.navigation_back = document.createElement('div')
        this.navigation_back.classList.add('musicplayer-button', 'musicplayer-button-back')
        this.navigation_back.appendChild(document.createElement('img'))
        this.navigation.appendChild(this.navigation_back)
        // play
        this.navigation_play = document.createElement('div')
        this.navigation_play.classList.add('musicplayer-button', 'musicplayer-button-play')
        this.navigation_play.appendChild(document.createElement('img'))
        this.navigation.appendChild(this.navigation_play)
        // next
        this.navigation_next = document.createElement('div')
        this.navigation_next.classList.add('musicplayer-button', 'musicplayer-button-next')
        this.navigation_next.appendChild(document.createElement('img'))
        this.navigation.appendChild(this.navigation_next)
        // pause
        this.navigation_pause = document.createElement('div')
        this.navigation_pause.classList.add('musicplayer-button', 'musicplayer-button-pause')
        this.navigation_pause.appendChild(document.createElement('img'))
        this.navigation.appendChild(this.navigation_pause)
        // stop
        this.navigation_stop = document.createElement('div')
        this.navigation_stop.classList.add('musicplayer-button', 'musicplayer-button-stop')
        this.navigation_stop.appendChild(document.createElement('img'))
        this.navigation.appendChild(this.navigation_stop)
        // volume
        this.volume_control = document.createElement('input')
        this.volume_control.type = 'range'
        this.volume_control.classList.add('musicplayer-volume')
        this.inner.appendChild(this.volume_control)
        // artist row
        this.artist_row = document.createElement('div')
        this.artist_row.classList.add('musicplayer-row', 'musicplayer-artist-row')
        this.inner.appendChild(this.artist_row)
        this.artist_row_name = document.createElement('div')
        this.artist_row_name.classList.add('musicplayer-row-name')
        this.artist_row_name.innerText = 'Artist'
        this.artist_row.appendChild(this.artist_row_name)
        this.artist_row_data = document.createElement('div')
        this.artist_row_data.classList.add('musicplayer-row-data', 'musicplayer-artist-row-data')
        this.artist_row.appendChild(this.artist_row_data)
        this.artist_row_data_title = document.createElement('span')
        this.artist_row_data_title.classList.add('musicplayer-row-data-title')
        this.artist_row_data_title.innerText = 'Shadow Pals'
        this.artist_row_data.appendChild(this.artist_row_data_title)
        this.artist_row_data_index = document.createElement('span')
        this.artist_row_data_index.innerText = '<01>'
        this.artist_row_data_index.classList.add('musicplayer-row-data-index')
        this.artist_row_data.appendChild(this.artist_row_data_index)
        this.artist_row_data_arrow = document.createElement('div')
        this.artist_row_data_arrow.classList.add('musicplayer-button','musicplayer-row-data-arrow')
        this.artist_row_data.appendChild(this.artist_row_data_arrow)

        //events
        this.menubar_song.addEventListener('click', e => {
            this.menu_song.toggle()
        })

        this.container.addEventListener('click', e => {
            if (e.target != this.menu_song && e.target != this.menubar_song) {
                this.menu_song.hide()
            }
        })

        let buttons = [this.navigation_back, this.navigation_play, this.navigation_next, this.navigation_pause, this.navigation_stop, this.artist_row_data_arrow]
        buttons.forEach(b => {
            b.addEventListener('mousedown', e => {
                b.classList.add('window-button-pushed')
            })
            b.addEventListener('mouseup', e => {
                b.classList.remove('window-button-pushed')
            })
            b.addEventListener('mouseleave', e => {
                b.classList.remove('window-button-pushed')
            })
        })

        this.menu_song.quit.addEventListener('click', e => {
            this.close()
        })

    }

    close() {
        this.window.close()
    }

}