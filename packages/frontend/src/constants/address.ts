import { SupportedChainId } from '../connectors/index'
import LOCALHOST_ARTIFACT from '../deployments/localhost/TemplateNFT.json'
type AddressMap = { [chainId: number]: string }
export const TEMPLATE_NFT_ADDRESS: AddressMap = {
    [SupportedChainId.MAINNET]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    [SupportedChainId.RINKEBY]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    [SupportedChainId.HARDHAT]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',


}
