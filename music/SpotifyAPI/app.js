let accessToken = 'BQDJh3Y3Bg4Pmso7cirSK5V6DKfD6FTFrfuuzQKMCFBHDDg3uDc6StNwZnLUC-TR_VyQxndryWLt-gmU3UNHoOM6ajbp_r15_tJCi_0NEOQWjGLrJs8';
let player;
let audioContext;
let sourceNode;
let gainNode;
let lowShelfFilter;
let highShelfFilter;
let bassFilter;
let lastPlayedTrackUri = null;
let isPlaying = false;
let record = document.querySelector(".record");
let toneArm = document.querySelector(".tone-arm");

function initializeAudioContext(deviceId) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create audio nodes
    sourceNode = audioContext.createMediaElementSource(player._options.getEl());
    gainNode = audioContext.createGain();
    lowShelfFilter = audioContext.createBiquadFilter();
    highShelfFilter = audioContext.createBiquadFilter();
    bassFilter = audioContext.createBiquadFilter();

    // Connect nodes
    sourceNode.connect(lowShelfFilter);
    lowShelfFilter.connect(highShelfFilter);
    highShelfFilter.connect(bassFilter);
    bassFilter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set initial values
    setLowFrequency();
    setMidFrequency();
    setHighFrequency();
    setBass();
}

function searchAndDisplayResults() {
    const searchInput = document.getElementById('searchInput').value;

    fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=track`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data.tracks.items);
    })
    .catch(error => {
        console.error('Error fetching data from Spotify API:', error);
    });
}

function displayResults(results) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsList.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach((result, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${result.name} - ${result.artists[0].name}`;
        listItem.style.cursor = 'pointer';
        listItem.onclick = () => {
            playTrack(result.uri);
            resultsList.remove(listItem);
        }

        resultsList.appendChild(listItem);
    });
}

function playTrack(trackUri) {
    fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uris: [trackUri],
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Spotify API request failed with status ${response.status}`);
        }
        console.log('Track playback started successfully.');
        record.classList.add("on");
        toneArm.classList.add("play");
        isPlaying = true;
        lastPlayedTrackUri = trackUri;
    })
    .catch(error => {
        console.error('Error starting playback:', error);
    });
}

function pauseTrack() {
    fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Spotify API request failed with status ${response.status}`);
        }
        isPlaying = false;
        console.log('Playback paused successfully.');
    })
    .catch(error => {
        console.error('Error pausing playback:', error);
    });
}

// Function to play the last saved track
function playLastSavedTrack() {
    if (lastPlayedTrackUri) {
        playTrack(lastPlayedTrackUri);
    } else {
        console.log('No last saved track available.');
    }
}

//animation for tone arm to move when music is being played
document.getElementById('playPasue').addEventListener('click', function() {
    console.log("[WORKING] being pressed");
    if(isPlaying) {
        record.classList.add("on");
        toneArm.classList.add("play");
        setTimeout(() => {
            playLastSavedTrack();
        }, 1000);
    } else {
        pauseTrack();
        record.classList.remove("on");
        toneArm.classList.remove("play");
        isPlaying = true;
    }
});


function setLowFrequency() {
    const lowInput = document.getElementById('low');
    const lowValue = parseFloat(lowInput.value);

    lowShelfFilter.type = 'lowshelf';
    lowShelfFilter.frequency.setValueAtTime(300, audioContext.currentTime);
    lowShelfFilter.gain.setValueAtTime(lowValue, audioContext.currentTime);

    console.log('Low Frequency set to:', lowValue);
}

function setMidFrequency() {
    const midInput = document.getElementById('mid');
    const midValue = parseFloat(midInput.value);

    const midFrequency = 1000;

    lowShelfFilter.type = 'peaking';
    lowShelfFilter.frequency.setValueAtTime(midFrequency, audioContext.currentTime);
    lowShelfFilter.gain.setValueAtTime(midValue, audioContext.currentTime);

    console.log('Mid Frequency set to:', midValue);
}

function setHighFrequency() {
    const highInput = document.getElementById('high');
    const highValue = parseFloat(highInput.value);

    const highFrequency = 5000;

    highShelfFilter.type = 'peaking';
    highShelfFilter.frequency.setValueAtTime(highFrequency, audioContext.currentTime);
    highShelfFilter.gain.setValueAtTime(highValue, audioContext.currentTime);

    console.log('High Frequency set to:', highValue);
}

function setBass() {
    const bassInput = document.getElementById('bass');
    const bassValue = parseFloat(bassInput.value);

    const bassFrequency = 100;

    bassFilter.type = 'lowshelf';
    bassFilter.frequency.setValueAtTime(bassFrequency, audioContext.currentTime);
    bassFilter.gain.setValueAtTime(bassValue, audioContext.currentTime);

    console.log('Bass set to:', bassValue);
}