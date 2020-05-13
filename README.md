#Arising.io

## What is Arising?
name**vault**.co is a fast and user friendly account creator for the Arisen blockchain.
>Try it here: https://arising.io/

- No existing Arisen account or wallet required.
- Generate *quality* names with the `Random Name` feature.
- Search any name and pay with coinbase in just 60 seconds!

## What is an Arisen account?

> An account is a human-readable name that is stored on the blockchain. It can be owned by an individual or group of individuals depending on permissions configuration. An account is required to transfer or otherwise push a transaction to the blockchain.

Continue Reading Here: https://developers.arisen.network


## Project Hierarchy
The arising.io repo is broken into (2) separate projects (each running independently and in a separate environment)
- `arising-serverless`: Serverless framework functions that interacts with the Arisen blockchain (running on AWS Lambda)
- `arising-react` React webapp that interacts with the *arising-serverless* endpoints (running on Github Pages)

## Clone Repo
Before installation, please ensure that you have the latest version of `node`, `git`, and `serverless` on your local machine. You also need an `Amazon AWS` account.

Then the arising.io repo
```
git clone https://github.com/arisenio/arising.io.git
```

## Key Installation
To accept payments & automatically generate new accounts you'll need to install your own keys. **At the very least, You must copy keys_ex.js to keys.js in order for the project to work.**

```
cp arising-serverless/config/keys_ex.js arising-serverless/config/keys.js
```

Once you've made a copy of the file replace the sample keys in `keys.js` with your own.
```
module.exports = {
    rsn_pk: '5Jd2hhQiASBiDj23kqfsgopTozqNsYVfma2a2a6zhMNysafRClQ7E8KQ',
    coinbase_api: '235235asg-fas3-fasg-v3gs-agas3tasggj',
    coinbase_secret: '44c2f436-6713-4b37-8ab5-b41870d174a1'
};
```
- The `rsn_pk` is your Arisen private key with staked CPU & bandwidth, along with enough RSN to cover the transaction for a new account.
- The `coinbase_api` and `coinbase_secret` are available to you once you make a coinbase commerce account (for accepting payments). https://commerce.coinbase.com/

## Quick Setup
Switch into the `arising-serverless` directory and deploy the lambda functions.
```
cd arising.io/arising-serverless
sls deploy
```

After serverless has run, you'll receive a deployed endpoint. **Save this URL.**
```
endpoints:
  ANY - https://per2fl18lo.execute-api.us-east-1.amazonaws.com/dev/
```

Switch into the `arising-react` directory and open the file `src/config/Master`
```
cd ../arising-react
code src/config/Master.js
```

Replace the existing `httpEndpoint` value with the serverless deployed endpoint you received earlier.
```
httpEndpoint: 'https://kfj0fl66oh.execute-api.us-east-1.amazonaws.com/dev'
```

You can either start the software (while inside the `arising-react` folder) locally on your machine by running `npm run start` or for deployment elsewhere by running `npm run build`.
