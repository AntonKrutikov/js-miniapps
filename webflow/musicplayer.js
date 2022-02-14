export class MusicPlayer {
    constructor(selector) {
        this.container = document.querySelector(selector)

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

    close() {
        this.container.style.display = 'none'
        this.container.classList.remove('maximized')
    }

}