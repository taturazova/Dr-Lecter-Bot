module.exports = class Translator {
    language;

    translate = require('bing-translate-api');
    constructor(language) {
        this.language = language;
    }

    // Translates from one language to another
    // Uses bing-translate-api
    async englishTo(text) {
        const {translate} = require('bing-translate-api');
        let res=await translate(text, 'en', this.language, true);
        return res.translation;
    }
    async toEnglish(text) {
        const {translate} = require('bing-translate-api');
        let res=await translate(text,  null, 'en', true);
        return res.translation;
    }
    async detectLanguage(text){
        const {translate} = require('bing-translate-api');
        let res=await translate(text, null, 'en', true);
        if (res.language.score==1)
        return res.language.from;
    }
 

    getLanguage(){
        return this.language;
    }
    setLanguage(language){
        this.language = language;
    }
}