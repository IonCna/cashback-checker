import config from "./config.json" assert { type: "json" }

const {
    HALF_PERCENT,
    MAX_DECIMALS,
    MULTIPLIER,
    ALL_MONEY,
    COINS
} = config

const ERRORS = {
    NOT_VALID: "Numero no valido",
    NEGATIVE_NUMBER: "No puedes pagar con dinero negativo... ¿o si? 🤔",
    INSUFFICIENT_MONEY: "No te alcanza, pídele al backero"
}

var resultShowed = false

/**
 * showCash hace render de los resultados obtenidos
 * @param { number | null } cash 
 * @param { string } id
 * @param {{ message: string }} options
 */

function showCash(cash, id, options) {
    const domElement = document.querySelector(id)
    const { message } = options
    domElement.innerHTML = `${message} ${cash ? cash : ""}`
}

/**
 * randomize genera un numero pseudo-procedural
 * tiene el 50% de posibilidades de agregarte un decimal
 * @param { number } multiplier 
 * @param { { withDecimal: boolean } } options
 * @returns { number }
 */

function randomize(multiplier, options) {
    const { withDecimal } = options

    let decimalAdded = undefined

    if (withDecimal) {
        // probabilidad de agregarle al monto total números decimales
        const PERCENT_DECIMAL_MULTIPLIER = Math.random()

        if (PERCENT_DECIMAL_MULTIPLIER < HALF_PERCENT) {
            decimalAdded = Math.random().toFixed(MAX_DECIMALS)
            decimalAdded = parseFloat(decimalAdded)
        }
    }

    // generar numero aleatorio y multiplicarlo por mi multiplicador de precio
    // después si existe el numero decimal sumarlo al valor total
    const number = Math.round(Math.random() * multiplier)

    return decimalAdded ? number + decimalAdded : number
}

/**
 * 
 * @param { string } message 
 */

function showError(message) {
    Swal.fire(message)
}

/**
 * getCashback te retorna las monedas en cambio que te debe de dar, como parámetro recibe un número
 * y te regresa el cambio con las monedas pre definidas arriba de este script
 * @param { number } total 
 * @param { number } userPay
 */

function getCashback(total, userPay) {
    console.clear()
    let cashback = parseFloat((userPay - total).toFixed(MAX_DECIMALS))
    const reverseMoney = ALL_MONEY.reverse()

    showCash(cashback, "#cashback", { message: "Su cambio es de:" })

    const DOLLARS = []

    let index = 0

    do {
        const value = reverseMoney[index]

        if(cashback - value >= 0) {
            cashback -= value
            DOLLARS.push(value)
        } else index++

        if(index > reverseMoney.length) break
    } while (cashback >= COINS.FIFTY_CENTS)

    console.log(DOLLARS)
    resultShowed = true

    let cashbackMessage = "Le dieron su cambio con: <br>"
    let counter = 1

    for (let i = 0; i < DOLLARS.length; i++) {
        const item = DOLLARS[i];

        if(DOLLARS[i + 1] == item) {
            counter++

            let message = ""

            item <= COINS.TEN 
                ? message = `${counter} monedas de ${item} <br>`
                : message = `${counter} billetes de ${item} <br>`

            cashbackMessage += message
        } else {
            counter = 1

            let message = ""

            item <= COINS.TEN 
                ? message = `${counter} moneda de $${item} <br>`
                : message = `${counter} billete de $${item} <br>`

            cashbackMessage += message
        }
    }

    showCash(null, "#resume", { message: cashbackMessage })
}

// INICIA EL EL SCRIPT \\

const totalToPay = randomize(MULTIPLIER, { withDecimal: true })
showCash(totalToPay, "#totalToPay", { message: "El monto total a pagar es:" })

const payDOM = document.querySelector("#pay")
if (!payDOM) throw new Error("#pay doesn't exist")

payDOM.addEventListener("click", () => {
    const userInput = document.querySelector("#userInput")
    if (!userInput) throw new Error("#userInput doesn't exist")

    let userPay = userInput.value

    // si no existe el valor Y si el valor es menor o igual a 0 ERROR
    if (!userPay && userPay <= 0) return showError(ERRORS.NOT_VALID)
    if (userPay < 0) return showError(ERRORS.NEGATIVE_NUMBER)
    if (userPay < totalToPay || userPay == 0) return showError(ERRORS.INSUFFICIENT_MONEY)

    try {
        userPay = parseFloat(userPay)
        if(resultShowed) return showError("Ya le dieron su cambio")

        getCashback(totalToPay, userPay)
    } catch (error) {
        console.error("No se pudo pasar el numero a flotante")
    }
})

/**

Estructura de datos Ejercicio fácil para Max y los que quieran usarlo, tienen que explicar como lo hicieron y porque lo hicieron así

Problemática

El señor David tiene un empleado en su tienda pero este empleado le cuesta mucho trabajo devolver el cambio al realizar una venta
En el ejercicio tienes que registrar con cuanto dinero le entregaron la caja registrando el dinero a registrar es billetes de 
(20,50,100,200 y 500) y monedas de (0.50,1.2.5 y 10) 
Realizar venta Registrar el monto vendido 
Con cuanto pago el cliente 
Al regresar el cambio notificar El monto total y con que billetes y monedas tiene que entregar el cambio, 
Haciendo las validaciones pertinentes para que le sistema funcione
Detonar alertas de error o de satisfacción según sea el caso
ejemplo de validaciones
entrada de datos
Validad cantidad de dinero al devolver cambio

--------------------------------------------------------------------------

Ejemplo 1

10 billetes de $20 = $200

5 billetes de $50 = $250

10 billetes de $100 = $1000

10 billetes de $200 = $2000

... etc

Venta 

Vendido un total de $230

Pago con un billete de $500 

El cambio es de 270

Entrega 

2 billetes de 100 

1 billete de 50 

1 billete de 20
 

-----------------------------------------------------------------

Ejemplo 2

10 billetes de $20 = $200

5 billetes de $50 = $250

0 billetes de $100 = $0

10 billetes de $200 = $2000

... etc

Venta 

Vendido un total de $230

Pago con un billete de $500 

El cambio es de 270

Entrega 

5 billetes de 50

1 billete de 20

 */