'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const context = new AudioContext();

    let noiseGenerator = null;

    context.audioWorklet.addModule('./worklet-scripts/white-noise.js').then(() => {
        noiseGenerator = new AudioWorkletNode(context, 'white-noise');

        document.querySelector('button').addEventListener('click', event => {
            const button = event.currentTarget;

            if (button.textContent === 'START') {
                noiseGenerator.connect(context.destination);

                button.textContent = 'STOP';
            } else {
                noiseGenerator.disconnect(0);

                button.textContent = 'START';
            }
        }, false);
    });
}, false);