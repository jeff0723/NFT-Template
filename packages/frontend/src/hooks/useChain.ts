import { networkConfigs } from "../helpers/networks";
import { Web3Provider } from '@ethersproject/providers';
import { hexStripZeros } from '@ethersproject/bytes';
import { BigNumber } from '@ethersproject/bignumber';

// provider.request returns Promise<any>, but wallet_switchEthereumChain must return null or throw
// see https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md for more info on wallet_switchEthereumChain
export async function addNetwork(library: Web3Provider, chainId: number): Promise<null | void> {
  if (!library?.provider?.request) {
    return
  }
  const formattedChainId = hexStripZeros(BigNumber.from(chainId).toHexString())
  const config = networkConfigs[formattedChainId];
  const { chainName, currencyName, currencySymbol, rpcUrl, blockExplorerUrl } =
    config;
    try {
      await library?.provider.request({
        method: "wallet_addEthereumChain",
        params: [
            {
              chainId: formattedChainId,
              chainName: chainName,
              rpcUrls: [rpcUrl],
              nativeCurrency: {
                name: currencyName,
                symbol: currencySymbol,
                decimals: 18,
              },
              blockExplorerUrls: [blockExplorerUrl],
            },
          ],
        })
    } catch (error: any) {
      console.log(error)
    }
}

export async function switchNetwork(library: Web3Provider, chainId: number) {
  if (!library?.provider?.request) {
    return
  }
  if (!chainId && library?.getNetwork) {
    ;({ chainId } = await library.getNetwork())
  }
  const formattedChainId = hexStripZeros(BigNumber.from(chainId).toHexString())
  try {
    await library?.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: formattedChainId }],
    })
  } catch (error: any) {
    // metamask (only known implementer) automatically switches after a network is added
    // the second call is done here because that behavior is not a part of the spec and cannot be relied upon in the future
    // metamask's behavior when switching to the current network is just to return null (a no-op)
    addNetwork(library, chainId);
  }
}