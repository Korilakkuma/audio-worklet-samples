'use strict';

class Oscillator extends AudioWorkletProcessor {
    constructor() {
        super();

        this.type      = 'sine';
        this.frequency = 440;

        this.n = 0;

        this.port.onmessage = event => {
            for (const key in event.data) {
                this[key] = event.data[key];
            }

            this.n = 0;
        };
    }

    process(inputs, outputs) {
        const output = outputs[0];

        for (let channel = 0, numberOfChannels = output.length; channel < numberOfChannels; channel++) {
            const outputChannel = output[channel];

            const fs = 44100;

            for (let i = 0, len = outputChannel.length; i < len; i++) {
                const t0 = fs / this.frequency;

                let output = 0;
                let s      = 0;

                switch (this.type) {
                    case 'sine':
                        output = Math.sin((2 * Math.PI * this.frequency * this.n) / fs);
                        break;
                    case 'square':
                        output = (this.n < (t0 / 2)) ? 1 : -1;
                        break;
                    case 'sawtooth':
                        s = 2 * this.n / t0;

                        output = s - 1;
                        break;
                    case 'triangle':
                        s = 4 * this.n / t0;

                        output = (this.n < (t0 / 2)) ? (-1 + s) : (3 - s);
                        break;
                    default :
                        break;
                }

                outputChannel[i] = output;

                this.n++;

                if ((this.type !== 'sine') && (this.n >= t0)) {
                    this.n = 0;
                }
            }
        }

        return true;
    }
}

registerProcessor('oscillator', Oscillator);
