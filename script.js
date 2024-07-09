var selectedBlock = 'air';
var audioElement;
var context = new AudioContext(); // Create AudioContext instance // ? Przeniesione, aby zapobiedz ciągłemu tworzeniu nowego audio (po czasie dzwięk przestawał działać).
var key;

function playSound(e) {
    key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if (!key) return;
    var pitch = key.getAttribute('data-pitch');
    audioElement = document.querySelector(`audio[data-block="${selectedBlock}"]`);

    key.classList.add('active');

    let notes = document.createElement('div');
    notes.className = 'notes';

    key.prepend(notes);

    // var note = key.querySelector('.note');
    // note.style.display = "block";
    playAudioWithPitch(audioElement, pitch, key);
    stopNoteAnimation(notes);
};

function stopNoteAnimation (notes) { 
    // notes.remove();
    notes.addEventListener("animationend", (event) => {
        notes.remove();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll(`.block`);
    
    blocks.forEach(function(block) {
        block.addEventListener('click', function(e) {
            var blockData = block.getAttribute('data-block');
            selectedBlock = blockData;

            const img = document.querySelector(`.chosen-img`);
            img.src = "/image/" + selectedBlock + ".png";
            
            audioElement = document.querySelector(`audio[data-block="${selectedBlock}"]`);
        })
    });

    // ! Zmiana poziomu głośności nie dziala

    const volumeSlider = document.getElementById('volume-slider');
    const volumeImg = document.querySelector('.volume-img');

    volumeSlider.addEventListener('input', function(e) {
        const volume = e.currentTarget.value / 100;

        if (volume === 0) {
            volumeImg.innerHTML = "volume_off";
        } else if (volume < 0.25) {
            volumeImg.innerHTML = "volume_mute";
        } else if (volume < 0.75) {
            volumeImg.innerHTML = "volume_down";
        } else {
            volumeImg.innerHTML = "volume_up";
        }
    });
});

window.addEventListener('keydown', playSound);

// ! Zrobione przez ChatGPT i wzięte z neta bo nie mam bladego pojęcia co tu sie dzieje
// Function to play audio with modified pitch
function playAudioWithPitch(audioElement, pitch, key) {
    var source = context.createBufferSource(); // Create BufferSource node

    // Fetch and decode audio data
    fetch(audioElement.src)
        .then(response => response.arrayBuffer())
        .then(buffer => context.decodeAudioData(buffer))
        .then(decodedData => {
            source.buffer = decodedData; // Set buffer source to decoded audio data
            source.playbackRate.value = pitch; // Set playback rate to the pitch value
            source.connect(context.destination); // Connect source to destination (speakers)

            // Start playing audio
            source.start(0);

            // Event listener to remove 'active' class after audio playback ends
            source.onended = function() {
                key.classList.remove('active');
                // var note = key.querySelector(`.note`);
                // note.style.display = "none";
            };
        })
        .catch(error => {
            console.error('Error loading or decoding audio file:', error);
        });
}
 