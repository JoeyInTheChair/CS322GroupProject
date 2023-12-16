let accessToken = 'BQALMe6rKajzGRAoCHNDig0FVJjMT6ejDmRVldyT0NOMXU-eKkKWSutaXEM3KPIXANhYRB-2x8YQ3IJPfAey9PBJHGyXyBqbFXyfvRxv-K-Mni3o52Q';
let player;

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Mixer One',
        getOAuthToken: cb => {
        cb(accessToken);
        }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => {
        console.error('Initialization error:', message);
    });
    player.addListener('authentication_error', ({ message }) => {
        console.error('Authentication error:', message);
    });
    player.addListener('account_error', ({ message }) => {
        console.error('Account error:', message);
    });
    player.addListener('playback_error', ({ message }) => {
        console.error('Playback error:', message);
    });

    // Playback status updates
    player.addListener('player_state_changed', state => {
        console.log('Player state changed:', state);
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Connect to the player!
    player.connect();
};

function search() {
    const searchInput = document.getElementById('searchInput').value;

    fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=track`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => { displayData(data.tracks.items); })
    .catch(error => {
        console.error('Error fetching data from Spotify API:', error);
    });
}

function displayData(data) {
    const resultList = document.getElementById('searchResults');
    resultList.innerHTML = '';

    if(data.length === 0) {
        resultList.innerHTML = '<p>No Results Found.</p>';
        return;
    }

    data.forEach((result, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${result.name} - ${result.artists[0].name}`;
        listItem.style.cursor = 'pointer';
        listItem.onclick = () => playTrack(result.uri);

        resultList.appendChild(listItem);
    });

}

function playTrack(trackUri) {
    if (!player) {
        console.error('Player not initialized.');
        return;
    }

    // Use the Spotify Web Playback SDK to play the track
    window.Spotify.Player.prototype.getCurrentState().then(state => {
        if (!state) {
            console.error('User is not playing music through the Web Playback SDK');
            return;
        }

        // Play the selected track
        window.Spotify.Player.prototype.togglePlay().then(() => {
            console.log('Playing track:', trackUri);
        });
    });
}

function seekTrack() {
    const seekInput = document.getElementById('seek');
    const seekPosition = parseFloat(seekInput.value);
            
    player.getCurrentState().then(state => {
        if (!state) {
            console.error('User is not playing music through the Web Playback SDK');
            return;
        }

        const duration = state.track_window.current_track.duration_ms;
        const newPosition = (seekPosition / 100) * duration;

        player.seek(newPosition).then(() => {
            console.log('Seeking to:', newPosition, 'ms');
        });
    });
}

function setVolume() {
    const volumeInput = document.getElementById('volume');
    const volumeLevel = parseFloat(volumeInput.value);

    player.setVolume(volumeLevel).then(() => {
        console.log('Volume set to:', volumeLevel);
    });
}

function togglePlayback() {
    player.togglePlay().then(() => {
        console.log('Toggling playback');
    });
}
