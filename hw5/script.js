//ДЗ заглушка


const http = require('http'),
    url = require('url')

http.createServer((request, respons) => {
    if (request.method === 'GET') {
        const queryParams = url.parse(request.url, true).query

    } else  respons.end('metod not alloyed')
    respons.setHeader('Content-Type', 'text/html')
    console.log(request.url)
    console.log(request.method)
    console.log(JSON.stringify(request.headers))
    respons.write("sasda")
    respons.end('Hello world')
}).listen(3000, 'localhost')