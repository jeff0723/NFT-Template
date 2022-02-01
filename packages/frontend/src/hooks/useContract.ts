import { Contract } from '@ethersproject/contracts'
import { TemplateNFT, TemplateNFT__factory} from '../typechain'
import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core';
import { getContract } from '../utils/getContract'
import { TEMPLATE_NFT_ADDRESS } from '../constants/address';
export function useContract<T extends Contract = Contract>(
    addressOrAddressMap: string | { [chainId: number]: string } | undefined,
    ABI: any,
    withSignerIfPossible = true
): T | null {
    const { library, account, chainId } = useWeb3React()

    return useMemo(() => {
        if (!addressOrAddressMap || !ABI || !library || !chainId) return null
        let address: string | undefined
        if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
        else address = addressOrAddressMap[chainId]
        if (!address) return null
        try {
            return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export function useTemplateNFTContract() {
    return useContract<TemplateNFT>(TEMPLATE_NFT_ADDRESS, TemplateNFT__factory.abi, true);
}
