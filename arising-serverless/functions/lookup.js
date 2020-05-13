const Rsn = require('arisenjsv1')
const config_arisen = require('../config/arisen.js')
const arisen = Rsn(config_arisen)

function lookup(req,res) {
    let { account } = req.params
    arisen.getAccount(account)
        .then((details) => {
          res.status(200).json({success: true, account, details})
        })
        .catch((error) => {
          console.log(error)
          res.status(404).json({success: false, account, error: "Account not found"})
        })
}

module.exports = lookup
