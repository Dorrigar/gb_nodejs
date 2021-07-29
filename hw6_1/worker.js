const {workerData, parentPort} = require('worker_threads'),
    fs = require('fs')

returnFileValueByQuery(workerData)

function returnFileValueByQuery(filePath) {
    let readStream = fs.createReadStream(filePath, 'utf8'),
        result = ""

    readStream.on('data', chunk => {
        console.log("Chunk")

        result += chunk.split('\n').join('<br>').toString()
    })

    readStream.on('end', () => {
        parentPort.postMessage({result: result.toString()})
    })

    readStream.on('error', (err) => console.log('readStream Error:', err))
}