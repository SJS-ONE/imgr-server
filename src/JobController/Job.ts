export class Job {
    public static RUNNING = "running";
    public static FINISHED = "finished";

    protected status = "";
    protected identifier = "";
    protected promise:Promise<any>;
    protected result:any = undefined;

    public constructor(identifier:string, promise:Promise<any>){
        this.identifier = identifier;
        this.promise = promise
        this.status = Job.RUNNING
        this.promise.then(result => {
            this.result = result;
            this.status = Job.FINISHED
        }).catch(error => {
            this.status = Job.FINISHED
        })
    }

    public getStatus(){
        return this.status;
    }

    public getResult(){
        return this.result;
    }

}