let tracks = [];

const skewItemContainer = document.querySelector(".skew");
const skewItem = document.querySelector(".skew__item").getBoundingClientRect();
const imageCenterX = skewItem.left + skewItem.width / 2;
const imageCenterY = skewItem.top + skewItem.height / 2;
skewItemContainer.addEventListener("mousemove", function(e) {
  const clientX = e.clientX;
  const clientY = e.clientY;
  const xCalc = (clientX - imageCenterX) * 0.00000075;
  const yCalc = (clientY - imageCenterY) * 0.0000015;
  skewItemContainer.style.setProperty("--x-translate", `${xCalc}`);
  skewItemContainer.style.setProperty("--y-translate", `${yCalc}`);
});

async function loginWithYouTube() {
  const authWindow = window.open(
    'https://playlist-migrator-backend.onrender.com/auth/youtube', 
    'YouTube Login', 
    'width=500,height=600'
  );

  const interval = setInterval(async () => {
    if (authWindow.closed) {
      clearInterval(interval);
      try {
        await startMigration();
      } catch (err) {
        showErrorScreen(err.message);
      }
    }
  }, 500);
}

async function startMigration() {
  const spotifyUrl = document.getElementById('spotifyUrl').value;
  if (!spotifyUrl) {
    throw new Error('Spotify Playlist URL needed for this operation');
  }
  const youtubeUrl = document.getElementById('youtubeUrl').value;
  const body = JSON.stringify({ spotifyUrl, ...(youtubeUrl && { youtubeUrl }) });

  showLoadingScreen('Migrating, please wait...');

  try {
    const res = await fetch('https://playlist-migrator-backend.onrender.com/migrate/spotify-to-youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
      showSuccessScreen(data.youtubePlaylistUrl);
    } else {
      throw new Error(data.error || 'Migration failed');
    }
  } catch (err) {
    showErrorScreen(err.message);
    throw err;
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
      <h2>✅ Migration Complete!</h2>
      <p>Your new playlist is available at:</p>
      <a href="${playlistUrl}" target="_blank">${playlistUrl}</a>
      <button style="margin-top: 4dvh; margin-bottom: 1dvh;" onclick="location.reload()">Migrate Another Playlist</button>
    </div>
  `;
}

function showErrorScreen(error) {
  document.getElementById('app').innerHTML = `
    <div class="error">
      <h2>❌ Couldn't complete migration</h2>
      <p>${error || "An unknown error occurred."}</p>
      <button style="margin-top: 4dvh; margin-bottom: 1dvh;" onclick="location.reload()">Migrate Another Playlist</button>
    </div>
  `;
}
