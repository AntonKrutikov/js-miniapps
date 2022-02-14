export class MusicPlayer {
    constructor(selector, playlist) {
        this.container = document.querySelector(selector)
        this.playlist = playlist ? playlist : {artist: '', tracks: []}
        this.currentTrackID = 0
        this.currentTrack = undefined

        // Buttons
        this.btnPrev = this.container?.querySelector('.button-controls-previous')
        this.btnPlay = this.container?.querySelector('.button-controls-play')
        this.btnNext = this.container?.querySelector('.button-controls-next')
        this.btnPause = this.container?.querySelector('.button-controls-pause')
        this.btnStop = this.container?.querySelector('.button-controls-stop')
        this.btnArtistList = this.container?.querySelector('.toggle-dropdown-artist .dropdown-button')
        this.btnMusicList = this.container?.querySelector('.toggle-dropdown-music-list .dropdown-button')

        const buttons = [this.btnPrev, this.btnPlay, this.btnNext, this.btnPause, this.btnStop, this.btnArtistList, this.btnMusicList]
        buttons.forEach(b => {
            b?.setAttribute('draggable', 'false')
            b?.addEventListener('mousedown', e => {
                b.classList.add('button-pushed')
            })
            document.addEventListener('mouseup', e => {
                b.classList.remove('button-pushed')
            })
            b?.addEventListener('mouseleave', e => {
                b.classList.remove('button-pushed')
            })
        })

        // Lists
        this.dropDownArtist = this.container?.querySelector('.drop-down-artist')
        this.dropDownArtist?.querySelectorAll('.musicplayer-dropdown-row').forEach(a => {
            a?.setAttribute('draggable', 'false')
            a?.addEventListener('click', e => {
                this.closeDropDown(this.dropDownArtist)
            })
        })

        this.dropDownSongs = this.container?.querySelector('.drop-down-music-list')
        this.dropDownSongsList = this.dropDownSongs.querySelector('nav')
        this.dropDownSongsCurrentTitle = this.dropDownSongs.querySelector('.toggle-dropdown-music-list > .musicplayer-track-title')
        this.dropDownSongsCurrentID = this.dropDownSongs.querySelector('.toggle-dropdown-music-list > .musicplayer-track-id')
        this.currentTrackTitle = this.container.querySelector('.music-playback > div')
        this.dropDownSongsList?.replaceChildren()

        for(let i =0; i < this.playlist.tracks.length; i++) {
            const t = this.playlist.tracks[i]
            const a = document.createElement('a')
            a.classList.add('musicplayer-dropdown-row', 'w-dropdown-link')
            a.setAttribute('draggable', 'false')
            a.addEventListener('click', e => {
                e.preventDefault()
                this.setTrack(i)
                this.closeDropDown(this.dropDownSongs)
            })
            const title = document.createElement('span')
            title.classList.add('musicplayer-dropdown-row-title')
            title.innerText = t.title
            const index = document.createElement('span')
            index.innerText = `<${i.toString().padStart(2,'0')}>`
            index.classList.add('musicplayer-dropdown-row-id')
            a.appendChild(title)
            a.appendChild(index)
            this.dropDownSongsList.appendChild(a)
        }

        // Audio
        this.audio = document.createElement('audio')



        this.assignMenu()
    }

    assignMenu() {
        const menu = this.container.querySelector('.ui_menu_file')

        menu?.querySelectorAll('.ui_menu_file_row').forEach(a => {
            a.setAttribute('draggable', 'false')
        })

        const quit = menu?.querySelector('.ui_menu_quit')
        quit?.addEventListener('click', e => {
            e.preventDefault()
            menu?.parentElement?.dispatchEvent(new Event('w-close'))
            this.close()
        })
    }

    closeDropDown(dropDown) {
        console.log('close', dropDown)
        dropDown?.dispatchEvent(new Event('w-close'))
    }

    formatTime(sec) {
        sec = Math.floor( sec );
        let min = Math.floor( sec / 60 );
        min = min >= 10 ? min : '0' + min;
        sec = Math.floor( sec % 60 );
        sec = sec >= 10 ? sec : '0' + sec;
        return {min: min, sec: sec}
    }

    setTrack(id) {
        this.currentTrackID = id
        this.currentTrack = this.playlist.tracks[id]
        this.dropDownSongsCurrentTitle?.innerText = this.currentTrack.title
        this.dropDownSongsCurrentID?.innerText = `<${id.toString().padStart(2, '0')}>`
        this.currentTrackTitle?.innerText = `${id}. ${this.currentTrack.title}`
    }

    close() {
        this.container.style.display = 'none'
        this.container.classList.remove('maximized')
    }

}