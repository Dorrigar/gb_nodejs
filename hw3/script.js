const fs = require('fs'),
    path = require('path'),
    ips = ['89.123.1.41', '34.48.240.111'],
    readStream = fs.createReadStream(path.join(__dirname, 'access.log'), 'utf8')

let lastInChunk = '',
    writeStreamMap = new Map()
ips.forEach((ip) => writeStreamMap.set(ip, fs.createWriteStream(path.join(__dirname, ip + '_requests.log'), {
    flags: 'a',
    encoding: "utf8"
})))

readStream.on('data', chunk => {
    console.log("Chunk")

    //Добавляем последнюю обрезанную строку в начало нового блока
    if (lastInChunk && lastInChunk !== '') {
        chunk += lastInChunk
        lastInChunk = ''
    }

    //Убираем последнюю строку, так как она может быть не полной
    const chunkList = chunk.split('\n')
    lastInChunk = chunkList[chunkList.length - 1]
    chunkList.pop()

    //для каждого ip находим нужное и записываем в его файл
    writeStreamMap.forEach((writeStream, ip) => {
        const result = chunkList.filter((value) => {
            return value.includes(ip)
        })
        writeStream.write(result.join('\n').toString() + "\n")
    })

    // для обработки
    // readStream.close()
})


// Завершение работы
readStream.on('end', () => {

    writeStreamMap.forEach((writeStream, ip) => {
        if (lastInChunk && lastInChunk.includes(ip)) writeStream.write(lastInChunk)
        writeStream.close()
        writeStream.on('close', () => console.log())
    })
})


writeStreamMap.forEach((writeStream, ip) => {
    writeStream.on('close', () => console.log('File ' + ip + '_requests.log' + ' is Written!'))
    writeStream.on('error', (err) => console.log('writeStream ' + ip + ' Error:', err))
})
readStream.on('error', (err) => console.log('readStream Error:', err))