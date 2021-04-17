# Psychiatrist Chatbot as a Client-Server Service

Meet **Dr. Hannibal Lecter**, the online Psychiatrist Bot.
The bot is loosely based on the titular main antagonist of the Hannibal book series by Thomas Harris and their film and television series adaptions.
Hannibal is an extremely brilliant psychiatrist, but also a mentally disturbed and cannibalistic serial killer infamous for eating his victims.

## Overview
- The app employs sockets to enable communication between Client (user) and the Server (Bot).
- The Client and the Server files were coded using the **socket.io** library.
- The interface acting between the Client (user) and the Server (bot) is HTML.
- Uses libraries such as **NLP.js**, **stanford-ner**, **ner-promise**, **vader-sentiment package**, and also **unirest** and **Spoonicular**.
- Supports features such as **synonym** and **spell checking**, and **sentiment analysis**. 
- Client side is frontend, while the server side is backend.

## Functionalities
- The bot can respond to basic messages like greetings and salutations.
- It also advises to mental health issues reported by the user, and provides helpful reosurces.
- The bot can identify an entity (a well known place, person), and respond to it.
- A diverse conversation topic includes recipes & wine recommendations: The bot loves to cook, and can be asked about recipes. The bot can also make wine recommendations.
- The bot can speak multiple languages
- Upon recognizing a named entity, the bot looks up images related to that named entity on Flickr.com
- The bot can send the user pictures of cats :)

## How to make it work
- Run the index.js code in the terminal. This is the Server (bot) code.
- Open the browser, and type localhost:4000.
- Start having a conversation with Dr. Lecter!

## How to run the tests
- npm install -g jest
- npm test 

## Libraries and APIs used
- **NLP.js** api - understanding synonyms, getting the message intent
- **ner-promise** api & **Stanford NER** library - Named Entity Recognition
- **vader-sentiment package** - sentiment analysis
- **unirest** & **Spoonacular** API - accessing the database of Recipes & Wine recommendations


## INDIVIDUAL PROJECT:
## APIs used
- **Bing Translate** api - translating text into multiple languages, detecting language of the message, used the bing-translate-api module
- **Flickr** api - searching relevant images on Flickr.com, used flickr-sdk module

## New classes created:
- **Translator**  - uses the bing-translate-api, Doctor class has an attribute of that class, that it uses to process the users' messages
- **ImagePull**  - uses the flickr-sdk module, has a method that returns an array of links for images relevant to the user's request

