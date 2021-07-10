const EventEmitter = require('events'),
    colors = require('colors/safe'),
    second = 1000, //для ускорения измените на 1
    inputParameters = process.argv?.slice(2)

let emitterObject = new EventEmitter(),
    proceed = []

inputParameters.forEach((parameter, index) => {
    let dateTime = parameter.split('-')
    const name = 'Timer N' + index
    proceed[index] = true
    console.log('Запуск таймера', name, ':', colors.yellow(timerMessage(dateTime)))

    if (checkFormat(dateTime)) {
        emitterObject.on('clock', () => {
            dateTime = minusSecond(dateTime)

            if (proceed[index] === true ) {
                if (timerMessage(dateTime)) {
                    console.log(colors.red(name), timerMessage(dateTime))
                } else {
                    proceed[index] = false
                    console.log(colors.green(name + ' finished'))
                }
            }
        })
    } else {
        proceed[index] = false
        console.log(colors.red('Вводите параметры формы «секунды-часы-дни-месяцы-годы»'))
    }
})

let interval = setInterval(() => {
    emitterObject.emit('clock')
    if (proceed.every((element) => { return element !== true })) clearInterval(interval)
}, second)

function minusSecond(dateTime) {
    if (dateTime) {
        if (dateTime[0] && dateTime[0] > 0) dateTime[0]--
        else if (dateTime[1] && dateTime[1] > 0) {
            dateTime[1]--
            dateTime[0] = 60
        } else if (dateTime[2] > 0) {
            dateTime[1]--
            dateTime[0] += 60
        } else if (dateTime[3] > 0) {
            dateTime[3]--
            dateTime[2] += 24
        } else if (dateTime[4] > 0) {
            dateTime[4]--
            dateTime[3] += 30
        } else if (dateTime[5] > 0) {
            dateTime[5]--
            dateTime[4] += 12
        } else dateTime = null
    }
    return dateTime
}

function checkFormat(array) {
    return Array.isArray(array) && array.every((element) => {
        return !isNaN(element)
    })
}

function timerMessage(dateTime) {
    let message = ''
    if (dateTime) {
        if (dateTime[0] > 0) message += dateTime[0] + ' секунд '
        if (dateTime[1] > 0) message += dateTime[1] + ' минут '
        if (dateTime[2] > 0) message += dateTime[2] + ' часов '
        if (dateTime[3] > 0) message += dateTime[3] + ' дней '
        if (dateTime[4] > 0) message += dateTime[4] + ' месяцев '
        if (dateTime[5] > 0) message += dateTime[5] + ' лет '
    }
    return message
}