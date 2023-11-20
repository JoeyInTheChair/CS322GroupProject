import React, { useState, useEffect } from 'react';

const SpotifyPlayer = ({ token }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK Player',
          getOAuthToken: cb => {
            cb(token);
          },
        });

        // Playback event listeners
        player.addListener('ready', ({ device_id }) => {
          setDeviceId(device_id);
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

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [token]);

  const handleSearch = async () => {
    setShowResults(true);
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setSearchResults(data.tracks.items);
    } catch (error) {
      console.error('Error searching for tracks:', error);
    }
  };

  const handlePlay = (trackUri, name, artist) => {
    setIsPlaying(true);
    setShowResults(false);
    setSearchQuery('');
    setCurrentPlaying(`${name} - ${artist}`);
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
    fetch(`https://api.spotify.com/v1/me/player/${isPlaying ? 'pause' : 'play'}?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  };

  return (
    <div>
      <h1>Mixer One</h1>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {showResults && (
        <ul>
          {searchResults.map((track) => (
            <li key={track.id}>
              {track.name} - {track.artists.map(artist => artist.name).join(', ')}
              <button onClick={() => handlePlay(track.uri, track.name, track.artists.map(artist => artist.name).join(', '))}>Play</button>
            </li>
          ))}
        </ul>
      )}
      
        <h3>Currently Playing - {currentPlaying}</h3>
      

      <button onClick={handleTogglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default SpotifyPlayer;

