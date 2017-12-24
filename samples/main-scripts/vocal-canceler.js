'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const context = new AudioContext();

    let source        = null;
    let vocalCanceler = null;

    context.audioWorklet.addModule('./worklet-scripts/vocal-canceler.js').then(() => {
        vocalCanceler = new AudioWorkletNode(context, 'vocal-canceler');

        document.querySelector('[type="file"]').addEventListener('change', event => {
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

        document.querySelector('[type="range"]').addEventListener('input', event => {
            vocalCanceler.port.postMessage(event.currentTarget.valueAsNumber);
        }, false);
    });
}, false);
