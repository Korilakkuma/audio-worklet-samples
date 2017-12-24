'use strict';

class Bypass extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    process(inputs, outputs) {
        const input  = inputs[0];
        const output = outputs[0];

        for (let channel = 0, numberOfChannels = output.length; channel < numberOfChannels; channel++) {
            output[channel].set(input[channel]);
        }

        return true;
    }
}

registerProcessor('bypass', Bypass);
