let tracks = [];

const skewItemContainer = document.querySelector(".skew");
const skewItem = document.querySelector(".skew__item").getBoundingClientRect();
const imageCenterX = skewItem.left + skewItem.width / 2;
const imageCenterY = skewItem.top + skewItem.height / 2;
skewItemContainer.addEventListener("mousemove", function(e) {
  const clientX = e.clientX;
  const clientY = e.clientY;
  const xCalc = (clientX - imageCenterX) * 0.00000075;
  const yCalc = (clientY - imageCenterY) * 0.000001;
  skewItemContainer.style.setProperty("--x-translate", `${xCalc}`);
  skewItemContainer.style.setProperty("--y-translate", `${yCalc}`);
});

async function loginWithYouTube() {
    const authWindow = window.open(
      'https://playlist-migrator-backend.onrender.com/auth/youtube', 
      'YouTube Login', 
      'width=500,height=600'
    );
    const interval = setInterval(() => {
        if (authWindow.closed) {
            clearInterval(interval);
            startMigration();
        }
    }, 500);
}

async function startMigration() {
    const spotifyUrl = document.getElementById('spotifyUrl').value;
    if (!spotifyUrl){
        throw new Error('Spotify Playlist URL needed for this operation');
    }
    const youtubeUrl = document.getElementById('youtubeUrl').value;
    const loadingEl = document.getElementById('loading');
    const resultEl = document.getElementById('result');
    let body;

    if(!youtubeUrl){
        body = JSON.stringify({spotifyUrl});
    }
    else{
        body = JSON.stringify({ spotifyUrl, youtubeUrl })
    }

    resultEl.innerHTML = "";
    loadingEl.style.display = "block";

    try {
        const res = await fetch('https://playlist-migrator-backend.onrender.com/migrate/spotify-to-youtube', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        const data = await res.text();

        if (!res.ok){
            showErrorScreen(data);
            throw new Error(data || "Migration failed");
        }

        loadingEl.style.display = "none";
        if (res.ok) {
            resultEl.innerHTML = `
                <p style="color: #caff00; font-weight: bold;">✅ Migration complete!</p>
                <a href="${JSON.parse(data).youtubePlaylistUrl}" target="_blank">🎵 Open YouTube Playlist</a>
            `;
        } else {
            throw new Error(data.error || "Migration failed");
        }
    } catch (err) {
        loadingEl.style.display = "none";
        resultEl.innerHTML = `<p style="color: red;">❌ ${err.message}</p>`;
    }
}

  
  function showLoadingScreen(message) {
    document.getElementById('app').innerHTML = `
      <div class="loading">${message}</div>
    `;
  }
  
  function showSuccessScreen(playlistUrl) {
    document.getElementById('app').innerHTML = `
      <div class="success">
        <h2>✅ Migração concluída!</h2>
        <p>Sua nova playlist está disponível em:</p>
        <a href="${playlistUrl}" target="_blank">${playlistUrl}</a>
      </div>
    `;
  }
  
  function showErrorScreen(error) {
    document.getElementById('app').innerHTML = `
      <div class="error">
        <h2>❌ Erro durante a migração</h2>
        <p>${error.message || "Ocorreu um erro desconhecido."}</p>
      </div>
    `;
  }
