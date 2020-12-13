'use strict';

class Oscillator extends AudioWorkletProcessor {
  static SAMPLE_RATE = 44100;

  static get parameterDescriptors() {
    return [{
      name          : 'frequency',
      defaultValue  : 440,
      minValue      : 20,
      maxValue      : Oscillator.SAMPLE_RATE / 2,
      automationRate: 'a-rate'
    }];
  }

  constructor() {
    super();

    this.type = 'sine';

    this.n = 0;

    this.port.onmessage = (event) => {
      this.type = event.data;
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];

    const numberOfChannels = output.length;

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const outputChannel = output[channel];

      for (let i = 0, len = outputChannel.length; i < len; i++) {
        const frequency = parameters.frequency.length > 1 ? parameters.frequency[i] : parameters.frequency[0];
        const t0        = Oscillator.SAMPLE_RATE / frequency;

        let output = 0;
        let s      = 0;

        switch (this.type) {
          case 'sine':
            output = Math.sin((2 * Math.PI * frequency * this.n) / Oscillator.SAMPLE_RATE);
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
          default:
            break;
        }

        outputChannel[i] = output;

        this.n++;

        if (this.n >= t0) {
          this.n = 0;
        }
      }
    }

    return true;
  }
}

registerProcessor('oscillator', Oscillator);
