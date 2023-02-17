function playAudio(s) {
  const sound = document.querySelector(`audio[data-key="${s.keyCode}"]`);
  const key = document.querySelector(`key[data-key="${s.keyCode}"]`);
  sound.currentTime = 0;
  sound.play();
}

window.addEventListener("keydown", playAudio);

const recordedAudio = {
  "1": null,
  "2": null,
  "3": null,
  "4": null
}

function recordAudio(file) {
  const recording = (x) => {
    const sound = document.querySelector(`audio[data-key="${x.keyCode}"]`);
    recordedAudio[file] = sound;
  };

  window.addEventListener("keydown", recording);

  setTimeout(() => {
    window.removeEventListener("keydown", recording);
  },  1000);
}

function playRecording(file) {
  if (recordedAudio[file] === null) {
    window.alert("Brak nagrania");
    return;
  }
  recordedAudio[file].play();
  recordedAudio[file].currentTime = 0;
}

document.querySelector("#record-1").addEventListener("click", () => {
  recordAudio(1);
});
document.querySelector("#record-2").addEventListener("click", () => {
  recordAudio(2);
});
document.querySelector("#record-3").addEventListener("click", () => {
  recordAudio(3);
});
document.querySelector("#record-4").addEventListener("click", () => {
  recordAudio(4);
});

document.querySelector("#record-play-1").addEventListener("click", () => {
  playRecording(1);
});
document.querySelector("#record-play-2").addEventListener("click", () => {
  playRecording(2);
});
document.querySelector("#record-play-3").addEventListener("click", () => {
  playRecording(3);
});
document.querySelector("#record-play-4").addEventListener("click", () => {
  playRecording(4);
});

document.querySelector("#play-all").addEventListener("click", () => {
  playRecording(1); playRecording(2); playRecording(3); playRecording(4);
});
