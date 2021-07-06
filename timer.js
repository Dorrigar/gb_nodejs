const colors = require('colors/safe')
const second = 1000 //для ускорения измените на 1
const inputParameters = process.argv

//исключаю первые параметры чтобы на них не срабатывала ошибка ввода
inputParameters.shift()
inputParameters.shift()

inputParameters.forEach((parameter, index) => {
    setTimeout(() => {
        let dateTime = parameter.split('-')

        if (checkFormat(dateTime)) {
            timer(dateTime, 'Timer N' + index)

        } else console.log(colors.red('Вводите параметры формы «секунды-часы-дни-месяцы-годы»'))
    }, 0)
})


function timer(dateTime, name) {
    console.log('Запуск таймера', name, ':', colors.yellow(timerMessage(dateTime)))
    clock()

    function clock() {
        setTimeout(() => {
            dateTime = minusSecond(dateTime)

            if (timerMessage(dateTime)) {
                console.log(colors.red(name), timerMessage(dateTime))
                clock(dateTime, name)
            } else console.log(colors.green(name + ' finished'))
        }, second)
    }
}

function minusSecond(dateTime) {
    if (dateTime) {
        if (dateTime[0] <= 0) {
            if (dateTime[1] && dateTime[1] <= 0) {
                if (dateTime[2] && dateTime[2] <= 0) {
                    if (dateTime[3] && dateTime[3] <= 0) {
                        if (dateTime[4] && dateTime[4] <= 0) {
                            if (dateTime[5] && dateTime[5] <= 0) {
                                return null
                            } else {
                                dateTime[5]--
                                dateTime[4] += 12
                            }
                        } else {
                            dateTime[4]--
                            dateTime[3] += 30
                        }
                    } else {
                        dateTime[3]--
                        dateTime[2] += 24
                    }
                } else {
                    dateTime[2]--
                    dateTime[1] += 60
                }
            } else {
                dateTime[1]--
                dateTime[0] += 60
            }
        } else dateTime[0]--
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