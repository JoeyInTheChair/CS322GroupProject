let accessToken = 'BQBJM7Re29FeFSFbU1DOSbOqDazRMcD3sjtKx5bZ0XF9TP5_NaUFoUTKvLLaG4uI08qrDNU5sN4zF0_E6DXQ_NXJcIIXUktWPevEOSdp_76qDbV58WA';
let player;
let audioContext;
let sourceNode;
let gainNode;
let lowShelfFilter;
let highShelfFilter;
let bassFilter;

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
        listItem.onclick = () => playTrack(result.uri);

        resultsList.appendChild(listItem);
    });
}

function playTrack(trackUri) {
    player.togglePlay().then(() => {
        console.log('Playing track:', trackUri);
    });
}

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