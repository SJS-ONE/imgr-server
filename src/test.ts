import * as NodeHttp from 'http'

export default function test(){
    (async ()=>{
        console.log("returned ///:", await getAsync('http://localhost:5000/'))
        console.log("returned:", await getAsync('http://localhost:5000/all'))
        console.log("returned:", await getAsync('http://localhost:5000/image/234'))
    })()
}

async function getAsync(url:string){
    return new Promise<string>((res, rej)=>{
        NodeHttp.get(url, rs=>{
            let body = '';
            rs.on('data', chunk => body += chunk)
            rs.on('end', () =>res(body))
            rs.on('error', (e)=>rej(e))
        })
    })
}
