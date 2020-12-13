'use strict';

const context = new AudioContext();

const promise = context.audioWorklet.addModule('./worklet-scripts/vocal-canceler.js');

promise
  .then(() => {
    const vocalCanceler = new AudioWorkletNode(context, 'vocal-canceler');

    let source = null;

    document.querySelector('[type="file"]').addEventListener('change', async (event) => {
      if (context.state !== 'running') {
        await context.resume();
      }

      const file = event.target.files[0];

      if (file && file.type.includes('audio')) {
        const objectURL = window.URL.createObjectURL(file);

        const audioElement = document.querySelector('audio');

        audioElement.src = objectURL;

        audioElement.addEventListener('loadstart', () => {
          if (source === null) {
            source = context.createMediaElementSource(audioElement);
          }

          source.connect(vocalCanceler);
          vocalCanceler.connect(context.destination);

          audioElement.play(0);
        }, false);
      }
    }, false);

    document.querySelector('[type="range"]').addEventListener('change', (event) => {
      const currentTime = context.currentTime;
      const audioParam  = vocalCanceler.parameters.get('depth');

      audioParam.setValueAtTime(audioParam.value, currentTime);
      audioParam.linearRampToValueAtTime(event.currentTarget.valueAsNumber, currentTime + 5);
    }, false);
  })
  .catch(console.error);
