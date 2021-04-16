module.exports = class Appointment {
    dayOfWeek;
    time;
    constructor(dayOfWeek,time){
        this.time=time
        this.dayOfWeek=dayOfWeek;

    }
}