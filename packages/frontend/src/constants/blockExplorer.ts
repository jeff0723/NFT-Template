type AddressMap = { [chainId: number]: string }
enum SupportedChainId {
    POLYGON = 137,
    MUMBAI = 80001
  }

export const BLOCKEXPLORER_URL: AddressMap = {
    [SupportedChainId.POLYGON]: "https://polygonscan.com",
    [SupportedChainId.MUMBAI]: "https://mumbai.polygonscan.com",
}