const fs = require("fs"),
    os = require("os"),
    http = require('http'),
    path = require("path"),
    url = require('url'),
    cluster = require('cluster');

const PORT = 3000,
    hostName = 'localhost',
    baseUrl = `http://${hostName}:${PORT}/`,
    numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        console.log(`Forking process number ${i}...`);
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} started...`)

    http.createServer((request, response) => {
        console.log(`Worker ${process.pid} handle this request...`)

        switch (request.method) {
            case "GET": {
                const folderPath = url.parse(request.url, true).query.path || __dirname,
                    itsFile = isFile(folderPath)
                console.log("Path ", folderPath, " it's file? ", itsFile)

                if (itsFile) {
                    console.log("Response file content...")

                    const readStream = fs.createReadStream(folderPath)
                    readStream.setEncoding('utf8') // остались проблемы с кириллицей
                    response.writeHead(200, {'Content-Type': 'text/text'})
                    readStream.pipe(response)
                } else {
                    console.log("Response files in folder...")

                    response.writeHead(200, {'Content-Type': 'text/html'})
                    response.end(generaleListLinks(folderPath))
                }
            }
                break
            default: {
                response.statusCode = 405;
                response.end();
            }
        }
    }).listen(PORT, hostName);
}

function generaleListLinks(folderPath) {
    const list = fs.readdirSync(folderPath)
    list.unshift("..")

    let result = "<ui>"
    list.forEach((element) => {
        const filePath = path.join(folderPath, element)
        result += `<li><a href=\"${baseUrl}api/?path=${filePath}\">${element}</a></li>`
    })
    result += "</ui>"
    return result
}

function isFile(filePath) {
    return fs.lstatSync(filePath).isFile()
}


