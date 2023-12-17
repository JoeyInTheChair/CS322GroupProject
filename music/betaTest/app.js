let audioContext2;
    let audioElement2 = document.getElementById('audio2');
    let volumeNode2, lowPassFilter2, midPassFilter2, highPassFilter2, bassFilter2;

    document.getElementById('startAudio2').addEventListener('click', function() {
      // Check if AudioContext is already created
      if (!audioContext2) {
        // Create AudioContext in response to user gesture
        audioContext2 = new (window.AudioContext || window.webkitAudioContext)();

        // Enable the audio controls after creating AudioContext
        enableAudioControls2();
      }
    });

    document.getElementById('fileInput2').addEventListener('change', handleFileSelect);

    function enableAudioControls2() {
      document.getElementById('volume2').removeAttribute('disabled');
      document.getElementById('lowFreq2').removeAttribute('disabled');
      document.getElementById('midFreq2').removeAttribute('disabled');
      document.getElementById('highFreq2').removeAttribute('disabled');
      document.getElementById('bass2').removeAttribute('disabled');
      document.getElementById('seek2').removeAttribute('disabled');
      document.getElementById('playPause2').removeAttribute('disabled');
    }

    document.getElementById('volume2').addEventListener('input', function() {
      if (volumeNode2) {
        volumeNode2.gain.value = this.value;
      }
    });

    document.getElementById('lowFreq2').addEventListener('input', function() {
      if (lowPassFilter2) {
        lowPassFilter2.frequency.value = this.value;
      }
    });

    document.getElementById('midFreq2').addEventListener('input', function() {
      if (midPassFilter2) {
        midPassFilter2.frequency.value = this.value;
      }
    });

    document.getElementById('highFreq2').addEventListener('input', function() {
      if (highPassFilter2) {
        highPassFilter2.frequency.value = this.value;
      }
    });

    document.getElementById('bass2').addEventListener('input', function() {
      if (bassFilter2) {
        bassFilter2.frequency.value = this.value;
      }
    });

    document.getElementById('seek2').addEventListener('input', function() {
      if (audioElement2) {
        audioElement2.currentTime = this.value;
      }
    });

    document.getElementById('playPause2').addEventListener('click', function() {
      if (audioElement2 && audioElement2.paused) {
        audioElement2.play();
        this.textContent = 'Pause';
      } else {
        audioElement2.pause();
        this.textContent = 'Play';
      }
    });

    function handleFileSelect2(event) {
      // Check if AudioContext is already created
      if (!audioContext2) {
        console.error('Please start audio first.');
        return;
      }

      let file = event.target.files[0];
      if (!file) {
        console.error('No file selected.');
        return;
      }

      let objectURL2 = URL.createObjectURL(file);

      audioElement2.src = objectURL2;
      audioElement2.style.display = 'block';

      volumeNode2 = audioContext2.createGain();
      lowPassFilter2 = audioContext2.createBiquadFilter();
      midPassFilter2 = audioContext2.createBiquadFilter();
      highPassFilter2 = audioContext2.createBiquadFilter();
      bassFilter2 = audioContext2.createBiquadFilter();

      // Initialize filter values to their defaults
      volumeNode2.gain.value = 1;
      lowPassFilter2.frequency.value = 220;
      midPassFilter2.frequency.value = 1000;
      highPassFilter2.frequency.value = 5000;
      bassFilter2.frequency.value = 0;

      let sourceNode2 = audioContext2.createMediaElementSource(audioElement2);
      sourceNode2.connect(volumeNode2);
      volumeNode2.connect(lowPassFilter2);
      lowPassFilter2.connect(midPassFilter2);
      midPassFilter2.connect(highPassFilter2);
      highPassFilter2.connect(bassFilter2);
      bassFilter2.connect(audioContext2.destination);

      // Update the seek range based on the track duration
      document.getElementById('seek2').max = audioElement2.duration;

      // Enable the audio controls
      enableAudioControls2();
    }