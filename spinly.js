/**
 * @license MIT
 * Copyright (c) 2025 atsb
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const SPINNER_FRAMES = ['|', '/', '-', '\\'];
const outputStream = process.stdout;

function isInteractive() {
  return outputStream.isTTY;
}

const color = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  white: (text) => `\x1b[37m${text}\x1b[0m`,
  none: (text) => text,
};

const HIDE_CURSOR = '\x1B[?25l';
const SHOW_CURSOR = '\x1B[?25h';

function Spinly(message = '', opts = {}) {
  let intervalId = null;
  let currentFrameIndex = 0;
  let currentMessage = message;
  const colorizeFrame = color[opts.color] || color.none;

  let lastOutput = '';

  const clearLine = () => {
    if (isInteractive()) {
      outputStream.write('\r\x1b[K');
    }
  };

  const render = () => {
    if (!isInteractive()) return;

    const frame = SPINNER_FRAMES[currentFrameIndex];
    const output = `\r${colorizeFrame(frame)} ${currentMessage}`;

    if (output !== lastOutput) {
      outputStream.write(HIDE_CURSOR + output);
      lastOutput = output;
    }
    currentFrameIndex = (currentFrameIndex + 1) % SPINNER_FRAMES.length;
  };

  const stopInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const stop = () => {
    stopInterval();
    clearLine();
    outputStream.write(SHOW_CURSOR);
  };

  const start = () => {
    stopInterval();
    currentFrameIndex = 0;
    lastOutput = '';
    render();
    intervalId = setInterval(render, 100);
  };

  return {
    start,
    update: (msg) => {
      currentMessage = msg;
    },
    stop,
    succeed: (msg = '') => {
      stop();
      console.log(`${color.green('✅')} ${msg || currentMessage}`);
    },
    fail: (msg = '') => {
      stop();
      console.error(`${color.red('❌')} ${msg || currentMessage}`);
    },
    warn: (msg = '') => {
      stop();
      console.warn(`${color.yellow('⚠️')} ${msg || currentMessage}`);
    }
  };
}

module.exports = {
  start: (msg, opts = {}) => {
    const spinly = Spinly(msg, opts);
    spinly.start();
    return spinly;
  }
};
