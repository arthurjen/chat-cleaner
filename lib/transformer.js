module.exports = (buffer) => {
    return buffer
        .replace(/\d\d\d\d-\d\d-\d\d \d\d:\d\d (AM|PM)/g, '\n')
        .replace(/Jay Hazerd<\/br>/, 'Jay Hazerd: ')
        .replace(/<\/br>/g, ' ');
};