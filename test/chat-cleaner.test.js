const assert = require('assert');
const ChatCleaner = require('../lib/ChatCleaner');
const fs = require('fs');
const { unlink } = fs.promises;

describe('chat cleaner', () => {
    const actualFile = './test/chat-cleaned.html';
    const sourceFile = './test/chat-test.html';
    beforeEach(() => {
        return unlink(actualFile)
            .catch(err => {
                if(err.code !== 'ENOENT') throw err;
            });
    });
    

    let cleaner = null;

    beforeEach(() => {
        cleaner = new ChatCleaner(sourceFile);
    });

    it('returns cleaned up chat', () => {
        return cleaner.clean(actualFile)
            .then(() => {
                const actual = fs.readFileSync(actualFile);
                const expected = fs.readFileSync('./test/chat-expected.html');
                assert.equal(actual, expected);
            });
    });
});