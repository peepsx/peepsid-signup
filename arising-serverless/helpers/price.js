'use strict';

const getJSON = require('get-json')
const Rsn = require('arisenjsv1')

const config_cmc = require('../config/coinmarketcap.js')
const config_master = require('../config/master.js')

const config_rsn = require('../config/arisen.js')
const rsn = Rsn(config_rsn)

// a method that retrieves the price of the service.
function getPrice(callback) {

    var getJSON = require('get-json')

    getJSON(config_cmc.httpEndpoint, function(err,market){

        if(err) {
            // unable to retrieve market data for RIX.
            callback(config_master.fallbackPricing)
        }

        // get ram price.
        rsn.getTableRows(true, 'arisen', 'arisen', 'rammarket', 'id', 0, -1, 1)
            .then((ramdata) => {

                // get ram price in RIX.
                let ramtable = ramdata.rows[0]
                let base = ramtable['base']['balance'].split(' ')[0]
                let quote = ramtable['quote']['balance'].split(' ')[0]
                let ramprice_in_rsn = 1024 * parseFloat(quote)/parseFloat(base)

                // get RIX price in USD
                let { price } = market.data.quotes.USD;

                // service price calculated via:
                // ((3*ramprice_in_rix)*price) + (0.02*price)
                // 3kb + 0.02rix are sent to owner as part of purchase.
                let total_price = Math.ceil((3*ramprice_in_rsn)*price) +
                Math.ceil(0.02*price)


                // also calculate the price for extra stake (0.10RIX)
                let extra_stake = Math.ceil((price * config_master.extraStake))

                callback(total_price,extra_stake)
            })
            .catch((error) => {
                // unable to retrieve market data for RAM.
                callback(config_master.fallbackPricing,config_master.fallbackPricing)
            })

        //res.status(200).json({success: true, market}) market contains ether price.
    })

}

module.exports = getPrice;
