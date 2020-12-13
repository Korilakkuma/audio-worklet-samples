'use strict';

class ChannelReverser extends AudioWorkletProcessor {
  constructor() {
    super();

    this.reversed = false;

    this.port.onmessage = (event) => {
      this.reversed = event.data;
    };
  }

  process(inputs, outputs) {
    const input  = inputs[0];
    const output = outputs[0];

    const numberOfChannels = output.length;

    if (numberOfChannels === 2) {
      if (this.reversed) {
        if (input[0] && input[1]) {
          output[0].set(input[1]);
          output[1].set(input[0]);
        }
      } else {
        if (input[0] && input[1]) {
          output[0].set(input[0]);
          output[1].set(input[1]);
        }
      }
    } else if (input[0]) {
      output[0].set(input[0]);
    }

    return true;
  }
}

registerProcessor('channel-reverser', ChannelReverser);
