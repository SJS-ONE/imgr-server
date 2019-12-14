import {Server} from './Server/Server';
import {Router} from './Router/Router';
import {JobController} from './JobController/JobController';

import * as NodeFs from 'fs';

const server = new Server();
const router = new Router();

import * as imgr from 'imgr-library';

const cliArgs = process.argv.slice(2);

const config:imgr.Config = JSON.parse(NodeFs.readFileSync(cliArgs[0]));

const library = new imgr.Library(config);

const jobController = new JobController(); 


router.addRoute('/', (data) => {
    data.response.write("test /");
    data.response.end();
})

router.addRoute('/sources', (data)=>{
    const sources = library.getSources();
    const srcs = [];
    for(let source of sources){
        const src = {
            tree: source.getTree(),
            config: source.getConfig()
        }
        srcs.push(src)
    }
    data.response.write(JSON.stringify(srcs));
});

router.addRoute('/source/{sourceName}/images', (data)=>{
    const source = library.getSourceByName(data.parameter.sourceName);
    const images = source.getImages();
    data.response.write(JSON.stringify(images));
});

router.addRoute('/source/{sourceName}/path/*', (data)=>{
    const source = library.getSourceByName(data.parameter.sourceName);
    const path = data.parameter['*'];
    const images = source.getImagesByPath(path);
    data.response.write(JSON.stringify(images));
});

router.addRoute('/source/{sourceName}/image/{uuid}', (data)=>{
    const source = library.getSourceByName(data.parameter.sourceName);
    const image = source.getImage(data.parameter.uuid)
    const res = image === undefined ? {error:'image not found'} : image;
    data.response.write(JSON.stringify(res));
});

router.addRoute('/source/{sourceName}/tree', (data)=>{
    const source = library.getSourceByName(data.parameter.sourceName);
    const tree = source.getTree()
    data.response.write(JSON.stringify(tree));
});

router.addRoute('/library/scan/{sourceName}', (data) => {
    const jobIdentifier = "Library:scanSource:"+data.parameter.sourceName;
    jobController.newJob(
        jobIdentifier,
        library.scanSource(data.parameter.sourceName)
    );
    data.response.write(JSON.stringify({jobIdentifier}));
});

router.addRoute('/jobs/{jobIdentifier}', (data) => {
    const job = jobController.getJob(data.parameter.jobIdentifier);
    const res = {};
    if(job){
        console.log("job:", job)
        res['status'] = job.getStatus();
        res['result'] = job.getResult();
    }else{
        res['error'] = 'no job with identifier: '+data.parameter.jobIdentifier;
    }
    data.response.write(JSON.stringify(res));
});

server.setRouter(router);

(async ()=>{
    //await library.scanSource('lego')
    //await library.scanSource('olympia')

    await library.loadDatabase();
    
    server.start()
})();




