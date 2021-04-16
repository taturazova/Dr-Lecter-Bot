const d= require('../Doctor');
const p= require('../PatientMessage');



test('properly returns an intent',  async () => {
    var doc= new d();
    //var pat= new p();
    await doc.setMessage(new p('I\'m feeling depressed'));
    //await doc.setMessageAttributes();
    //console.log(doc.messageSummary); //this returns undefined
    //var pat= new p("your age");
//doc.patientMessage= "depression";
   // doc.messageSummary= pat.getSummary();//what does this return??
    expect(doc.getIntent()).toMatch('user.depression');
})
//test get intent, then get issue
//test getIssue returns a json object?
//x 2 maybe?

test('properly returns an issue',  async () => {
    var doc= new d();
    await doc.setMessage(new p('I\'m feeling depressed'));
    //can i match to object instead of string?
    expect(doc.getIssue()['name']).toMatch('user.depression');
})
test('properly returns an issue',  async () => {
    var doc= new d();
    await doc.setMessage(new p('I\'m back'));
    //can i match to object instead of string?
    expect(doc.getReply()).toMatch(/(Welcome back. What can I do for you?|Good to have you here. What can I do for you?)/i);
})