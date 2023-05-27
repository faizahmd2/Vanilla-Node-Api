const fs = require('fs');

var helper = {
    sendResponse: (res,statusCode,response,headers) => {
        let header = {'Content-Type': 'application/json'};
        if(headers) {
            header = Object.assign(header,headers);
        }
        res.writeHead(statusCode,header);
        res.end(JSON.stringify(response));
    },
    writeDataToFile: (filename,content) => {
        let path = './data/'+ filename;
        fs.writeFileSync(path,JSON.stringify(content),'utf8', (err) => {
            if(err) console.log(err)
        });
    },
    getRequestBody: (req) => {
        return new Promise((resolve, reject) => {
            try {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                })

                req.on('end', ()=> {
                    if(body == '') {
                        resolve({});
                    } else {
                        resolve(JSON.parse(body));
                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    },
    getDirectories: (directoryPath) => {
        return fs.readdirSync(directoryPath).filter(function (file) {
            return fs.statSync(directoryPath+'/'+file).isDirectory();
          });
    },
    getAllFilesInDirectory: (directoryPath) => {
        return fs.readdirSync(directoryPath).filter(function (file) {
            return fs.statSync(directoryPath+'/'+file).isFile();
        });
    },
    getQueryParamsAsObject: (query) => {
        if(query.indexOf('?') == -1) {
            return {}
        }
        query = query.substring(query.indexOf('?') + 1);
    
        var re = /([^&=]+)=?([^&]*)/g;
        var decodeRE = /\+/g;
    
        var decode = function (str) {
            return decodeURIComponent(str.replace(decodeRE, " "));
        };
    
        var params = {}, e;
        while (e = re.exec(query)) {
            var k = decode(e[1]), v = decode(e[2]);
            if (k.substring(k.length - 2) === '[]') {
                k = k.substring(0, k.length - 2);
                (params[k] || (params[k] = [])).push(v);
            }
            else params[k] = v;
        }
    
        var assign = function (obj, keyPath, value) {
            var lastKeyIndex = keyPath.length - 1;
            for (var i = 0; i < lastKeyIndex; ++i) {
                var key = keyPath[i];
                if (!(key in obj))
                    obj[key] = {}
                obj = obj[key];
            }
            obj[keyPath[lastKeyIndex]] = value;
        }
    
        for (var prop in params) {
            var structure = prop.split('[');
            if (structure.length > 1) {
                var levels = [];
                structure.forEach(function (item, i) {
                    var key = item.replace(/[?[\]\\ ]/g, '');
                    levels.push(key);
                });
                assign(params, levels, params[prop]);
                delete(params[prop]);
            }
        }
        return params;
    },
    getUniqueId() {
        const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
        const randomText = Math.random().toString(36).substring(2); // Generate random text
      
        return timestamp + randomText;
    }

}


module.exports = helper
