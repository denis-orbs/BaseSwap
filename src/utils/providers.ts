import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@magikswap/sdk'

export const BSC_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://bsc.nodereal.io'

const providers: { [chainId in ChainId]?: StaticJsonRpcProvider | null } = {
  [ChainId.BASE_GOERLI]: null,
  // [ChainId.BASE_TESTNET]: null,
}

const RPC = {
  // [ChainId.ARBITRUM_ONE]: "https://arb1.arbitrum.io/rpc",
  // [ChainId.BASE]: 'https://developer-access-mainnet.base.org',
  [ChainId.BASE_GOERLI]: 'https://goerli.base.org',
  // [ChainId.FORK_BASE]: 'http://localhost:8545',
}

export function getChainRpcURL(chainId: ChainId) {
  return RPC[chainId]
}

export function getChainRpcProvider(chainId: ChainId) {
  // Avoid any weird memory leak issues
  if (providers[chainId]) return providers[chainId]

  const rpcProvider = new StaticJsonRpcProvider(getChainRpcURL(chainId))
  providers[chainId] = rpcProvider

  return providers[chainId]
}

export const DEFAULT_CHAIN_ID = ChainId.BASE_GOERLI

export const bscRpcProvider = getChainRpcProvider(DEFAULT_CHAIN_ID)

export default null
