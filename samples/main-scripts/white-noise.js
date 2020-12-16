'use strict';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const context = new AudioContext();

const promise = context.audioWorklet.addModule('./worklet-scripts/white-noise.js');

promise
  .then(() => {
    const noiseGenerator = new AudioWorkletNode(context, 'white-noise');

    document.querySelector('button').addEventListener('click', async (event) => {
      if (context.state !== 'running') {
        await context.resume();
      }

      const button = event.target;

      if (button.textContent === 'START') {
        noiseGenerator.connect(context.destination);

        button.textContent = 'STOP';
      } else {
        noiseGenerator.disconnect(0);

        button.textContent = 'START';
      }
    }, false);
  })
  .catch(console.error);
