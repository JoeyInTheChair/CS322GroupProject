let audioElement1;
let audioContext1;
let volumeNode1, bassFilter1, lowPassFilter1, midPassFilter1, highPassFilter1;
let record1 = document.querySelector(".record1");
let toneArm1 = document.querySelector(".tone-arm1");

let audioElement2;
let audioContext2;
let volumeNode2, bassFilter2, lowPassFilter2, midPassFilter2, highPassFilter2;
let record2 = document.querySelector(".record2");
let toneArm2 = document.querySelector(".tone-arm2");

document.getElementById('startAudio1').addEventListener('click', function() {
    if (!audioContext1) {
        audioContext1 = new (window.AudioContext || window.webkitAudioContext)();
        volumeNode1 = audioContext1.createGain();
        volumeNode1.connect(audioContext1.destination);
        
        // Add low pass filter for adjusting the lower frequency
        lowPassFilter1 = audioContext1.createBiquadFilter();
        lowPassFilter1.type = 'lowpass';
        //set initial value for low frequency
        lowPassFilter1.frequency.value = 20;
        lowPassFilter1.Q.value = 1; 
        lowPassFilter1.connect(volumeNode1);

        // Add mid pass filter for adjusting the medium frequency
        midPassFilter1 = audioContext1.createBiquadFilter();
        midPassFilter1.type = 'bandpass'; 
        // Set an initial value
        midPassFilter1.frequency.value = 500;
        midPassFilter1.Q.value = 1; 
        midPassFilter1.connect(lowPassFilter1);

        // Add high pass filter for adjusting the high frequency
        highPassFilter1 = audioContext1.createBiquadFilter();
        highPassFilter1.type = 'highpass';
        // Set an initial value
        highPassFilter1.frequency.value = 2000; 
        highPassFilter1.Q.value = 1; 
        highPassFilter1.connect(midPassFilter1);

        //add bass filter
        bassFilter1 = audioContext1.createBiquadFilter();
        bassFilter1.type = 'lowshelf';
        //set initial bass filter
        bassFilter1.frequency.value = 200;
        bassFilter1.gain.value = 0;
        bassFilter1.connect(highPassFilter1);
    }
    
    // Set default values for sliders
    document.getElementById('volume1').value = 1;
    document.getElementById('lowFreq1').value = 20;
    document.getElementById('midFreq1').value = 500;
    document.getElementById('highFreq1').value = 2000;
    document.getElementById('bass1').value = 0;

    document.getElementById('playPause1').removeAttribute('disabled');
});

document.getElementById('startAudio2').addEventListener('click', function() {
    if (!audioContext2) {
        audioContext2 = new (window.AudioContext || window.webkitAudioContext)();
        volumeNode2 = audioContext2.createGain();
        volumeNode2.connect(audioContext2.destination);
        
        // Add low pass filter for adjusting the lower frequency
        lowPassFilter2 = audioContext2.createBiquadFilter();
        lowPassFilter2.type = 'lowpass';
        //set initial value for low frequency
        lowPassFilter2.frequency.value = 20;
        lowPassFilter2.Q.value = 1; 
        lowPassFilter2.connect(volumeNode2);

        // Add mid pass filter for adjusting the medium frequency
        midPassFilter2 = audioContext2.createBiquadFilter();
        midPassFilter2.type = 'bandpass'; 
        // Set an initial value
        midPassFilter2.frequency.value = 500;
        midPassFilter2.Q.value = 1; 
        midPassFilter2.connect(lowPassFilter2);

        // Add high pass filter for adjusting the high frequency
        highPassFilter2 = audioContext2.createBiquadFilter();
        highPassFilter2.type = 'highpass';
        // Set an initial value
        highPassFilter2.frequency.value = 2000; 
        highPassFilter2.Q.value = 1; 
        highPassFilter2.connect(midPassFilter2);

        //add bass filter
        bassFilter2 = audioContext2.createBiquadFilter();
        bassFilter2.type = 'lowshelf';
        //set initial bass filter
        bassFilter2.frequency.value = 200;
        bassFilter2.gain.value = 0;
        bassFilter2.connect(highPassFilter2);
    }
    
    // Set default values for sliders
    document.getElementById('volume2').value = 1;
    document.getElementById('lowFreq2').value = 20;
    document.getElementById('midFreq2').value = 500;
    document.getElementById('highFreq2').value = 2000;
    document.getElementById('bass2').value = 0;

    document.getElementById('playPause2').removeAttribute('disabled');
});

document.getElementById('fileInput1').addEventListener('change', handleFileSelect1);

document.getElementById('fileInput2').addEventListener('change', handleFileSelect2);

document.getElementById('volume1').addEventListener('input', function() {
    if (volumeNode1) {
        const newVolume = parseFloat(this.value);
        console.log('volume 1:');
        volumeNode1.gain.value = newVolume;
    }
});

document.getElementById('volume2').addEventListener('input', function() {
    if (volumeNode2) {
        const newVolume = parseFloat(this.value);
        console.log('volume 2:');
        volumeNode2.gain.value = newVolume;
    }
});

document.getElementById('lowFreq1').addEventListener('input', function() {
      if (lowPassFilter1) {
        const newLowFreq = parseFloat(this.value);
        console.log('low frequency 1:');
        lowPassFilter1.frequency.value = newLowFreq;
      }
});

document.getElementById('lowFreq2').addEventListener('input', function() {
      if (lowPassFilter2) {
        const newLowFreq = parseFloat(this.value);
        console.log('low frequency 2:');
        lowPassFilter2.frequency.value = newLowFreq;
      }
});

document.getElementById('midFreq1').addEventListener('input', function() {
    if (midPassFilter1) {
        const newMidFreq = parseFloat(this.value);
        console.log('medium frequency 1:');
        midPassFilter1.frequency.value = newMidFreq;
    }
});

document.getElementById('midFreq2').addEventListener('input', function() {
    if (midPassFilter2) {
        const newMidFreq = parseFloat(this.value);
        console.log('medium frequency 2:');
        midPassFilter2.frequency.value = newMidFreq;
    }
});

document.getElementById('highFreq1').addEventListener('input', function() {
    if (highPassFilter1) {
        const newHighFreq = parseFloat(this.value);
        console.log('high frequency 1:');
        highPassFilter1.frequency.value = newHighFreq;
    }
});

document.getElementById('highFreq2').addEventListener('input', function() {
    if (highPassFilter2) {
        const newHighFreq = parseFloat(this.value);
        console.log('high frequency 2:');
        highPassFilter2.frequency.value = newHighFreq;
    }
});

document.getElementById('bass1').addEventListener('input', function() {
    if (bassFilter1) {
        const newBassLevel = parseFloat(this.value);
        console.log('bass level 1:');
        bassFilter1.gain.value = newBassLevel;
    }
});

document.getElementById('bass2').addEventListener('input', function() {
    if (bassFilter2) {
        const newBassLevel = parseFloat(this.value);
        console.log('bass level 2:');
        bassFilter2.gain.value = newBassLevel;
    }
});

document.getElementById('seek1').addEventListener('input', function() {
    audioElement1.currentTime = this.value;
});

document.getElementById('seek2').addEventListener('input', function() {
    audioElement2.currentTime = this.value;
});

document.getElementById('playPause1').addEventListener('click', function() {
      if (audioElement1.paused) {
        record1.classList.add("on");
        toneArm1.classList.add("play");
        setTimeout(() => {
            audioElement1.play();
        }, 1000);
    } else {
        audioElement1.pause();
        record1.classList.remove("on");
        toneArm1.classList.remove("play");
    }
});

document.getElementById('playPause2').addEventListener('click', function() {
      if (audioElement2.paused) {
        record2.classList.add("on");
        toneArm2.classList.add("play");
        setTimeout(() => {
            audioElement2.play();
        }, 1000);
    } else {
        audioElement2.pause();
        record2.classList.remove("on");
        toneArm2.classList.remove("play");
    }
});

function handleFileSelect1(event) {
    let file = event.target.files[0];
    if (!file) {
        console.error('No file selected.');
        return;
    }

    let objectURL = URL.createObjectURL(file);

    audioElement1 = document.getElementById('audio1'); // Correctly defining audioElement
    audioElement1.src = objectURL; 

    // Connect the volume node to the audio element
    if (audioContext1 && volumeNode1 && bassFilter1 && lowPassFilter1 && midPassFilter1 && highPassFilter1) {
        let sourceNode1 = audioContext1.createMediaElementSource(audioElement1);
        sourceNode1.connect(bassFilter1);

        // Update the seek range based on the track duration
        document.getElementById('seek1').max = audioElement1.duration;
    }
}

function handleFileSelect2(event) {
    let file = event.target.files[0];
    if (!file) {
        console.error('No file selected.');
        return;
    }

    let objectURL = URL.createObjectURL(file);

    audioElement2 = document.getElementById('audio2'); // Correctly defining audioElement
    audioElement2.src = objectURL; 

    // Connect the volume node to the audio element
    if (audioContext2 && volumeNode2 && bassFilter2 && lowPassFilter2 && midPassFilter2 && highPassFilter2) {
        let sourceNode2 = audioContext2.createMediaElementSource(audioElement2);
        sourceNode2.connect(bassFilter2);

        // Update the seek range based on the track duration
        document.getElementById('seek2').max = audioElement2.duration;
    }
}