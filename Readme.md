## This is a NFT boilerplate

### How to use

### Steps

1. Install dependencies `yarn`
2. create a .env file in `packages/hardhat` folder, filling the variables as .env.example suggests
3. register environment variables. `cd packages/harhdat && source .env`
4. modify your contract, then run `yarn hardhat deploy`
5. copy your whitelist to `whitelist/whitelist.txt`
6. sign your whitelist `yarn sign-whitelist` , or `yarn sign-whitelist --network <YOUR_NETWORK>`
7. `yarn start` to start frontend
