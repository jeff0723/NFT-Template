import { SupportedChainId } from '../connectors/index'
type AddressMap = { [chainId: number]: string }
export const TEMPLATE_NFT_ADDRESS: AddressMap = {
    [SupportedChainId.MAINNET]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    [SupportedChainId.RINKEBY]: '0x47EC596C581D9354dbCb0E2C00aBe298b51EB32A',
    [SupportedChainId.HARDHAT]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
}
export const DISCORD_LINK = "";
export const TWITTER_LINK = "";
export const MAX_SUPPLY = 10000;
export const START_TIME = new Date(2022, 2-1, 28, 22, 30).valueOf();
export const MINT_PRICE = 0.07;