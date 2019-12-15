import AbstractRouter from './AbstractRouter'
import * as NodeHttp from 'http'

interface RoutePath{
    handler?: Function,
    routes: RoutePath | {}
}

interface HandlerData{
    parameter: any,
    request: NodeHttp.IncomingMessage,
    response: NodeHttp.ServerResponse
}

export class Router extends AbstractRouter{

    protected serverRoutes:{ [key: string]: any; } = {}
    protected defaultHandler = (data:HandlerData)=>{ data.response.statusCode = 404; data.response.end('')}
    
    public createRecurseRoutePaths(parts: Array<string>, routes:any = this.serverRoutes): RoutePath{
        const part = parts.length > 0 ? parts.splice(0, 1)[0] : '/'
        if(!routes[part]){
            const routePath:RoutePath = {handler: undefined, routes:{}};
            routes[part] = routePath;
        }
        if(parts.length > 0){
            return this.createRecurseRoutePaths(parts, routes[part].routes)
        }
        return routes[part]
    }
    
    public getRecurseRouteHandler(parts:Array<string>, routes = this.serverRoutes, data = undefined){
        const DefaultReturn = {handler: this.defaultHandler, data: data};
        let part = parts.length > 0 ? parts.splice(0, 1)[0] : '/'
        if(!part){
            return DefaultReturn;
        }
        const urlData = data || {};
        if(!routes[part]){
            for(let routeIndex in routes){
                if(routeIndex.match(/\{[\w]*\}/gm)){
                    let key = routeIndex.replace('{','').replace('}','')
                    urlData[key] = part
                    part = routeIndex
                    break;
                }
                if(routeIndex === '*'){
                    urlData[routeIndex] = [part, ...parts].join('/')
                    part = routeIndex
                    break;
                }
            }
        }
        if(part === '*'){
            return {handler: routes[part].handler, data: urlData}
        } else if(parts.length > 0){
            return this.getRecurseRouteHandler(parts, routes[part].routes, urlData)
        }else if(routes[part] && routes[part].handler){
            return {handler: routes[part].handler, data: urlData}
        }else{
            return DefaultReturn;
        }
    }

    public setDefaultHandler(handler:(data:HandlerData)=>any){
        this.defaultHandler = handler;
    }
    
    public addRoute(route:string, handler:(data:HandlerData)=>any){
        const parts = route.split('/').filter(Boolean)
        const path = this.createRecurseRoutePaths(parts)
        path.handler = handler
    }
    
    public handle(req:NodeHttp.IncomingMessage, res:NodeHttp.ServerResponse):void{
        const parts = req.url!.split('/').filter(Boolean)
        const {handler, data} = this.getRecurseRouteHandler(parts)
        const handlerData = {
            parameter: data,
            request: req,
            response: res
        }
        handler(handlerData);
    }
}

