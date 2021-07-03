const colors = require('colors/safe')
const firstNumber = process.argv[2]
const secondNumber = process.argv[3]

if (isNaN(firstNumber) || isNaN(secondNumber) || firstNumber === secondNumber) {
    console.log(colors.red('Введите два числа, они должы быть разными'))
} else {
    const simpleNumbers = getPrimeNumbers (firstNumber, secondNumber)
    logWithColors(simpleNumbers)
}

function getPrimeNumbers (firstNumber, secondNumber) {
    let array = []
    const min = firstNumber < secondNumber ? firstNumber : secondNumber
    const max = firstNumber > secondNumber ? firstNumber : secondNumber

    for (let i = min; i <= max; i++) {
        if (isPrime(i)) array.push(i)
    }
    return array
}

function isPrime(num) {
    for(let i = 2; i < num; i++)
        if(num % i === 0) return false;
    return num > 1;
}

function logWithColors(numbers) {
    let i = 1
    numbers.forEach((number) => {
        switch (i) {
            case 1: console.log(colors.green(number)); break
            case 2: console.log(colors.yellow(number)); break
            case 3: console.log(colors.red(number))
                    i =0; break
        }
        i++
    })
}