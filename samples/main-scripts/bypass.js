'use strict';

const context = new AudioContext();

const promise = context.audioWorklet.addModule('./worklet-scripts/bypass.js');

promise
  .then(() => {
    const bypass = new AudioWorkletNode(context, 'bypass');

    let oscillator = null;

    document.querySelector('button').addEventListener('click', async (event) => {
      if (context.state !== 'running') {
        await context.resume();
      }

      const button = event.target;

      if (button.textContent === 'START') {
        oscillator = context.createOscillator();

        oscillator.connect(bypass);
        bypass.connect(context.destination);

        oscillator.start(0);

        button.textContent = 'STOP';
      } else {
        oscillator.stop(0);

        button.textContent = 'START';
      }
    }, false);
  })
  .catch(console.error);
