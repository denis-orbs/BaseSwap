import { serializeTokens } from 'utils/serializeTokens'
import { DEFAULT_CHAIN_ID } from 'utils/providers'
import { ChainId } from '../../../packages/swap-sdk/src/constants'
import { TOKENS_CHAIN_MAP, bscTokens } from './tokens'
import { SerializedFarmConfig } from './types'

// const serializedTokens = serializeTokens(bscTokens)
const serializedTokens = serializeTokens(TOKENS_CHAIN_MAP[DEFAULT_CHAIN_ID])

export const CAKE_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

const farms: SerializedFarmConfig[] = [
  // {
  //   pid: 0,
  //   lpSymbol: 'ETH-BSWAP LP',
  //   lpAddresses: {
  //     [ChainId.BASE_GOERLI]: '0x26484B48418581993e538607e305b363c98125CA',
  //     [ChainId.BASE]: '',
  //   },
  //   token: serializedTokens.cake,
  //   quoteToken: serializedTokens.wbnb,
  // },
  // {
  //   pid: 1,
  //   lpSymbol: 'ETH-axlUSDC LP',
  //   lpAddresses: {
  //     [ChainId.BASE_GOERLI]: '0x61Bb3E29A49aCbd0160E6500c8261f3Ac8f0e431',
  //     [ChainId.BASE]: '',
  //   },
  //   token: serializedTokens.axlUsdc,
  //   quoteToken: serializedTokens.wbnb,
  // },
]

export default farms
