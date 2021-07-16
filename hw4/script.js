//Дз заглушка

const fs = require('fs'),
    path = require('path')

const    yargs = require('yargs')

fs.readFile("./access.log","utf8", (err, data) => {
    console.log(data);
})

const options = yargs
    .usage("Usage: -p <path>")
    .option("p", { alias: "path", describe: "Path to file", type: "string", demandOption: true })
    .argv;

const filePath = path.join(__dirname, options.path);

console.log('log')


//Для этого превратите её в консольное приложение, по аналогии с разобранным примером и добавьте следующие функции:
// * Возможность передавать путь к директории в программу.
// Это актуально, когда вы не хотите покидать текущую директорию, но вам необходимо просмотреть файл,
// находящийся в другом месте;
// * В содержимом директории переходить во вложенные каталоги;
// * При чтении файлов искать в них заданную строку или паттерн.