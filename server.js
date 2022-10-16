const http = require('http');
const { sendResponse } = require('./helper/utils');
const { resolveApiPath, apiRoutes } = require('./routes');
const constants = require('./constants.js');

const server = http.createServer((req, res) => {
    // API Access Token Verify
    let u = req.url;
    if((u.split("/")[1] == 'v1' && req.headers['api-access-key'] == constants.apiKey) || (u.match(/apiKey=([^&]*)/) && u.match(/apiKey=([^&]*)/)[1] == constants.apiKey)) {} 
    else return sendResponse(res,404,{status: 0, message:"Please provide Valid API token" });

    if(u === '/v1' || u.split("?")[0] === '/') {
        return sendResponse(res,202,{status: 1, message:"API Is Working On Root Path" });
    }

    resolveApiPath(req,(data)=> {
        if(data) {
            req.params = data.params;
            req.query = data.query;
            req.body = data.body;
            return data.controller(req, res);
        } else {
            return sendResponse(res,404,{status: 0, message:"Invalid Path" });
        }
    })
})

apiRoutes();

server.listen(constants.PORT, ()=> {console.log(`Server is Listening On the PORT ${constants.PORT}`)});