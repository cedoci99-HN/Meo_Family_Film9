async function init() {

    const slug = new URLSearchParams(window.location.search).get("slug");

    if (!slug) {
        document.getElementById("title").innerText = "Không có phim";
        return;
    }

    // API nguonc
    const res = await fetch(`https://phim.nguonc.com/api/film/${slug}`);
    const data = await res.json();

    const movie = data.movie;

    document.getElementById("title").innerText = movie.name;

    // episodes
    const episodes = movie.episodes[0].server_data;

    renderEpisodes(episodes);

    // play tập đầu
    playVideo(episodes[0].link_embed);
}

// render tập
function renderEpisodes(list) {

    let html = "";

    list.forEach(ep => {
        html += `
            <button onclick="playVideo('${ep.link_embed}')">
                ${ep.name}
            </button>
        `;
    });

    document.getElementById("episodes").innerHTML = html;
}

// play bằng iframe (nguonc dùng embed)
function playVideo(link) {

    const player = document.getElementById("player");

    player.innerHTML = `
        <iframe src="${link}" allowfullscreen></iframe>
    `;
}

init();