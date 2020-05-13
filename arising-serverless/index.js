const serverless = require('serverless-http')
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require("body-parser");

// parse body for json.
app.use(bodyParser.json());
// middleware for Access-Control-Allow-Origin
app.use(cors())

// -------------------------

const paidFunction = require('./functions/paid.js')
const checkoutFunction = require('./functions/checkout.js')
const lookupFunction = require('./functions/lookup.js')
const priceFunction = require('./functions/price.js')
const wordFunction = require('./functions/word.js')
const {
    getRsnPrice,
    register,
    getRsnPriceFromBTSNode
} = require('./helpers/registernewUser')
// const newuserregister = require('./helpers/register') 
// welcome message.
app.get('/', function (req, res) { res.send('arising.io says hi') })

// generate random account
app.get('/word/:baseWord?', wordFunction)

// get the current service price.
app.get('/price', priceFunction)

// perform an account availability lookup.
app.get('/lookup/:account', lookupFunction)

// create a payment checkout endpoint.
app.get('/checkout/:account/:owner/:active?', checkoutFunction)

// payment callback, after payment
app.post('/paid', paidFunction)

/** REGISTER ON ARISEN BLOCKCHAIN */
// app.get('/register', newuserregister)

/**  REGISTER USER ON ARISEN FOR TESTING*/
app.get('/newuser/:account/:owner/:active?', register)
app.get('/get_arisen_price', getRsnPrice)
app.get('/rsn_price_from_bts', getRsnPriceFromBTSNode)
module.exports.handler = serverless(app);
