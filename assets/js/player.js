getlocalStorageKey = (key) => {
    const user = JSON.parse(localStorage.getItem(key));
    return user.key
}

var file = (localStorage.getItem(KEY_STORAGE) !== null) ? URL_VIDEO + getlocalStorageKey(KEY_STORAGE) : URL_ROUTER;
var playerInstance = jwplayer("jwplayer");
playerInstance.setup({
    "width": "100%",
    "height": "100%",
    "aspectratio": "16:9",
    "stretching": "uniform",
    //"title": "",
    //"description": "",
    //"image": ".jpg",
    "file": file,
    "type": "mp4",
    "abouttext": "DailyDoseOfGore",
    "aboutlink": SITE_URL,
    "skin": "glow",
    "id": "jwplayer",
    "playbackRateControls": true,
    "events": {
        onReady: function(event) {
            const btn_download = document.createElement("div"), file_download = playerInstance.getPlaylistItem()["file"], count = document.querySelectorAll(".jw-controlbar-right-group > div").length, add_parent = document.querySelectorAll(".jw-controlbar-right-group > div")[count-1], controlbar = document.getElementsByClassName('jw-controlbar-right-group')[0];
            btn_download.id = "jw-button-download";
            btn_download.setAttribute("class", "jw-icon jw-icon-inline jw-button-color jw-reset jw-button-download");
            btn_download.setAttribute("onclick", `window.location = "${file_download}"`);
            controlbar.insertBefore(btn_download, add_parent);
        },
        onError: function(event) {
            playerInstance.remove()
            playerInstance.setup({
                "width": "100%",
                "height": "100%",
                "aspectratio": "16:9",
                "stretching": "uniform",
                "file": "assets/js/jwplayer/7.12.13/media/errorfile.mp4",
                "image": "assets/js/jwplayer/7.12.13/media/errorfile.png",
                "skin": "glow",
                "mute": true,
                "repeat": true,
                "autostart": true,
                "controls": false
            });
            var element = document.getElementById("jwplayer_message");
            if (event.message === "Error loading player: No playable sources found") {
                element.innerHTML = "<p>Your message</p>";
            } else {
                element.innerHTML = `<div class="jwp-msg-content">
                <div class="jwp-msg-col">Vídeo apenas para membros doadores.</div>
                </div>`;
            }
        }
    }
});

customElements.define("btn-player", class extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", e => {
            this.classList.toggle("active");
            this.parentElement.classList.toggle("active");
            this.parentElement.nextElementSibling.classList.toggle("active");
        });
    }
});