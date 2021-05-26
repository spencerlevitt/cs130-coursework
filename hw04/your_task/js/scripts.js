const baseURL = "https://www.apitutor.org/spotify/simple/v1/search";

// Note: AudioPlayer is defined in audio-player.js
const audioFile =
  "https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c";
const audioPlayer = AudioPlayer(".player", audioFile);

const search = (ev) => {
  const term = document.querySelector("#search").value;
  console.log("search for:", term);
  // issue three Spotify queries at once...
  getTracks(term);
  getAlbums(term);
  getArtist(term);
  if (ev) {
    ev.preventDefault();
  }
};

const attachTrackHandlers = () => {
  const tracks = document
    .getElementById("tracks")
    .querySelectorAll(".track-item");
  console.log(tracks.length);
  tracks.forEach((track) => {
    track.addEventListener("click", (event) => {
      const trackPreviewContainer = document
        .querySelector("footer")
        .getElementsByClassName("track-item")[0];
      trackPreviewContainer.innerHTML = `${event.currentTarget.innerHTML}`;

      const songUrl = event.currentTarget.getAttribute("data-preview-track");
      audioPlayer.setAudioFile(songUrl);

      audioPlayer.play();
    });
  });
};

const getTracks = (term) => {
  console.log(`
        get tracks from spotify based on the search term
        "${term}" and load them into the #tracks section 
        of the DOM...`);
  fetch(
    `https://www.apitutor.org/spotify/simple/v1/search?type=track&q=${term}`
  )
    .then((response) => response.json())
    .then((data) => {
      const size = 5;
      const items = data.slice(0, size).map((i) => {
        return `<section class="track-item preview" data-preview-track="${i.preview_url}">
    <img src="${i.album.image_url}">
    <i class="fas play-track fa-play" aria-hidden="true"></i>
    <div class="label">
        <h3>${i.album.name}</h3>
        <p>
            ${i.name}
        </p>
    </div>
</section>`;
      });
      document.getElementById("tracks").innerHTML =
        items.length > 0 ? `${items.join(" ")}` : `<p>No tracks found</p>`;
    })
    .then(() => {
      attachTrackHandlers();
    });
};

const getAlbums = (term) => {
  console.log(`
        get albums from spotify based on the search term
        "${term}" and load them into the #albums section 
        of the DOM...`);
  fetch(
    `https://www.apitutor.org/spotify/simple/v1/search?type=album&q=${term}`
  )
    .then((response) => response.json())
    .then((data) => {
      const items = data.map((i) => {
        return `<section class="album-card" id="${i.id}">
              <div>
                  <img src="${i.image_url}">
                  <h3>${i.name}</h3>
                  <div class="footer">
                      <a href="${i.spotify_url}" target="_blank">
                          view on spotify
                      </a>
                  </div>
              </div>
          </section>`;
      });
      document.getElementById("albums").innerHTML =
        items.length > 0 ? `${items.join(" ")}` : `<p>No albums found</p>`;
    });
};

const getArtist = (term) => {
  console.log(`
        get artists from spotify based on the search term
        "${term}" and load the first artist into the #artist section 
        of the DOM...`);
  fetch(
    `https://www.apitutor.org/spotify/simple/v1/search?type=artist&q=${term}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const elem = data[0];
        document.getElementById("artist").innerHTML = `
    <section class="artist-card" id="${elem.id}">
        <div>
        <img src="${elem.image_url}">
        <h3>${elem.name}</h3>
        <div class="footer">
            <a href="${elem.spotify_url}" target="_blank">
                view on spotify
            </a>
            </div>
        </div>
    </section>
        `;
      } else {
        document.getElementById("artist").innerHTML = `
    <section class="artist-card" id="">
        <div>
        <h3>No artist with the name ${term} found.</h3>
    </section>
        `;
      }
    });
};

document.querySelector("#search").onkeyup = (ev) => {
  // Number 13 is the "Enter" key on the keyboard
  console.log(ev.keyCode);
  if (ev.keyCode === 13) {
    ev.preventDefault();
    search();
  }
};
