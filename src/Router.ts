import AbstractRouter from './AbstractRouter'
import * as NodeHttp from 'http'

interface RoutePath{
    handler?: Function,
    routes: RoutePath | {}
}

export class Router extends AbstractRouter{

    protected serverRoutes = {}

    protected defaultHandler = (req:NodeHttp.IncomingMessage, res:NodeHttp.ServerResponse)=>{ res.statusCode = 404; res.end('err')}
    
    public createRecurseRoutePaths(parts: Array<string>, routes:any = this.serverRoutes): RoutePath{
        const part = parts.splice(0, 1)[0]
        if(!routes[part]){
            const routePath:RoutePath= {handler: undefined, routes:{}};
            routes[part] = routePath;
        }
        if(parts.length > 0){
            return this.createRecurseRoutePaths(parts, routes[part].routes)
        }
        return routes[part]
    }
    
    public getRecurseRouteHandler(parts:Array<string>, routes = this.serverRoutes, data = undefined){
        let part = parts.splice(0, 1)[0]
        if(!part){
            return {handler: undefined, data: data};
        }
        const urlData = data || {};
        if(!routes[part]){
            for(let routeIndex in routes){
                if(routeIndex.match(/\{[\w]*\}/gm)){
                    let key = routeIndex.replace('{','').replace('}','')
                    urlData[key] = part
                    part = routeIndex
                }
            }
        }
        if(parts.length > 0){
            return this.getRecurseRouteHandler(parts, routes[part].routes, urlData)
        }else{
            return {handler: routes[part].handler, data: urlData}
        }
    }
    
    public addRoute(route, handler){
        const parts = route.split('/').filter(Boolean)
        const path = this.createRecurseRoutePaths(parts)
        path.handler = handler
    }
    
    public handle(url:string){
        const parts = url.split('/').filter(Boolean)
        let {handler, data} = this.getRecurseRouteHandler(parts)
    
        if(handler){
            handler(data)
        }else{
            this.defaultHandler(data)
        }
    }
}

