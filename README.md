# PeepsID Signup System
This is the source for the PeepsID signup system, found at [https://signup.peepsid.com](https://signup.peepsid.com).

## What Is This?
A PeepsID is simply an [ARISEN](https://arisen.network) blockchain account. The PeepsID signup system is a fast and user-friendly account creator for the ARISEN blockchain and dWeb-based applications, especially those created by Peeps (dSocial, etc.).

- No existing ARISEN account or wallet is required
- Generate quality names with the `Random Name` feature
- Search any name and pay with CoinBase in just 60 seconds

## What Is An ARISEN Account?
An account is a human-readable name that is stored on the blockchain. It can be owned by an individual or hroup of individuals depending on how the account's permissions are configured. An account is required to transfer or otherwise push a transaction to a blockchain.

## Project Hierarchy
The `peepsid-signup` repo is broken into (2) separate projects (each running independently and in a separate environment)
- `arising-serverless` : Serverless framework functions that interacts with the ARISEN blockchain (running on AWS Lambda)
- `arising-react`: React webapp that interacts with the `peepsid-serverless` endpoints (running on GitHub Pages)

## Installation Instructions
1. Before installation, please ensure that you have the latest version of `node`, `git`, and `serverless` on your local machine. You also need an `Amazon AWS` account.

2. Clone this repo:
`git clone https://github.com/peepsx/peepsid-signup-service`

3. To accept payments and automatically generate new accounts, you'll need to install your own keys. At the very least, you must copy `keys_ex.js` in order for the project to work.

```
cp arising-serverless/config/keys_ex.js arising-serverless/config.keys.js
```

4. Once you've made a copy of the `keys_ex.js` file, replace the same keys in `keys.js`, with your own.
```
module.exports = {
  rsn_pk: '',
  coinbase_api: '',
  coinbase_secret: ''
};
```

- The `rsn_pk` is your ARISEN private key with the staked CPU and bandwidth, balong with enough RIX to cover the transaction for a new account.
- The `coinbase_api` and `coinbase_secret` are available to you once you make a Coinbase Commerce account (for accepting crypto payments).

5. Switch into the `peepsid-serverless` directory and deploy the lambda functions
```
cd peepsid-signup-service/arising-serverless
sls deploy
```

6. After serverless has run, you'll receive a deployed endpoint. Save this URL.

```
endpoints:
  ANY - ...
```

7. Switch into the `peepsid-react` directory and open the file `src/config/Master`
```
cd ../arising-react
code src/config/Master.js
```

8. Replace the existing `httpEndpoint` value with the serverless deployed endpoint from #6.
```
httpEndpoint: ...
``` 

9. You can either start the software (while inside the `peepsid-react` folder) locally on your machine by running `npm run start` or for deployment elsewhere by running `npm run build`. 


## LICENSE
[MIT](LICENSE.md)

## COPYRIGHT
Copyright 2020 Peeps Labs. All rights reserved.
