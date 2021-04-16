const u= require('../index')
//const mongoose= require('mongoose')
//const expected= [expect.stringMatching('Greetings!'), expect.stringMatching('Hey there!')];
test('properly returns a greeting', async () => {
    await expect(u.replyMessage('hello')).resolves.toMatch(/(Greetings!|Hello there|Hello, how can I help you today?|Hey there!|Hey!|Geetings! How can I help you?)/i);
})
test('properly returns an error', async () => {
    await expect(u.replyMessage('na error')).resolves.toMatch('Sorry, I don\'t understand');
})
/*test('properly returns a resource', async () => {
    await expect(u.replyMessage('')).resolves.toMatch( /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g);
})*/
/*test('properly returns a message', async () => {
    await expect(u.replyMessage('hello')).resolves.toMatch('Greetings!')
})*/
/*afterAll(done => {
    u.server.close();
    done();
});*/
//trying to close the open handle so jest can exit
afterAll(async(done) => {
    // Closing the DB connection allows Jest to exit successfully.
    try {
        await u.handler();
        done()
    } catch (error) {
        console.log(error);
        done()
    }
    // done()
})

