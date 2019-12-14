import {Job} from './Job'

export class JobController{
    protected jobs:{[identifier:string]:Job} = {}

    public newJob(identifier:string, promise:Promise<any>){
        this.jobs[identifier] = new Job(identifier, promise);
    }

    public hasJob(identifier:string){
        return !!this.jobs[identifier];
    }

    public getJob(identifier:string){
        if(this.hasJob(identifier)){
            return this.jobs[identifier];
        }
        return undefined;
    }
}