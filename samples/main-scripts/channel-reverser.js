'use strict';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const context = new AudioContext();

const promise = context.audioWorklet.addModule('./worklet-scripts/channel-reverser.js');

promise
  .then(() => {
    const channelReverser = new AudioWorkletNode(context, 'channel-reverser');

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

          source.connect(channelReverser);
          channelReverser.connect(context.destination);

          audioElement.play(0);
        }, false);
      }
    }, false);

    document.querySelector('[type="checkbox"]').addEventListener('click', (event) => {
      channelReverser.port.postMessage(event.currentTarget.checked);
    }, false);
  })
  .catch(console.error);
