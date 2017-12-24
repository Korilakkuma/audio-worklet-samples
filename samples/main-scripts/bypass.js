'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const context = new AudioContext();

    let oscillator = null;
    let bypass     = null;

    context.audioWorklet.addModule('./worklet-scripts/bypass.js').then(() => {
        bypass = new AudioWorkletNode(context, 'bypass');

        document.querySelector('button').addEventListener('click', event => {
            const button = event.currentTarget;

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
    });
}, false);
