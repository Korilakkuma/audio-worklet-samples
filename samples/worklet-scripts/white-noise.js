'use strict';

class WhiteNoise extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs) {
    const output = outputs[0];

    const numberOfChannels = output.length;

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const outputChannel = output[channel];

      for (let i = 0, len = outputChannel.length; i < len; i++) {
        outputChannel[i] = 2 * (Math.random() - 0.5);
      }
    }

    return true;
  }
}

registerProcessor('white-noise', WhiteNoise);
