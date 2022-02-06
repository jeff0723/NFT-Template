import { SupportedChainId } from '../connectors/index'
type AddressMap = { [chainId: number]: string }
export const TEMPLATE_NFT_ADDRESS: AddressMap = {
    [SupportedChainId.MAINNET]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    [SupportedChainId.RINKEBY]: '0xf7CaD30dfBAA9C12022538d20fACfCCb47efE524',
    [SupportedChainId.HARDHAT]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
}
export const DISCORD_LINK = "";
export const TWITTER_LINK = "";
export const MAX_SUPPLY = 10000;
export const START_TIME = new Date(2022, 2-1, 28, 22, 30).valueOf();
export const MINT_PRICE = 0.07;