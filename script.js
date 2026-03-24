async function init() {

    const slug = new URLSearchParams(window.location.search).get("slug");

    if (!slug) {
        document.getElementById("title").innerText = "Không có phim";
        return;
    }

    const res = await fetch(`https://ophim1.com/phim/${slug}`);
    const data = await res.json();

    document.getElementById("title").innerText = data.movie.name;

    const episodes = data.episodes[0].server_data;

    renderEpisodes(episodes);
    playVideo(episodes[0].link_m3u8);
}

// render tập
function renderEpisodes(list) {
    let html = "";

    list.forEach(ep => {
        html += `
            <button onclick="playVideo('${ep.link_m3u8}')">
                ${ep.name}
            </button>
        `;
    });

    document.getElementById("episodes").innerHTML = html;
}

// play video
function playVideo(link) {

    const player = document.getElementById("player");

    player.innerHTML = `
        <video id="video" autoplay playsinline webkit-playsinline></video>

        <div class="controls">
            <button onclick="togglePlay()">⏯</button>
            <button onclick="goFullscreen()">⛶</button>
        </div>
    `;

    const video = document.getElementById("video");

    // click hiện controls
    player.onclick = () => {
        player.classList.toggle("active");
    };

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(link);
        hls.attachMedia(video);
    } else {
        video.src = link;
    }
}

// play/pause
function togglePlay() {
    const video = document.getElementById("video");
    if (video.paused) video.play();
    else video.pause();
}

// fullscreen chuẩn
function goFullscreen() {
    const player = document.getElementById("player");

    if (player.requestFullscreen) {
        player.requestFullscreen().then(() => {
            // Android xoay ngang
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock("landscape").catch(() => {});
            }
        });
    }
}

// xử lý xoay khi fullscreen
document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch(() => {});
        }
    } else {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }
});

init();