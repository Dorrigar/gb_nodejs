const cluster = require('cluster'),
    os = require('os'),
    http = require('http'),
    fs = require("fs"),
    path = require("path"),
    yargs = require('yargs'),
    readline = require("readline"),
    inquirer = require("inquirer"),
    url = require('url')

const PORT = 3000,
    hostName = 'localhost',
    baseUrl = `http://${hostName}:${PORT}/`


// const numCPUs = os.cpus().length;
//
// if (cluster.isMaster) {
//     console.log(`Master ${process.pid} is running`);
//
//     for (let i = 0; i < numCPUs; i++) {
//         console.log(`Forking process number ${i}...`);
//         cluster.fork();
//     }
// } else {
console.log(`Worker ${process.pid} started...`)

http.createServer((request, response) => {
    console.log(`Worker ${process.pid} handle this request...`);

    switch (request.method) {
        case "GET": {
            const requestURL = url.parse(request.url, true)
            //urlParts = requestURL.split('/')
            let folderPath = requestURL.query.path || __dirname

            console.log("folderPath", folderPath)
            const body = !isFile(folderPath) ? generaleListLinks(folderPath) : readFile(folderPath)

            console.log("isFile", isFile(folderPath))
            //const folderPath = path.join(__dirname, request.url)
            //const htmlPath = path.join(__dirname, 'index.html');

            if (folderPath) {
                console.log("12")
            }   else console.log("21")
            //fileRequest(folderPath)
            // Создаем объект потока на чтение файла
            //let readStream = fs.createReadStream(htmlPath);
            //console.log(readStream)

            console.log(body)
                // В заголовке указываем тип контента html
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(body)
            // Направляем потока на чтение файла в потока на запись (поток ответа)
            // readStream.pipe(response)
        } break
        default: {
            response.statusCode = 405;
            response.end();
        }
    }
}).listen(PORT, hostName);
// }


// Используйте наработки из домашнего задания прошлого урока для того, чтобы создать веб-версию приложения. При запуске она должна:
// * Показывать содержимое текущей директории;
// * Давать возможность навигации по каталогам из исходной папки;
// * При выборе файла показывать его содержимое.

function generaleListLinks(folderPath) {
    const list = fs.readdirSync(folderPath)
    list.unshift("..")

    let result = "<ui>"
        list.forEach((element) => {
            const filePath = path.join(folderPath, element)
            result += `<li><a href=\"${baseUrl}api/file${filePath}\">${element}</a></li>`
        })
        result += "</ui>"
    return result
}

function readFile(filePath) {

    fs.readFile(filePath, 'utf8', (err, data) => {
        return data
    })
}
// function fileRequest(folderPath) {
//     let list = fs.readdirSync(folderPath)
//     list.unshift("..")
//
//     isFile(folderPath) ? readFile(folderPath) : fileRequest(folderPath)
// }

function isFile(filePath) {
    return fs.lstatSync(filePath).isFile()
}


