import * as NodeHttp from 'http'

import {Server} from './Server'
import {Router} from './Router'

import test from './test'

const server = new Server();
const router = new Router();

router.addRoute('/all', d => console.log("/all ::", d))
router.addRoute('/image/{id}', id => console.log("get image with id", id))
server.setRouter(router)

server.start()







test()