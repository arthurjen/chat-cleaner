const fs = require('fs');
const transformation = require('./transformer');

module.exports = class ChatCleaner {
    constructor(fileName) {
        this.fileName = fileName;
    }

    clean(outputFile) {
        const writeStream = fs.createWriteStream(outputFile);
        const readStream = fs.createReadStream(this.fileName, {
            encoding: 'utf8',
            highWaterMark: 16000
        });
        let leftOvers = '';
        return new Promise((resolve, reject) => {
            readStream.on('data', chunk => {
                chunk = leftOvers + chunk;
                leftOvers = '';
                const lastIndex = chunk.lastIndexOf(' ');

                if(lastIndex === chunk.length - 1) {
                    // good to go! ship it!
                }
                else if(lastIndex === -1) {
                    // we don't know what to do, wait for next chunk...
                    leftOvers = chunk;
                    return;
                }
                else {
                    // last index is in middle chunk
                    leftOvers = chunk.slice(lastIndex + 1)
                    chunk = chunk.slice(0, lastIndex + 1);
                }

                const changed = transformation(chunk);
                writeStream.write(changed);
            });

            readStream.on('end', () => {
                if(leftOvers) {
                    const changed = transformation(leftOvers);
                    writeStream.write(changed);               
                }
                writeStream.end(resolve);
            });

            readStream.on('error', reject);
        });
    }
};