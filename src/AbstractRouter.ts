
export default abstract class AbstractRouter{
    public abstract addRoute(route:string, handler: Function): void;
    public abstract handle(url:string): void; 
}