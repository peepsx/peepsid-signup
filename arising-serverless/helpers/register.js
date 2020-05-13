// a method that registers an account name on the RIX network.
const Rsn = require('arisenjsv1')
const config_rsn = require('../config/arisen.js')
const config_master = require('../config/master.js')
const rsn = Rsn(config_rsn)

function register(newAccountName,newOwnerKey,newActiveKey,callback) {
    console.log("REGISTER ACCOUNT STARTED")

    // if there is a + in the account name, stake extra CPU/NET.
    let shouldStakeExtra = Boolean(newAccountName.indexOf("+") > 1)
    let stakeAmt = shouldStakeExtra ? '0.0600 RIX' : '0.0100 RIX'

    // remove the plus+ in the account name (if it was added).
    newAccountName = newAccountName.replace("+","")

    rsn.transaction(tr => {
        tr.newaccount({
          creator: config_rsn.creatorAccountName,
          name: newAccountName,
          owner: newOwnerKey,
          active: newActiveKey
        })
        tr.buyrambytes({
          payer: config_rsn.creatorAccountName,
          receiver: newAccountName,
          bytes: 2500
        })
        tr.delegatebw({
          from: config_rsn.creatorAccountName,
          receiver: newAccountName,
          stake_net_quantity: stakeAmt,
          stake_cpu_quantity: stakeAmt,
          transfer: 1
        })
    }).then((data) => {
        console.log("NEW ARISEN NAME REGISTERED")
        console.log(data)
        callback(true)
    }).catch((e) => {
        let error = JSON.stringify(e);
        console.log("ARISEN REGISTRATION FAILURE")
        console.log(error)
        callback(false)
    })
}

module.exports = register;
