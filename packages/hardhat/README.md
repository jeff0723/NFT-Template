# Requirement

1. Three stage minting:
   - First stage: 0.1 ETH and 3000 mint for OG/WL to mint
   - Second stage: 0.5 ETH and 5000 mint for WL to mint
   - Third stage: 1 ETH for public mint
2. Signed whitelist:
   - Use EIP712 to do off-chain signing and on-chain verify.
   - Generate a address-signature map and store in frontend. When user click mint, automatically set parameters and mint
3. Others:
   - ERC721A
   - If Bulk mint is possible?

# Getting started

### install dependencies

```
   yarn
```

# How to start the project

### local testnet

```
   yarn hardhat node --watch
   yarn start
```

### mainnet

```
   yarn start
```
