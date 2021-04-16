const p= require('../PatientMessage');
test('properly returns an summary',  async () => {
    var pat= new p('HEllo');
    //await pat.setMessage(new p('I\'m feeling depressed'));
    //await doc.setMessageAttributes();
    //console.log(doc.messageSummary); //this returns undefined
    //var pat= new p("your age");
//doc.patientMessage= "depression";
    // doc.messageSummary= pat.getSummary();//what does this return??
    expect(await pat.getSummary()).toMatchObject();
})