## This is a NFT boilerplate

### How to use

### Steps

1. Install dependencies `yarn`
2. create a .env file in `packages/hardhat` folder, filling the variables as .env.example suggests
3. register environment variables. `source package/hardhat/.env`
4. modify your contract, then run `yarn hardhat node`, or deploy on chain `yarn hardhat deploy --network <YOUR_NETWORK>`
5. copy your whitelist to `packages/hardhat/whitelist/whitelist.txt`
6. sign your whitelist `yarn sign-whitelist` , or `yarn sign-whitelist --network <YOUR_NETWORK>`
7. `yarn start` to start frontend
