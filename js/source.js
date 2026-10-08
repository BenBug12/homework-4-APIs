// *********************************************************************
// Homework 4 APIs
// *********************************************************************

function convertMsToMinSec(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
}

// **************** Update code below  **************** 


// IDs and secret token should come from Spotify
localStorage.setItem("artist_id", "776Uo845nYHJpNaStv1Ds4");
localStorage.setItem("access_token", "BQBniEAJ43IdsZTutcpnlqRZZeApyP222KRTOVr_35MfYKZ90EMye1ITxhxh8TRi3UNVUEpnAuZmdm2l7YgovX2KxtrN5d3lRQsnsbNY0lfP2duQRJ6ygg0PW-bIpxU9HwkxFJbaZ1sN");
localStorage.setItem("track_id_1", "2aoo2jlRnM3A0NyLQqMN2f");
localStorage.setItem("track_id_2", "0wJoRiX5K5BxlqZTolB2LD");
localStorage.setItem("track_id_3", "0NWPxcsf5vdjdiFUI8NgkP");


async function load(){
    
    let artistID = localStorage.getItem("artist_id");
    let accessToken = localStorage.getItem("access_token");
    let trackIDs = [
      localStorage.getItem("track_id_1"),
      localStorage.getItem("track_id_2"),
      localStorage.getItem("track_id_3")
    ];

    if (!accessToken || !artistID) {
      console.error("Access token or artist ID is missing.");
      return;
    }

    const headers = {
      "Authorization": `Bearer ${accessToken}`
    };

    try { 
      // Fetch artist information
      const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artistID}`, { headers });
      const artistData = await artistResponse.json();

      if (artistData.name) {
        document.querySelector("#artist-name").textContent = artistData.name;
      }
      if (artistData.images && artistData.images.length > 0) {
        const artistImage = document.querySelector(".artist-image img");
        if (artistImage) {
          artistImage.src = artistData.images[0].url;
        }
      }
      // Fetch and update top tracks
      const trackElements = document.querySelectorAll(".track");
      for(let i = 0; i < trackIDs.length; i++) {
        if (!trackIDs[i] || !trackElements[i]) continue;

        const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackIDs[i]}`, { headers });
        const trackData = await trackResponse.json();
        const trackRow = trackElements[i];

        if (trackData.album && trackData.album.images.length > 0) {
          trackRow.querySelector("img").src =trackData.album.images[0].url;
        }
        trackRow.querySelector(".track-title").textContent = trackData.name;
        trackRow.querySelector(".track-album").textContent = trackData.album.name;
        trackRow.querySelector(".track-number").textContent = trackData.track_number;
        trackRow.querySelector(".track-duration"). textContent = convertMsToMinSec(trackData.duration_ms);
      }
      
      // Fetch and update the albums
      const albumsResponse = await fetch (`https://api.spotify.com/v1/artists/${artistID}/albums`, { headers });
      const albumsData = await albumsResponse.json();
      const albumCards = document.querySelectorAll(".album-card");

      if (albumsData.items) {
        albumsData.items.forEach((album, index) => {
          if (albumCards[index]) {
            const card = albumCards[index];
            if (album.images && album.images.length > 0) {
              card.querySelector("img").src = album.images[0].url;
          }
          card.querySelector("h3").textContent = album.name;
          const releaseYear = album.release_date ? album.release_date.split("-") [0] : "";
          card.querySelector("p").textContent = `${releaseYear} ${album.ablbum_type}`;
          }
        });
      }
    } catch (error) {
      console.error("Error fetching data from Spotify API:", error);
    }
}
load();


   