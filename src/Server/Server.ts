import * as NodeHttp from 'http'
import AbstractRouter from '../Router/AbstractRouter';


export class Server{

    protected router:AbstractRouter|undefined = undefined;
    protected httpServer:NodeHttp.Server | undefined = undefined;

    public constructor(){
        this.httpServer = new NodeHttp.Server( (req,res)=>this.requestHandler(req,res))
    }

    protected requestHandler(req:NodeHttp.IncomingMessage, res:NodeHttp.ServerResponse){
        res.setHeader( "Access-Control-Allow-Origin", "*");
        try{
            this.router!.handle(req, res);
        }catch(e){
            res.write(JSON.stringify({error: "internal server error"}))
        }
        
        res.end("");
    }

    start(){
        this.httpServer!.listen(5000)
    }

    public setRouter(router:AbstractRouter){
        this.router = router
    }

    public getRouter(){
        return this.router
    }
}