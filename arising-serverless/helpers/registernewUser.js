// a method that registers an account name on the RIX network.
const Rsn = require('arisenjsv1')
const axios = require('axios');
const  { Apis } = require('bitsharesjs-ws');
const config_rsn = require('../config/arisen.js')
const config_master = require('../config/master.js')
const rsn = Rsn(config_rsn)

function register(req, res) {
  console.log("REGISTER ACCOUNT STARTED")
  
    let { account, owner, active } = req.params;

    if(!account || !owner || !active) return res.status(401).send({
        success: false,
        message: `Fields are missing${account}${owner}${active}`
      })
    
    // if there is a + in the account name, stake extra CPU/NET.
    let shouldStakeExtra = Boolean(account.indexOf("+") > 1)
    let stakeAmt = shouldStakeExtra ? '0.0600 RIX' : '0.0100 RIX'

    // remove the plus+ in the account name (if it was added).
    account = account.replace("+","")

    rsn.transaction(tr => {
        tr.newaccount({
          creator: config_rsn.creatorAccountName,
          name: account,
          owner: owner,
          active: active
        })
        tr.buyrambytes({
          payer: config_rsn.creatorAccountName,
          receiver: account,
          bytes: 5000
        })
        tr.delegatebw({
          from: config_rsn.creatorAccountName,
          receiver: account,
          stake_net_quantity: stakeAmt,
          stake_cpu_quantity: stakeAmt,
          transfer: 1
        })
    }).then((data) => {
        console.log("NEW ARISEN NAME REGISTERED")
        console.log(data)
        res.status(200).send({
          success: true,
          data
        })
      }).catch((e) => {
        let error = JSON.stringify(e);
        console.log("ARISEN REGISTRATION FAILURE")
        console.log(error)
        return res.status(401).json({
          success: false,
          message: `Something went wrong${e}`
        })
        // callback(false)
    })
}

    function getRsnPrice(req, res) {
            try {
              axios.get('https://cryptofresh.com/api/asset/markets?asset=RSN')
              .then((price) => {
                  if(price) {
                    return res.status(200).send({
                      success: true,
                      data: price.data
                    })
                  }
              })
            } catch (e) {
              return res.status(401).send({
                success: false,
                message: 'Something went wrong'
              })
            }
    }

    function getRsnPriceFromBTSNode(req, res) {
      Apis.instance("wss://bitshares.openledger.info/ws", true).init_promise.then(() => {

          Apis.instance().db_api().exec("get_ticker", ["USD", "RSN"])
          .then(price => {
            let strify = json = JSON.parse(JSON.stringify(price).split('"latest":').join('"price":'));
              return res.status(200).send({
                success: true,
                data: {"USD": strify}
              })
          })
          .catch(err => {
            res.status(401).send({
              success: false,
              message: 'Something went wrong'
            })
          })
      })
    }

    module.exports = {
    register,
    getRsnPrice,
    getRsnPriceFromBTSNode
  };
