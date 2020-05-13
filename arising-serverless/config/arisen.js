'use strict';

var keys = require('./keys')

module.exports = {
    chainId: '136ce1b8190928711b8bb50fcae6c22fb620fd2c340d760873cf8f7ec3aba2b3', // 32 byte (64 char) hex string
    keyProvider: keys.rsn_pk, // WIF string or array of keys..
    httpEndpoint: 'https://greatchains.arisennodes.io',
    expireInSeconds: 60,
    broadcast: true,
    authorization: 'peeps' + '@active',
    debug: true, // API activity
    sign: true,
    creatorAccountName: 'peeps'
}