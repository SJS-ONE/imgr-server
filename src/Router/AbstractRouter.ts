import * as NodeHttp from 'http'
export default abstract class AbstractRouter{
    public abstract addRoute(route:string, handler: Function): void;
    public abstract handle(req:NodeHttp.IncomingMessage, res:NodeHttp.ServerResponse): void; 
}