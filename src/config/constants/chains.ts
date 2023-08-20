import { SUPPORTED_CHAINS, SupportedChainsType } from '@baseswapfi/sdk-core'
import { ChainId } from '@magikswap/sdk'

export const CHAIN_IDS_TO_NAMES = {
  [ChainId.BASE]: 'base',
  [ChainId.BASE_GOERLI]: 'base_goerli',
} as const

export function isSupportedChain(
  chainId: number | null | undefined | ChainId,
  featureFlags?: Record<number, boolean>,
): chainId is SupportedChainsType {
  if (featureFlags && chainId && chainId in featureFlags) {
    return featureFlags[chainId]
  }
  return !!chainId && SUPPORTED_CHAINS.indexOf(chainId) !== -1
}

export function asSupportedChain(
  chainId: number | null | undefined | ChainId,
  featureFlags?: Record<number, boolean>,
): SupportedChainsType | undefined {
  if (!chainId) return undefined
  if (featureFlags && chainId in featureFlags && !featureFlags[chainId]) {
    return undefined
  }
  return isSupportedChain(chainId) ? chainId : undefined
}
