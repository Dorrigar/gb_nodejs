#!/usr/bin/env node

const fs = require("fs"),
    path = require("path"),
    yargs = require('yargs'),
    readline = require("readline"),
    inquirer = require("inquirer")

const options = yargs
        .usage('Usage: -p <path>')
        .option("p", {alias: "path", describe: "Path to file", type: "string", demandOption: false})
        .argv,

    folderPath = path.join(process.cwd(), options.path || "")

fileRequest(folderPath)

function fileRequest(folderPath) {
    if (isFile(folderPath)) readFile(folderPath)
    else {
        let list = fs.readdirSync(folderPath)
        list.unshift("..")

        inquirer
        .prompt([
            {
                name: "fileName",
                type: "list",
                message: "Choose file:",
                choices: list,
            },
        ])

            .then((answer) => {
                const filePath = path.join(folderPath, answer.fileName)
                isFile(filePath) ? readFile(filePath) : fileRequest(filePath)
            })
    }
}

function isFile(filePath) {
    return fs.lstatSync(filePath).isFile()
}

function readFile(filePath) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    rl.question("Укажите что вы хотите найти в документе: ", function (query) {
        logFilePartWithQuery(filePath, query)
        rl.close()
    })
}

function logFilePartWithQuery(filePath, query) {
    fs.readFile(filePath, 'utf8', (err, data) => {

        const lines = data.split('\n')
        const result = lines.filter((value) => {
            return value.includes(query)
        })
        console.log(result.join('\n'))
    })
}