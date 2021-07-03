const colors = require('colors/safe')
const firstNumber = process.argv[2]
const secondNumber = process.argv[3]

if (isNaN(firstNumber) || isNaN(secondNumber)) {
    console.log(colors.red('Введите два числа, хотя бы одно введенное значение не является числом'))
} else {
    const simpleNumbers = getPrimeNumbers(firstNumber, secondNumber)
    if (simpleNumbers.length === 0) console.log(colors.red('В выбранный диапазон не попало ни одного простого числа'))
    else logWithColors(simpleNumbers)
}

function getPrimeNumbers(firstNumber, secondNumber) {
    let array = []
    const min = firstNumber < secondNumber ? firstNumber : secondNumber
    const max = firstNumber > secondNumber ? firstNumber : secondNumber

    for (let i = min; i <= max; i++) {
        if (isPrime(i)) array.push(i)
    }
    return array
}

function isPrime(num) {
    for (let i = 2; i < num; i++)
        if (num % i === 0) return false;
    return num > 1;
}

function logWithColors(numbers) {
    let i = 1
    numbers.forEach((number) => {
        switch (i) {
            case 1:
                console.log(colors.green(number));
                break
            case 2:
                console.log(colors.yellow(number));
                break
            default:
                console.log(colors.red(number))
                i = 0
        }
        i++
    })
}