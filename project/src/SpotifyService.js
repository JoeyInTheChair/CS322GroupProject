// SpotifyPlayer.js
import React, { useState, useEffect } from 'react';

const SpotifyPlayer = ({ token }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://sdk.scdn.co/spotify-player.js';
  script.async = true;
  document.body.appendChild(script);

  script.onload = () => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Mixer One',
        getOAuthToken: cb => {
          cb(token);
        },
      });

      // Playback event listeners
      player.addListener('ready', ({ device_id }) => {
        console.log('[DEVICE ID]: ' + device_id);
        setDeviceId(device_id);

        // Add the event listener only if the button element exists
        const togglePlayButton = document.getElementById('togglePlay');
        if (togglePlayButton) {
          togglePlayButton.onclick = function () {
            console.log('[INFO]: Youre Playing Song');
            player.togglePlay();
          };
        }
      });

      player.addListener('player_state_changed', state => {
        if (state) {
          setIsPlaying(state.paused);
        }
      });

      // Connect to the player
      player.connect();
    };
  };

  return () => {
    document.body.removeChild(script);
  };
}, [token]);



  const handleSearch = async () => {
    // Perform search using Spotify API
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setSearchResults(data.tracks.items);
      console.log('[INFO]: Search successful');
    } catch (error) {
      console.error('Error searching for tracks:', error);
    }
  };

  const handlePlay = (trackUri) => {
    // Play the selected track#
    console.log('[INFO]: deviceID = ' + trackUri);
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: [trackUri],
      }),
    });

  };

 const handleTogglePlay = () => {
  // Toggle play/pause
  fetch(`https://api.spotify.com/v1/me/player/${isPlaying ? 'pause' : 'play'}?device_id=${deviceId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to toggle play/pause');
    }
    return response.json();
  })
  .then(() => {
    setIsPlaying(!isPlaying);
  })
  .catch(error => {
    console.error('Error toggling play/pause:', error);
  });
};


  return (
    <div>
      <h1>Spotify Player</h1>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {searchResults.map((track) => (
          <li key={track.id}>
            {track.name} - {track.artists.map(artist => artist.name).join(', ')}
            <button onClick={() => handlePlay(track.uri)}>Play</button>
          </li>
        ))}
      </ul>

      <button onClick={handleTogglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default SpotifyPlayer;
