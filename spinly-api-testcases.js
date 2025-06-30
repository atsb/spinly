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

const { start } = require('./spinly');

console.log('\n--- API TEST ---\n');

function runTests() {
  const test1 = start('working on a task...');
  setTimeout(() => {
    test1.succeed('Task completed successfully!');

    const test2 = start('attempting to connect to database...', { color: 'red' });
    setTimeout(() => {
      test2.fail('Database connection failed!');

      const test3 = start('verifiying configuration values...', { color: 'yellow' });
      setTimeout(() => {
        test3.warn('Configuration options are incorrect!');

        const test4 = start('processing some files...', { color: 'blue' });
        let counter = 0;
        const updateInterval = setInterval(() => {
          counter++;
          test4.update(`processing a file ${counter}`);
        }, 400);

        setTimeout(() => {
          clearInterval(updateInterval);
          test4.stop();
          console.log('\n🔵 Spinner stopped manually!\n');

          runColorCycleTest();
        }, 3000);
      }, 1500);
    }, 1500);
  }, 1500);
}

function runColourCycleTest() {
  const colours = ['green', 'red', 'yellow', 'blue', 'cyan', 'magenta', 'white'];
  let index = 0;

  function next() {
    if (index >= colours.length) {
      console.log('\n✅ All spinner colours tested.\n');
      return;
    }

    const colour = colours[index];
    console.log(`\nTesting spinner color: ${colour}`);
    const spinner = start(`Colour: ${colour}`, { colour });

    setTimeout(() => {
      spinner.succeed(`Finished ${colour} spinner`);
      index++;
      setTimeout(next, 500);
    }, 1500);
  }

  next();
}

runTests();
