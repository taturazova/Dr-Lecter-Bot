// A class to process client message
const Translator= require('./Translator.js');
const PatientMessage = require('./PatientMessage.js');
const ImagePull = require('./ImagePull.js');
  
module.exports = class Doctor {

    patientMessage;
    messageSummary;
    messageNER;
    issue;
    appointment;
    serverReply;
    recipeInfo;
    wineInfo;

    //DATA FLOW VARIABLES
    inProgress = false;
    awaitReplyResources = false;
    awaitReplyAppointment = false;
    awaitReview = false;
    awaitReplyRecipe = false;
    awaitReplyWine = false;
    awaitReplyLanguage = false;

    //TRANSLATOR
    translator=new Translator('en');
    availableLanguages=["lt","fr","it","de","ru","en"];

    //FLICKR
    imgPull=new ImagePull();

    mentalIssues = ["user.depression", "user.anxiety", "user.cannotsleep"];
    constructor() {
    }

    async setMessage(patientMessage) {
        this.serverReply = new Array();

        var messageLanguage= await this.translator.detectLanguage(patientMessage.text);
        if (!this.awaitReplyLanguage){
            if (messageLanguage!='en'){
                var translatedText=await this.translator.toEnglish(patientMessage.text);
                this.patientMessage = new PatientMessage(translatedText);
            }else{
                this.patientMessage = patientMessage;
            }
            if (messageLanguage!=this.translator.getLanguage()){
                this.translator.setLanguage(messageLanguage);
                this.serverReply.push("Language switched to:\""+messageLanguage+"\"");
            }
        }else{
            this.patientMessage = patientMessage;
        }
        await this.setMessageAttributes();
    }

    setRecipeInfo(recipeInfo) {
        this.recipeInfo = recipeInfo.recipes[0];
    }
    setWineInfo(wineInfo) {
        this.wineInfo = wineInfo;
        console.log(this.wineInfo);
    }


    async setMessageAttributes() {
        this.messageSummary = await this.patientMessage.getSummary();
        this.messageNER = await this.patientMessage.getNER();
    }

    //Function checks if the user is asking for help with mental issues

    getIssue() {
        let intent = this.getIntent();
        if (this.mentalIssues.includes(intent)) {
            console.log("ISSUE DETECTED");
            var mentalIssuesData = require('./data/mentalIssuesData.json').data;
            var issue = mentalIssuesData.find(el => el.name === intent)
            console.log(issue);

            return issue;
        } else {
            return null
        }
    }



    // Function gets reply based on the corpus file from existing response
    async getReply() {
        //DEBUGGGING
        console.log(this.messageSummary);
        console.log(this.messageNER);

        if (!this.inProgress) { //If no meaningful conversation has been started
            if (this.messageSummary != null) {
                this.issue = this.getIssue();
                if (this.issue != null) {
                    this.inProgress = true;
                    this.awaitReplyResources = true;
                    this.serverReply.push(this.issue.summary);
                    this.serverReply.push("Would you like some more resources to help you cope?");

                } else if (this.getIntent() == "user.food") {
                    this.inProgress = true;
                    this.awaitReplyRecipe = true;
                    this.serverReply.push("Are you hungry?");
                } else if (this.getIntent() == "user.wine") {
                    this.serverReply.push(this.messageSummary['answer']);
                    this.inProgress = true;
                    this.awaitReplyWine = true;
                } else if (this.getIntent() == "user.language") { 
                    this.serverReply.push(this.messageSummary['answer']);
                    this.inProgress=true;
                    this.awaitReplyLanguage=true;
                    console.log("DEBUG:awaitReplyLanguage");
                } else if (this.getIntent() == "user.cats") {
                    this.serverReply.push(this.messageSummary['answer']);
                    var linksArray = await this.imgPull.getImageLinks('cat');
                    for (var i = 0; i < 3; i++) {
                        var imageIdx=Math.round(Math.random()*linksArray.length);
                        this.serverReply.push("<img src=" + linksArray[imageIdx] + " style=\"width: 310px;\"></img>");
                    }
                }
                else{
                    if (this.messageSummary['answer']!=null)
                        this.serverReply.push(this.messageSummary['answer']);
                }

            } else {
                console.log("Message attributes have not been set up");
            }
        } else if (this.awaitReplyResources) { // dialogue on topic started
            if (this.getIntent() == "user.yes") {
                this.serverReply.push(this.issue.link);
            } else if (this.getIntent() == "user.no") {
                this.serverReply.push("Ok");
            } else {
                this.serverReply.push(this.messageSummary['answer']);
                this.inProgress = false; // continue conversation, terminate dialogue on topic
            }
            this.serverReply.push("Would you like to set up an appointment?");
            this.awaitReplyAppointment = true;
            this.awaitReplyResources = false;

        } else if (this.awaitReplyAppointment) {
            if (this.getIntent() == "user.yes") {
                //TODO: SETTING UP APPOINTMENT WITH NER
                this.serverReply.push("Appointment set up!");
            } else if (this.getIntent() == "user.no") {
                this.serverReply.push("Ok");
            } else {
                this.serverReply.push(this.messageSummary['answer']); // continue conversation, terminate dialogue on topic
            }
            this.awaitReplyAppointment = false;
            this.awaitReview=true;
            this.serverReply.push("How did you like this interaction?");
        } else if (this.awaitReplyRecipe) {
            if (this.getIntent() == "user.yes") {
                this.serverReply.push("Before we begin, I must warn you...nothing here is vegetarian");
                if (this.getRecipeSummary() != null)
                    this.serverReply.push(this.getRecipeSummary());
                if (this.getRecipeLink() != null)
                    this.serverReply.push(this.getRecipeLink());
            } else if (this.getIntent() == "user.no") {
                this.serverReply.push("Ok");
            } else {
                this.serverReply.push(this.messageSummary['answer']); // continue conversation, terminate dialogue on topic
                this.inProgress = false;
            }
            this.serverReply.push("Would you like some wine recommendations from me?");
            this.awaitReplyRecipe = false;
            this.awaitReplyWine = true;
        } else if (this.awaitReplyWine) {
            if (this.getIntent() == "user.yes") {
                this.serverReply.push(this.getWineSummary());
                this.serverReply.push(this.getWineProduct());
                this.serverReply.push(this.getWineProductUrl());
            } else if (this.getIntent() == "user.no") {
                this.serverReply.push("Ok");
            } else {
                this.serverReply.push(this.messageSummary['answer']);
                this.inProgress=false;
            }
            this.awaitReplyWine = false;
            this.awaitReview=true;
            this.serverReply.push("How did you like this interaction?");
        }else if (this.awaitReplyLanguage){
            var text=String(this.patientMessage.text).replace(/(\r\n|\n|\r)/gm, "");
            console.log(text);
            console.log(this.availableLanguages.includes(text));
            if (this.availableLanguages.includes(text)){
                this.translator.setLanguage(text);
                this.serverReply.push("Switched language to: "+text);
            }
            this.inProgress=false;
            this.awaitReplyLanguage=false;

            console.log("DEBUG: processing language");
        }else if(this.awaitReview){
            this.analyzeSentiment();
        }

        //TESTING NER
        var entities = this.messageNER;

        if (entities["LOCATION"] != null) {
            var location = entities["LOCATION"][0];
            this.serverReply.push("Here are some photots of " + location);
            var linksArray=await this.imgPull.getImageLinks(location);
            
            for (var i=0;i<3;i++){
                //var imageIdx=Math.round(Math.random()*linksArray.length);
                this.serverReply.push("<img src="+linksArray[i]+" style=\"width: 310px;\"></img>");
            }

        }
        if (entities["PERSON"] != null) {
            var person = entities["PERSON"][0];
            this.serverReply.push("Ah, " + person + " is an interesting character... You know them?");
            this.serverReply.push("I think I found a photo of " + person);
            var linksArray=await this.imgPull.getImageLinks(person);
            
            for (var i=0;i<1;i++){
                //var imageIdx=Math.round(Math.random()*linksArray.length);
                this.serverReply.push("<img src="+linksArray[i]+" style=\"width: 310px;\"></img>");
            }
        }


          // If language is not english, translate all replies
        if (this.translator.getLanguage() != "en" && this.serverReply.length>0) {
            for (var i = 0; i < this.serverReply.length; i++) {
                if (!this.serverReply[i].includes("https://"))
                    this.serverReply[i] = await this.translator.englishTo(this.serverReply[i]);
            }
        }

        //this.serverReply.push("<img src=https://live.staticflickr.com/65535/51112963822_46fb6a511f.jpg style=\"width: 310px;\"></img>");
        return this.serverReply;
    }



    // Function gets intent from existing response

    getIntent() {
        if (this.messageSummary != null) {
            return this.messageSummary['intent'];
        } else {
            return null
        }
    }

    // Get sentiment from response
    analyzeSentiment() {
        var r;
        var reply;
        var sentiment = this.patientMessage.getSentiment();
        if (sentiment.compound >= 0.5) {
            r=1;
            reply="I'm glad I could help";
        }else if (sentiment.compound<=(-0.5)){
            r=-1;
            reply="Sorry. I will try to improve in the future";
        }else{
            r=0;
            reply="Ok, thank you";
        }
        console.log("SENTIMENT:"+this.patientMessage.getSentiment());

        if (this.awaitReview && this.inProgress) {
            this.serverReply.push(reply);
            this.serverReply.push("What else can I help you with?")
            this.awaitReview=false;
            this.inProgress=false;
        }
        return r;
    }

    getMessageNER() {
        if (this.messageNER != null) {
            return this.messageNER;
        } else {
            return null
        }
    }

    getAppointment() {
        return this.appointment;
    }

    getRecipeSummary() {
        return this.recipeInfo.summary;
    }
    getRecipeLink() {
        return this.recipeInfo.sourceUrl;
    }
    getRecipeImage() {
        return this.recipeInfo.image;
    }
    getWineSummary() {
        return this.wineInfo.pairingText;
    }
    getWineProduct() {
        return this.wineInfo.productMatches[0].description;
    }
    getWineProductUrl() {
        return this.wineInfo.productMatches[0].link;
    }


}