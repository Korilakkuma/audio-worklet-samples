'use strict';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const context = new AudioContext();

const promise = context.audioWorklet.addModule('./worklet-scripts/oscillator.js');

promise
  .then(() => {
    const oscillator = new AudioWorkletNode(context, 'oscillator');

    document.querySelector('button').addEventListener('click', async (event) => {
      if (context.state !== 'running') {
        await context.resume();
      }

      const button = event.target;

      if (button.textContent === 'START') {
        oscillator.connect(context.destination);

        button.textContent = 'STOP';
      } else {
        oscillator.disconnect(0);

        button.textContent = 'START';
      }
    }, false);

    document.querySelector('form').addEventListener('change', (event) => {
      const form = event.currentTarget;

      for (let i = 0, len = form.elements['radio-wave-type'].length; i < len; i++) {
        if (form.elements['radio-wave-type'][i].checked) {
          const type = form.elements['radio-wave-type'][i].value;

          oscillator.port.postMessage(type);

          break;
        }
      }
    }, false);

    document.querySelector('[type="range"]').addEventListener('change', (event) => {
      const frequency = event.currentTarget.valueAsNumber;

      const currentTime = context.currentTime;
      const audioParam  = oscillator.parameters.get('frequency');

      audioParam.setValueAtTime(audioParam.value, currentTime);
      audioParam.linearRampToValueAtTime(frequency, currentTime + 0.5);
    }, false);
  })
  .catch(console.error);
