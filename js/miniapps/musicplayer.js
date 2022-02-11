import { FileMenu } from "./file-menu.js"

export class MusicPlayer {
    constructor(playlist) {
        /* State */
        this.state = {
            current_track: 0,
            playlist: playlist,
            paused: true,
            total_duration: 0
        }

        /* Elements */
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
        this.artist_info = new Row('artist', 'Artist', playlist.artist, '01', true)
        this.inner.appendChild(this.artist_info.row)
        // current track row
        this.current_info = new Row('current', 'Title', playlist.tracks[0].name)
        this.inner.appendChild(this.current_info.row)
        // track list
        this.list_info = new Row('list', 'Track List', playlist.tracks[0].name, '01', true)
        this.inner.appendChild(this.list_info.row)
        this.list = new TrackList(playlist.tracks)
        this.list_info.data.appendChild(this.list.container)
        this.list.stickTo(this.list_info.data)
        // total play
        this.total_play = document.createElement('div')
        this.total_play.classList.add('musicplayer-bottom', 'musicplayer-bottom-left')
        this.total_play.innerText = 'Total Play: 00:00 m:s'
        this.inner.appendChild(this.total_play)
        // total play
        this.track_time = document.createElement('div')
        this.track_time.classList.add('musicplayer-bottom',  'musicplayer-bottom-right')
        this.track_time.innerText = 'Track: 00:00 m:s'
        this.inner.appendChild(this.track_time)
        //audio
        this.audio = document.createElement('audio')
        this.audio.controls = false
        this.container.appendChild(this.audio)
        this.audio.src = '/mp3/Wig_Wam_-_Do_Ya_Wanna_Taste_It_(musmore.com).mp3'
        this.audio.volume = this.volume_control.value / 100
        this.updateCurrentTime(0)
        this.measureTotalDuration()

        /* Events */

        this.menubar_song.addEventListener('click', e => {
            this.menu_song.toggle()
        })

        this.container.addEventListener('click', e => {
            if (e.target != this.menu_song && e.target != this.menubar_song) {
                this.menu_song.hide()
            }
        })

        let buttons = [this.navigation_back, this.navigation_play, this.navigation_next, this.navigation_pause, this.navigation_stop, this.artist_info.arrow, this.list_info.arrow]
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

        this.navigation_play.addEventListener('click', e => {
            this.audio.play()
            this.state.paused = false
        })

        this.navigation_pause.addEventListener('click', e => {
            this.audio.pause()
            this.state.paused = true
        })

        this.navigation_stop.addEventListener('click', e => {
            this.audio.pause()
            this.audio.currentTime = null
            this.state.paused = true
        })

        this.navigation_next.addEventListener('click', e => {
            this.nextTrack()
        })

        this.navigation_back.addEventListener('click', e => {
            this.prevTrack()
        })

        this.list_info.arrow.addEventListener('click', e => {
            this.list.toggle()
        })

        this.list.rows.forEach( r => {
            r.addEventListener('click', e => {
                
                let i = parseInt(r.dataset.position)
                this.setTrack(i)
            })
        })

        this.container.addEventListener('click', e => {
            if (e.target != this.list_info.arrow) this.list.hide()
        })

        this.audio.addEventListener('loadedmetadata', e => {
            this.updateDuration(this.audio.duration)
        })

        this.audio.addEventListener('timeupdate', e => {
            this.updateCurrentTime(this.audio.currentTime)
        })

        this.volume_control.addEventListener('input', e => {
            this.audio.volume = e.target.value / 100
        })

    }

    formatTime(sec) {
        sec = Math.floor( sec );
        let min = Math.floor( sec / 60 );
        min = min >= 10 ? min : '0' + min;
        sec = Math.floor( sec % 60 );
        sec = sec >= 10 ? sec : '0' + sec;
        return {min: min, sec: sec}
    }

    updateCurrentTime(sec) {
        let time = this.formatTime(sec)
        this.time_display.innerText = `[${(this.state.current_track + 1).toString().padStart(2,'0')}] ${time.min}:${time.sec}`
    }

    updateDuration(sec) {
        let time = this.formatTime(sec)
        this.track_time.innerText = `Track: ${time.min}:${time.sec} m:s`
    }

    updateTotalDuration(sec) {
        let time = this.formatTime(sec)
        this.total_play.innerText = `Total Play: ${time.min}:${time.sec} m:s`
    }

    updateCurrentTrack(name, position) {
        this.current_info.data.innerText = `${name}`
        this.list_info.title.innerText = `${name}`
        this.list_info.index.innerText = `<${(position + 1).toString().padStart(2, '0')}>`
    }

    nextTrack() {
        let current = this.state.current_track
        let playlist = this.state.playlist
        if (current + 1 < playlist.tracks.length) {
            let i = ++this.state.current_track
            this.audio.src = this.state.playlist.tracks[i].src
            this.updateCurrentTrack(this.state.playlist.tracks[i].name, i)
            if (!this.state.paused) {
                this.audio.play()
            }
        }
    }
    prevTrack() {
        let current = this.state.current_track
        if (current > 0) {
            let i = --this.state.current_track
            this.audio.src = this.state.playlist.tracks[i].src
            this.updateCurrentTrack(this.state.playlist.tracks[i].name, i)
            if (!this.state.paused) {
                this.audio.play()
            }
        }
    }

    setTrack(i) {
        if (i >= 0 && i < this.state.playlist.tracks.length) {
            this.state.current_track = i
            this.audio.src = this.state.playlist.tracks[i].src
            this.updateCurrentTrack(this.state.playlist.tracks[i].name, i)
            if (!this.state.paused) {
                this.audio.play()
            }
        }
    }

    measureTotalDuration() {
        this.state.playlist.tracks.forEach(t => {
            let temp = document.createElement('audio')
            temp.src = t.src
            temp.preload = 'metadata';
            temp.addEventListener('loadedmetadata', e => {
                this.state.total_duration += temp.duration
                this.updateTotalDuration(this.state.total_duration)
            })
        })
    }

    close() {
        this.window.close()
    }

}

class Row {
    constructor(cssPrefix, name, title, index, arrow) {
        this.row = document.createElement('div')
        this.row.classList.add('musicplayer-row', `musicplayer-${cssPrefix}-row`)

        this.name = document.createElement('div')
        this.name.classList.add('musicplayer-row-name')
        this.name.innerText = name
        this.row.appendChild(this.name)

        this.data = document.createElement('div')
        this.data.classList.add('musicplayer-row-data', `musicplayer-${cssPrefix}-row-data`)
        this.row.appendChild(this.data)

        this.title = document.createElement('span')
        this.title.classList.add('musicplayer-row-data-title')
        this.title.innerText = title
        this.data.appendChild(this.title)

        if (index) {
            this.index = document.createElement('span')
            this.index.innerText = `<${index}>`
            this.index.classList.add('musicplayer-row-data-index')
            this.data.appendChild(this.index)
        }

        if (arrow) {
            this.arrow = document.createElement('div')
            this.arrow.classList.add('musicplayer-button', 'musicplayer-row-data-arrow')
            this.data.appendChild(this.arrow)
        }
    }
}

class TrackList {
    constructor(list) {
        this.container = document.createElement('div')
        this.container.classList.add('musicplayer-tracklist-container')

        this.rows = []
        for (let i=0; i < list.length; i++) {
            let row = document.createElement('div')
            row.classList.add('musicplayer-tracklist-row')
            row.dataset.position = i
            this.container.appendChild(row)
            this.rows.push(row)

            let name = document.createElement('div')
            name.classList.add('musicplayer-tracklist-name')
            name.innerText = list[i].name
            row.appendChild(name)

            let position = document.createElement('div')
            position.classList.add('musicplayer-tracklist-position')
            position.innerText = `<${(i+1).toString().padStart(2,'0')}>`
            row.appendChild(position)
        }

        this.hide()
    }
    
    hide() {
        this.container.style.display = 'none'
        this.hidden = true
    }

    show() {
        this.container.style.display = null
        this.hidden = false
    }

    toggle() {
        this.hidden ? this.show() : this.hide()
    }

    stickTo(el) {
        setTimeout(() => {
            let rect = el.getBoundingClientRect()
            this.container.style.width = rect.width + 'px'
            this.container.style.top = rect.top + rect.height + 'px'
            this.container.style.left = rect.left - 2 +'px'
        }, 100)
    }
}