var searchButton = document.getElementById("search-button");
var sound = null
var play_button = document.getElementById("play-button");
var pause_button = document.getElementById("pause-button");
var searchQueryBox = document.getElementById("search-query")


searchQueryBox.addEventListener("keydown", (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        searchButton.click();
    }
})


searchButton.addEventListener("click", () => {
    var searchQuery = document.getElementById("search-query").value;
    var searchResultsContainer = document.getElementById("search-results");


    searchResultsContainer.innerHTML = "";

    // Send fetch request to Django view
    fetch(`/search-youtube/?query=${encodeURIComponent(searchQuery)}`)
        .then((response) => response.json())
        .then((data) => {
            var searchResults = data.results;
            searchResults.forEach((result) => {
                var resultDiv = document.createElement("div");
                resultDiv.innerHTML = `
                <div class="card mb-4">
                  <div class="card-body">
                    <h5 class="card-title">${result.title}</h5>
                    <button class="play-video btn btn-primary" video_id="${result.video_id}">Play</button>
                  </div>
                </div>
              `;
                searchResultsContainer.appendChild(resultDiv);
            });
        })
        .catch((error) => console.error("Error fetching search results:", error));
});

document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("play-video")) {
        var video_id = event.target.getAttribute("video_id");
        if (sound) {
            sound.stop();
        }
        // Call the download endpoint to download audio from YouTube video
        fetch(`/download/${encodeURIComponent(video_id)}`)
            .then((response) => response.json())
            .then((data) => {
                var audioFile = data.audio_path;
                // Create a Howl instance
                sound = new Howl({
                    src: [audioFile],
                });
                sound.play();

                //clearing the search results 
                const searchResultsContainer = document.getElementById("search-results");
                searchResultsContainer.innerHTML = "";
                //clearing the search query box
                searchQueryBox.value = "";
            })
            .catch((error) => console.error("Error downloading audio:", error));
    }
});

var seekBar = document.getElementById("seek-bar");

// Update the position of the seek bar every second
setInterval(() => {
  if (sound && sound.playing()) {
    var duration = sound.duration();
    var seek = sound.seek();
    seekBar.max = duration;
    seekBar.value = seek;
  }
}, 1000);

// Handle the change event of the seek bar
seekBar.addEventListener("change", (e) => {
  if (sound) {
    sound.seek(e.target.value);
  }
});

var playPauseButton = document.getElementById("play-pause-button");
var playPauseIcon = document.getElementById("play-pause-icon");

playPauseButton.addEventListener("click", (e) => {
  if (sound) {
    if (sound.playing()) {
      sound.pause();
      playPauseIcon.className = "fas fa-play";
    } else {
      sound.play();
      playPauseIcon.className = "fas fa-pause";
    }
  }
});