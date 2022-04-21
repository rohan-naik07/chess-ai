class AIId{
    constructor(){
        this._id = null;
    }
    setId = (id)=>{
        this._id = id;
    }
    getId = ()=>{
        return this._id;
    }
}

class Logger {

    constructor() {
        this.logs = [];
    }

    get count() {
        return this.logs.length;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        console.log(`${timestamp} - ${message}`);
    }

}

class Singleton {

    constructor() {
        if (!Singleton.loggerInstance) {
            Singleton.loggerInstance= new Logger();
        }
        if (!Singleton.AIInstance) {
            Singleton.AIInstance= new AIId();
        }
    }
  
    getloggerInstance() {
        return Singleton.loggerInstance;
    }

    getAIInstance() {
        return Singleton.AIInstance;
    }
}


module.exports = {
    Singleton : Singleton
}