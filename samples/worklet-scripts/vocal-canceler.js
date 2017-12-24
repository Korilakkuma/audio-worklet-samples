'use strict';

class VocalCanceler extends AudioWorkletProcessor {
    constructor() {
        super();

        this.depth = 0;

        this.port.onmessage = event => {
            this.depth = event.data;
        };
    }

    process(inputs, outputs) {
        const input  = inputs[0];
        const output = outputs[0];

        const numberOfChannels = output.length;

        if (numberOfChannels === 2) {
            const inputLs  = input[0];
            const inputRs  = input[1];
            const outputLs = output[0];
            const outputRs = output[1];

            for (let i = 0, len = outputLs.length; i < len; i++) {
                outputLs[i] = inputLs[i] - (this.depth * inputRs[i]);
                outputRs[i] = inputRs[i] - (this.depth * inputLs[i]);
            }
        } else {
            output[0].set(input[0]);
        }

        return true;
    }
}

registerProcessor('vocal-canceler', VocalCanceler);
