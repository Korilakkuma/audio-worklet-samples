'use strict';

const context = new AudioContext();

document.addEventListener('DOMContentLoaded', () => {

    context.audioWorklet.addModule('./worklet-scripts/white-noise.js').then(() => {
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
    });
}, false);
