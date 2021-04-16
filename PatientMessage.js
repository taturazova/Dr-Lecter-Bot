// A class to process client message
module.exports = class PatientMessage {
    text;
    constructor(text) {
        this.text = text;
    }

    // Generates a reply based on the created corpus file
    // Uses nlpjs api
    async getSummary() {
        const { dockStart, ConsoleConnector } = require('@nlpjs/basic');

        const dock = await dockStart();
        const nlp = dock.get('nlp');
        await nlp.train();

        var response = await nlp.process('en', this.text);

        return response;
    }

    // Function that identifies named entities in the text and returns them as a json object
    // Using ner-promise API
    async getNER() {
        const ner = require('ner-promise');

        const nerPromise = new ner({
            install_path: 'stanford-ner-2018-10-16'
        });


        async function test(text) {
            const entities = await nerPromise.process(text);
            console.log(entities);
            return entities;
        }

        return test(this.text);
    }

    getSentiment() {
        const vader = require('vader-sentiment');
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(this.text);
        return intensity;
    }
}