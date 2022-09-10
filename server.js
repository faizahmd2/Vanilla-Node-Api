const http = require('http');
const { sendResponse } = require('./helper/utils');
const { resolveApiPath, apiRoutes } = require('./routes');
const constants = require('./constants.js');

// http.IncomingMessage
const server = http.createServer((req, res) => {
    let requestValidation = req.headers['api-access-code'] === constants.API_ACCESS_KEY;

    if(!requestValidation) {
        return sendResponse(res,404,{status: 0, message:"Please provide Valid access token to get result" });
    }

    if(req.url === '/') {
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

const PORT = 8602;

server.listen(PORT, ()=> {console.log(`Server is Listening On the PORT ${PORT}`)});