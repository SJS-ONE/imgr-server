import * as NodeHttp from 'http'

export class Server{

    protected httpServer:NodeHttp.Server | undefined = undefined;

    public constructor(){
        this.httpServer = new NodeHttp.Server( this.requestHandler)
    }

    protected requestHandler(req:NodeHttp.IncomingMessage, res:NodeHttp.ServerResponse){
        console.log(req.url )
        
        res.end("res");
    }

    start(){
        this.httpServer!.listen(5000)
    }
}