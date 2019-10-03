const serverRoutes = {

}

function createRecurseRoutePaths(parts, routes){
	const part = parts.splice(0, 1)[0]
	if(!routes[part]){
		routes[part] = {
			handler: undefined,
			routes: {}
		}
	}
	if(parts.length > 0){
		return createRecurseRoutePaths(parts, routes[part].routes)
	}
	return routes[part]
}

function getRecurseRouteHandler(parts, routes, data = undefined){
	let part = parts.splice(0, 1)[0]
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
		return getRecurseRouteHandler(parts, routes[part].routes, urlData)
	}else{
		return {handler: routes[part].handler, data: urlData}
	}
}

function addRoute(route, handler){
	const parts = route.split('/').filter(Boolean)
	const path = createRecurseRoutePaths(parts, serverRoutes)
	path.handler = handler
}

function getHandler(url){
	const parts = url.split('/').filter(Boolean)
	let {handler, data} = getRecurseRouteHandler(parts, serverRoutes)

	if(handler){
		handler(data)
	}
}


addRoute("/all", d => console.log('request on all'))
addRoute("/image/{id}", d => console.log('id: ', d))
addRoute("/image/{id}/{action}", d => console.log('id: ', d))

getHandler("/all")
getHandler("/image/34")
getHandler("/image/34/delete")

console.log("serverRoutes:", serverRoutes)
