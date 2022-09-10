
const { getAllFilesInDirectory, getQueryParamsAsObject, getRequestBody, sendResponse } = require('./helper/utils');
const declaredPaths = [];
const rootPath = __dirname;

// const directories = getDirectories(rootPath);
const routeDirectoryPath = rootPath+'/app/routes';
const routeFiles = getAllFilesInDirectory(routeDirectoryPath);

async function resolveApiPath(req,cb) {
    try {
        let url = req.url;
        let method = req.method;
        let query = {};
        if(url.includes('?')) {
            query = getQueryParamsAsObject(url);
            url = url.split('?')[0];
        }
        let hasFound = false;
        for(let file of routeFiles) {
            if(hasFound) break;
            let fileArr = file.split('.');
            if(fileArr[fileArr.length-1] == 'js') {
                let filePath = require(routeDirectoryPath+'/'+file);
                if(filePath && filePath.paths && filePath.paths.length) {
                    for(let obj of filePath.paths) {
                        if(obj.path && obj.path.includes(':')) {
                            let currPathArr = obj.path.split(':');
                            let absolutePath = currPathArr.shift();
                            if(url.includes(absolutePath) && method === obj.method) {
                                let params = {};
                                let dynamicValueArr = url.split('/').reverse();
                                currPathArr = currPathArr.reverse();
                                currPathArr.forEach((key,i) => {
                                    if(key.includes('/')) key = key.replace(/\//g,'');
                                    params[key] = dynamicValueArr[i];
                                })
                                let body = await getRequestBody(req);
                                let ob = {query,params,body, controller:obj.controller}
                                hasFound = true;
                                cb(ob);
                                break;
                            }
                        } else {
                            if(url === obj.path && method === obj.method) {
                                let body = await getRequestBody(req);
                                let ob = {query,body, ...obj,params: {}, controller:obj.controller}
                                hasFound = true;
                                cb(ob);
                                break;
                            }
                        }
                    }
                }
            }
        }
        if(!hasFound) cb(false);
    } catch (error) {
        console.error(error);
        return sendResponse(res,500,{status: 0, message:"Something Went Wrong!!" });
    }

}

function apiRoutes() {
    let i = 0;
    for(let file of routeFiles) {
        let fileArr = file.split('.');
        if(fileArr[fileArr.length-1] == 'js') {
            let filePath = require(routeDirectoryPath+'/'+file);
            if(filePath && filePath.paths && filePath.paths.length) {
                for(let obj of filePath.paths) {
                    declaredPaths.push({path:obj.path,method:obj.method,id:i});
                    i = i + 1;
                }
            }
        }
    }
    verifyDeclaredFiles();
}

function verifyDeclaredFiles() {
    let hasSimilarRoutes = false;
    let route;
    for(let level1 of declaredPaths) {
        if(hasSimilarRoutes) break;
        for(let level2 of declaredPaths) {
            if(level2.id != level1.id && level2.path === level1.path && level2.method === level1.method) {
                console.log(level1)
                console.log(level2)
                hasSimilarRoutes = true;
                route = `${level1.method} - ${level1.path}`;
                break;
            } 
        }
    }
    if(hasSimilarRoutes) throw new Error('CAN NOT HAVE SAME ROUTES IN A SINGLE API ===> '+ route);
}

module.exports = {
    resolveApiPath,
    apiRoutes
}
