'use strict';

const context = new AudioContext();

document.addEventListener('DOMContentLoaded', () => {
    let type      = 'sine';
    let frequency = 440;

    context.audioWorklet.addModule('./worklet-scripts/oscillator.js').then(() => {
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

        document.querySelector('form').addEventListener('change', event => {
            const form = event.currentTarget;

            for (let i = 0, len = form.elements['radio-wave-type'].length; i < len; i++) {
                if (form.elements['radio-wave-type'][i].checked) {
                    type = form.elements['radio-wave-type'][i].value;

                    oscillator.port.postMessage({ type });

                    break;
                }
            }
        }, false);

        document.querySelector('[type="number"]').addEventListener('input', event => {
            frequency = event.currentTarget.valueAsNumber;

            oscillator.port.postMessage({ frequency });
        }, false);
    });
}, false);
